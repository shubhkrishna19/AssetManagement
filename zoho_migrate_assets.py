import pandas as pd
import requests
import json
import time
from datetime import datetime

# Config
EXCEL_PATH = "c:/Users/shubh/Downloads/Asset Management Zoho/asset_12152025_040056.xlsx"
CREDS_PATH = "zoho_creds.json"
OWNER = "bluewudindia"
APP = "asset-management-system"
BASE_URL = f"https://www.zohoapis.com/creator/v2.1/data/{OWNER}/{APP}"

def get_tokens():
    with open(CREDS_PATH, "r") as f:
        creds = json.load(f)
    url = "https://accounts.zoho.com/oauth/v2/token"
    params = {
        "grant_type": "refresh_token",
        "client_id": creds["client_id"],
        "client_secret": creds["client_secret"],
        "refresh_token": creds["refresh_token"]
    }
    retries = 3
    while retries > 0:
        try:
            res = requests.post(url, params=params, timeout=60)
            token = res.json().get("access_token")
            if token:
                return token
            print(f"  - Token Error: {res.text}")
        except Exception as e:
            print(f"  - Token Handshake Error: {e}")
        retries -= 1
        time.sleep(2)
    return None

def fetch_employees(token):
    print("Caching Employees for lookups...")
    url = f"{BASE_URL}/report/employee_by_department"
    headers = {"Authorization": f"Zoho-oauthtoken {token}"}
    employees = {}
    
    # Simple fetch for mapping
    try:
        res = requests.get(url, headers=headers, timeout=60)
        if res.status_code == 200:
            data = res.json().get("data", [])
            for rec in data:
                # Name in Zoho is an object
                first = rec.get("name", {}).get("first_name", "")
                last = rec.get("name", {}).get("last_name", "")
                full = f"{first} {last}".strip()
                employees[full] = rec.get("ID")
        print(f"  + Cached {len(employees)} employees.")
    except Exception as e:
        print(f"  - Error fetching employees: {e}")
    return employees

def migrate():
    token = get_tokens()
    if not token:
        print("Failed to get token.")
        return
    
    emp_map = fetch_employees(token)
    headers = {"Authorization": f"Zoho-oauthtoken {token}"}
    
    df = pd.read_excel(EXCEL_PATH)
    print(f"Loaded {len(df)} assets for migration...")

    success_count = 0
    fail_count = 0

    for index, row in df.iterrows():
        # Date parsing
        raw_date = row.get('Purchase Date')
        acq_date = ""
        try:
            if pd.notna(raw_date):
                dt = pd.to_datetime(raw_date)
                acq_date = dt.strftime("%d-%b-%Y") # Zoho format: dd-MMM-yyyy
        except:
            pass

        # Cost parsing (handle commas)
        raw_cost = row.get('Cost')
        cost_val = 0.0
        try:
            if pd.notna(raw_cost):
                # Remove commas and convert to float
                cost_str = str(raw_cost).replace(",", "").strip()
                cost_val = float(cost_str)
        except Exception as e:
            print(f"  - Cost parse error for {raw_cost}: {e}")

        # Assigned User (Lookup)
        target_name = str(row.get('Assigned to')).strip() if pd.notna(row.get('Assigned to')) else ""
        emp_id = emp_map.get(target_name, "")

        payload = {
            "data": {
                "item_name": str(row.get('Description'))[:200] if pd.notna(row.get('Description')) else "Unknown Asset",
                "description": str(row.get('Description')) if pd.notna(row.get('Description')) else "",
                "status": str(row.get('Status')).strip() if pd.notna(row.get('Status')) else "Available",
                "acquisition_date": acq_date,
                "purchase_cost": cost_val,
                "assigned_user": target_name, # Also keep text version
                "department": str(row.get('Department')).strip() if pd.notna(row.get('Department')) else "Operations",
                "location": {"address_line_1": str(row.get('Location')) if pd.notna(row.get('Location')) else "Main Unit"},
                "asset_type": str(row.get('Category')).strip() if pd.notna(row.get('Category')) else "Hardware"
            }
        }

        print(f"[{index+1}/{len(df)}] Pushing {payload['data']['item_name']}...")
        retries = 2
        while retries >= 0:
            try:
                res = requests.post(f"{BASE_URL}/form/asset", headers=headers, json=payload, timeout=60)
                if res.status_code in [200, 201]:
                    success_count += 1
                    break
                else:
                    print(f"  - Failed (Status {res.status_code}): {res.text}")
                    fail_count += 1
                    break
            except Exception as e:
                if retries == 0:
                    print(f"  - Error: {e}")
                    fail_count += 1
                retries -= 1
                time.sleep(1)
        
        time.sleep(0.3)

    print(f"\n--- ASSET MIGRATION COMPLETE ---")
    print(f"Success: {success_count}")
    print(f"Failed: {fail_count}")

if __name__ == "__main__":
    migrate()

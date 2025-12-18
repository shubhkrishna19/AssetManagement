import pandas as pd
import requests
import json
import time

# Config
EXCEL_PATH = "c:/Users/shubh/Downloads/Asset Management Zoho/maintenances_12152025_040309.xlsx"
CREDS_PATH = "zoho_creds.json"
OWNER = "bluewudindia"
APP = "asset-management-system"
BASE_URL = f"https://www.zohoapis.com/creator/v2.1/data/{OWNER}/{APP}"

# Form for maintenance is likely 'maintenance_log' based on our probe
FORM_NAME = "maintenance_log"

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
    try:
        res = requests.post(url, params=params, timeout=60)
        return res.json().get("access_token")
    except:
        return None

def migrate():
    token = get_tokens()
    if not token:
        print("Failed to get token.")
        return
    
    headers = {"Authorization": f"Zoho-oauthtoken {token}"}
    
    df = pd.read_excel(EXCEL_PATH)
    print(f"Loaded {len(df)} maintenance records...")

    success_count = 0
    fail_count = 0

    for index, row in df.iterrows():
        # Date parsing
        raw_due_date = row.get('Maintenance Due Date')
        due_date = ""
        try:
            if pd.notna(raw_due_date):
                dt = pd.to_datetime(raw_due_date)
                due_date = dt.strftime("%d-%b-%Y")
        except:
            pass

        raw_comp_date = row.get('Maintenance Completion Date')
        comp_date = ""
        try:
            if pd.notna(raw_comp_date):
                dt = pd.to_datetime(raw_comp_date)
                comp_date = dt.strftime("%d-%b-%Y")
        except:
            pass

        payload = {
            "data": {
                "Title": str(row.get('Maintenance Title*')) if pd.notna(row.get('Maintenance Title*')) else "Scheduled Maintenance",
                "details": str(row.get('Maintenance Details')) if pd.notna(row.get('Maintenance Details')) else "",
                "due_date": due_date,
                "completion_date": comp_date,
                "cost": float(str(row.get('Maintenance Cost')).replace(",", "")) if pd.notna(row.get('Maintenance Cost')) else 0.0,
                "status": str(row.get('Maintenance Status')).strip() if pd.notna(row.get('Maintenance Status')) else "Completed",
                "asset_tag": str(row.get('Asset Tag ID*')).strip() if pd.notna(row.get('Asset Tag ID*')) else "",
                "maintenance_by": str(row.get('Maintenance By')).strip() if pd.notna(row.get('Maintenance By')) else ""
            }
        }

        print(f"[{index+1}/{len(df)}] Pushing maintenance for {payload['data']['asset_tag']}...")
        try:
            res = requests.post(f"{BASE_URL}/form/{FORM_NAME}", headers=headers, json=payload, timeout=60)
            if res.status_code in [200, 201]:
                success_count += 1
            else:
                print(f"  - Failed: {res.text}")
                fail_count += 1
        except Exception as e:
            print(f"  - Error: {e}")
            fail_count += 1
        
        time.sleep(0.3)

    print(f"\n--- MAINTENANCE MIGRATION COMPLETE ---")
    print(f"Success: {success_count}")
    print(f"Failed: {fail_count}")

if __name__ == "__main__":
    migrate()

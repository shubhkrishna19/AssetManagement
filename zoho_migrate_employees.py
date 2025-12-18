import pandas as pd
import requests
import json
import time

# Config
EXCEL_PATH = "c:/Users/shubh/Downloads/Asset Management Zoho/persons_12152025_040040.xlsx"
CREDS_PATH = "zoho_creds.json"
OWNER = "bluewudindia"
APP = "asset-management-system"
BASE_URL = f"https://www.zohoapis.com/creator/v2.1/data/{OWNER}/{APP}/form/employee"

def get_tokens():
    try:
        with open(CREDS_PATH, "r") as f:
            creds = json.load(f)
        url = "https://accounts.zoho.com/oauth/v2/token"
        params = {
            "grant_type": "refresh_token",
            "client_id": creds["client_id"],
            "client_secret": creds["client_secret"],
            "refresh_token": creds["refresh_token"]
        }
        res = requests.post(url, params=params, timeout=60)
        return res.json().get("access_token")
    except Exception as e:
        print(f"Token error: {e}")
        return None

def migrate():
    print("Fetching access token...")
    token = get_tokens()
    if not token:
        print("Failed to get token. Check network.")
        return
    
    headers = {"Authorization": f"Zoho-oauthtoken {token}"}
    
    df = pd.read_excel(EXCEL_PATH)
    print(f"Loaded {len(df)} employees calibration...")

    success_count = 0
    fail_count = 0

    for index, row in df.iterrows():
        # Name splitting logic
        full_name = str(row['Name']).strip()
        parts = full_name.split(" ")
        prefix = ""
        first = ""
        last = ""
        
        if parts[0] in ["Mr.", "Mrs.", "Ms."]:
            prefix = parts[0]
            first = parts[1] if len(parts) > 1 else ""
            last = " ".join(parts[2:]) if len(parts) > 2 else ""
        else:
            first = parts[0]
            last = " ".join(parts[1:]) if len(parts) > 1 else ""

        payload = {
            "data": {
                "name": {
                    "prefix": prefix,
                    "first_name": first,
                    "last_name": last
                },
                "email": str(row['Email']).strip() if pd.notna(row['Email']) else "",
                "phone_number": str(row['Phone']).strip() if pd.notna(row['Phone']) else "",
                "department": str(row['Department']).strip() if pd.notna(row['Department']) else "Operations",
                "designation": str(row['Title']).strip() if pd.notna(row['Title']) else "Executive",
                "exit_status": "Active"
            }
        }

        print(f"[{index+1}/{len(df)}] Pushing {full_name}...")
        retries = 3
        while retries > 0:
            try:
                res = requests.post(BASE_URL, headers=headers, json=payload, timeout=60)
                if res.status_code in [200, 201]:
                    success_count += 1
                    break
                else:
                    print(f"  - Failed (Status {res.status_code}): {res.text}")
                    fail_count += 1
                    break
            except Exception as e:
                retries -= 1
                if retries == 0:
                    print(f"  - Final Error: {e}")
                    fail_count += 1
                else:
                    print(f"  - Timeout/Error, retrying... ({retries} left)")
                    time.sleep(2)
        
        # Small delay
        time.sleep(0.3)

    print(f"\n--- MIGRATION COMPLETE ---")
    print(f"Success: {success_count}")
    print(f"Failed: {fail_count}")

if __name__ == "__main__":
    migrate()

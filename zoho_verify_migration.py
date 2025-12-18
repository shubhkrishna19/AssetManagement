import pandas as pd
import requests
import json

# Config
EXCEL_PATH = "c:/Users/shubh/Downloads/Asset Management Zoho/asset_12152025_040056.xlsx"
CREDS_PATH = "zoho_creds.json"
OWNER = "bluewudindia"
APP = "asset-management-system"
REPORT = "asset_Report" # Default report name

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
    return requests.post(url, params=params).json().get("access_token")

def verify():
    token = get_tokens()
    headers = {"Authorization": f"Zoho-oauthtoken {token}"}
    
    # 1. Load local data
    df = pd.read_excel(EXCEL_PATH)
    local_descriptions = set(df['Description'].astype(str).str.strip().tolist())
    
    # 2. Fetch Zoho data
    print("Fetching live data from Zoho...")
    url = f"https://www.zohoapis.com/creator/v2.1/data/{OWNER}/{APP}/report/{REPORT}"
    all_zoho_items = []
    
    start_index = 0
    limit = 200
    while True:
        res = requests.get(f"{url}?from={start_index}&limit={limit}", headers=headers)
        data = res.json().get("data", [])
        if not data:
            break
        all_zoho_items.extend(data)
        start_index += limit
        if len(data) < limit:
            break

    zoho_descriptions = set([str(x.get('item_name')).strip() for x in all_zoho_items])
    
    # 3. Compare
    missing = local_descriptions - zoho_descriptions
    
    print(f"\n--- VERIFICATION RESULTS ---")
    print(f"Local Assets: {len(local_descriptions)}")
    print(f"Zoho Assets: {len(zoho_descriptions)}")
    print(f"In Sync: {len(local_descriptions & zoho_descriptions)}")
    
    if missing:
        print(f"\n[!] MISSING IN ZOHO ({len(missing)} items):")
        for m in list(missing)[:10]:
            print(f"  - {m}")
        if len(missing) > 10:
            print("  - ... and more")
    else:
        print("\n[✓] ALL ASSETS VERIFIED IN ZOHO!")

if __name__ == "__main__":
    verify()

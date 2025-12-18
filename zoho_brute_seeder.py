import requests
import json

CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
REFRESH_TOKEN = "1000.e5cf59e5abfbc84e461ba2043cce4e5d9.48f4e72b854eaea4cd1d4b3e8e97b060"

def get_access_token(dc):
    url = f"https://accounts.zoho.{dc}/oauth/v2/token"
    params = {
        "grant_type": "refresh_token",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN
    }
    try:
        res = requests.post(url, params=params, timeout=5)
        data = res.json()
        return data.get("access_token")
    except:
        return None

# Test Endpoints
dcs = ["com", "in"]
owners = ["bluewudindia", "shubhkrishna19"]
app = "bluewud-ots"

# Sample Data
emp_data = {"data": {"Name": {"first_name": "Tony", "last_name": "Stark"}, "Email1": "tony@stark.com", "Department": "R&D"}}

found = False
for dc in dcs:
    print(f"Testing DC: {dc}")
    token = get_access_token(dc)
    if not token:
        print(f"  - Failed to get token for .{dc}")
        continue
    
    headers = {"Authorization": f"Zoho-oauthtoken {token}"}
    for owner in owners:
        url = f"https://creator.zoho.{dc}/api/v2/{owner}/{app}/form/employee/record"
        print(f"  - Testing Owner: {owner} at {url}")
        res = requests.post(url, headers=headers, json=emp_data)
        if res.status_code == 200:
            print(f"  !!! SUCCESS !!! Data seeded on {dc} with owner {owner}")
            # Seed the second employee and assets here now
            # Steve Rogers
            requests.post(url, headers=headers, json={"data": {"Name": {"first_name": "Steve", "last_name": "Rogers"}, "Email1": "steve@marvel.com", "Department": "Security"}})
            
            # Assets
            asset_url = f"https://creator.zoho.{dc}/api/v2/{owner}/{app}/form/asset/record"
            assets = [
                {"data": {"item_name": "MacBook Pro M3", "purchase_cost": 250000, "salvage_value": 50000, "useful_life_years": 3, "acquisition_date": "01-Jan-2024", "status": "Active"}},
                {"data": {"item_name": "Dell UltraSharp Monitor", "purchase_cost": 45000, "salvage_value": 5000, "useful_life_years": 5, "acquisition_date": "15-Jun-2023", "status": "Active"}}
            ]
            for a in assets:
                requests.post(asset_url, headers=headers, json=a)
            
            found = True
            break
        else:
            print(f"    - Failed: {res.status_code} | {res.json().get('description', res.text)}")
    
    if found:
        break

if not found:
    print("\nXXX ALL ENDPOINTS FAILED XXX")

import requests
import json

# Credentials
CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
GRANT_TOKEN = "1000.7247fb9ae5d0638f3f5ee55fc54d71a4.35cc3ab42ddc9197aa522eccaa45d84f"

def get_tokens():
    url = "https://accounts.zoho.com/oauth/v2/token"
    params = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": GRANT_TOKEN
    }
    res = requests.post(url, params=params)
    return res.json()

# 1. Exchange Grant Token
print("--- STARTING SILENT SEEDER ---")
tokens = get_tokens()
if "error" in tokens:
    print(f"FAILED TO GET TOKENS: {tokens}")
    exit()

access_token = tokens["access_token"]
refresh_token = tokens["refresh_token"]
print("SUCCESS: Tokens acquired.")

# 2. Find Working Endpoint & Seed
dcs = ["com"] # User confirmed zoho.com
owners = ["bluewudindia", "shubhkrishna19", "bluewudots"] # Common possibilities
app = "bluewud-ots"
headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}

def seed_data(dc, owner):
    base_url = f"https://creator.zoho.{dc}/api/v2/{owner}/{app}/form"
    
    # Test Employee Creation
    emp_payload = {"data": {"Name": {"first_name": "Tony", "last_name": "Stark"}, "Email1": "tony@stark.com", "Department": "R&D"}}
    res = requests.post(f"{base_url}/employee/record", headers=headers, json=emp_payload)
    
    if res.status_code == 200:
        print(f"!!! FOUND WORKING OWNER: {owner} !!!")
        print("Seeding more data...")
        
        # Steve Rogers
        requests.post(f"{base_url}/employee/record", headers=headers, json={"data": {"Name": {"first_name": "Steve", "last_name": "Rogers"}, "Email1": "steve@marvel.com", "Department": "Security"}})
        
        # Assets
        assets = [
            {"data": {"item_name": "MacBook Pro M3", "purchase_cost": 250000, "salvage_value": 50000, "useful_life_years": 3, "acquisition_date": "01-Jan-2024", "status": "Active"}},
            {"data": {"item_name": "Dell UltraSharp Monitor", "purchase_cost": 45000, "salvage_value": 5000, "useful_life_years": 5, "acquisition_date": "15-Jun-2023", "status": "Active"}}
        ]
        for a in assets:
            requests.post(f"{base_url}/asset/record", headers=headers, json=a)
        return True
    return False

found = False
for dc in dcs:
    for owner in owners:
        if seed_data(dc, owner):
            found = True
            break
    if found: break

if found:
    print("--- SEEDING COMPLETE. CHECK YOUR APP! ---")
    # Save the working refresh token to a file so we never lose it again
    with open("zoho_creds.json", "w") as f:
        json.dump({"refresh_token": refresh_token}, f)
else:
    print("--- FAILED TO FIND WORKING ENDPOINT ---")

import requests
import json
import time

# Credentials
CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
GRANT_TOKEN = "1000.241168a5d23641178fe2da775f8da907.658bb2dbb559c80548d0889a43b08874"

def get_tokens():
    url = "https://accounts.zoho.com/oauth/v2/token"
    params = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": GRANT_TOKEN
    }
    res = requests.post(url, params=params, timeout=30)
    return res.json()

print("--- SILENT SEEDER V2 ---")
tokens = get_tokens()
if "error" in tokens:
    print(f"FATAL ERROR: {tokens.get('error')}")
    print(tokens)
    exit()

access_token = tokens["access_token"]
refresh_token = tokens["refresh_token"]
print("SUCCESS: Tokens secured.")

# Save refresh token immediately to prevent loss
with open("zoho_creds.json", "w") as f:
    json.dump({"refresh_token": refresh_token, "client_id": CLIENT_ID, "client_secret": CLIENT_SECRET}, f, indent=2)

headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}

# 1. Identify Owner and App Link Name
def identify_owner():
    print("Identifying account owner...")
    url = "https://creator.zoho.com/api/v2/applications"
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        data = res.json()
        apps = data.get("applications", [])
        for app_obj in apps:
            if "bluewud" in app_obj.get("link_name", "").lower():
                # In V2, the endpoint returns link_name and workspace_name
                # The URL structure is /api/v2/{workspace_name}/{app_link_name}/...
                workspace = app_obj.get("workspace_name")
                link_name = app_obj.get("link_name")
                return workspace, link_name
    return None, None

owner, app_link = identify_owner()

if not owner or not app_link:
    print("FAILED: Could not identify the application owner or link name.")
    exit()

print(f"Target found: {owner} / {app_link}")

# 2. Seed Data
print("Seeding records...")
base_url = f"https://creator.zoho.com/api/v2/{owner}/{app_link}/form"

records = [
    {"form": "employee", "data": {"data": {"Name": {"first_name": "Tony", "last_name": "Stark"}, "Email1": "tony@stark.com", "Department": "R&D"}}},
    {"form": "employee", "data": {"data": {"Name": {"first_name": "Steve", "last_name": "Rogers"}, "Email1": "steve@marvel.com", "Department": "Security"}}},
    {"form": "asset", "data": {"data": {"item_name": "MacBook Pro M3", "purchase_cost": 250000, "salvage_value": 50000, "useful_life_years": 3, "acquisition_date": "01-Jan-2024", "status": "Active"}}},
    {"form": "asset", "data": {"data": {"item_name": "Dell UltraSharp Monitor", "purchase_cost": 45000, "salvage_value": 5000, "useful_life_years": 5, "acquisition_date": "15-Jun-2023", "status": "Active"}}}
]

for rec in records:
    url = f"{base_url}/{rec['form']}/record"
    res = requests.post(url, headers=headers, json=rec["data"])
    if res.status_code == 200:
        print(f"  + Added to {rec['form']}")
    else:
        print(f"  - Failed {rec['form']}: {res.text}")

print("\n--- SEEDING COMPLETE! ---")

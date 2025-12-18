import requests
import json
import time

# Credentials
CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
GRANT_TOKEN = "1000.705829f5ae2fa0a1af49debd9ec3709f.ff2b286a6af4cf314faa8f105aa17a51"

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

print("--- DEFINITIVE ASSET SEEDER ---")
tokens = get_tokens()
if "error" in tokens:
    print(f"FATAL ERROR: {tokens.get('error')}")
    exit()

access_token = tokens["access_token"]
refresh_token = tokens["refresh_token"]
print("SUCCESS: Connection established.")

# Save for future use
with open("zoho_creds.json", "w") as f:
    json.dump({"refresh_token": refresh_token, "client_id": CLIENT_ID, "client_secret": CLIENT_SECRET}, f, indent=2)

headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}

# 1. Find the CORRECT Asset Management App
print("Scanning for the correct application...")
res = requests.get("https://creator.zoho.com/api/v2/applications", headers=headers)
app_data = res.json()
target_owner = None
target_app = None

for app in app_data.get("applications", []):
    name = app.get("application_name", "")
    link = app.get("link_name", "")
    workspace = app.get("workspace_name", "")
    
    # Prioritizing exact matches to "Asset Management System" or link names with "asset"
    if "Asset Management System" in name or (link == "asset-management-system" and workspace == "bluewudindia"):
        target_owner = workspace
        target_app = link
        print(f"Found Target: {target_owner}/{target_app}")
        break

if not target_owner:
    print("FAILED: Could not find the Asset Management System application.")
    exit()

# 2. Seed Data
print("Seeding records...")
base_url = f"https://creator.zoho.com/api/v2/{target_owner}/{target_app}/form"

records = [
    {"form": "employee", "data": {"data": {"Name": {"first_name": "Tony", "last_name": "Stark"}, "Email1": "tony@stark.com", "Department": "R&D"}}},
    {"form": "employee", "data": {"data": {"Name": {"first_name": "Steve", "last_name": "Rogers"}, "Email1": "steve@marvel.com", "Department": "Security"}}},
    {"form": "asset", "data": {"data": {"item_name": "MacBook Pro M3", "purchase_cost": 250000, "salvage_value": 50000, "useful_life_years": 3, "acquisition_date": "01-Jan-2024", "status": "Active"}}},
    {"form": "asset", "data": {"data": {"item_name": "Dell UltraSharp Monitor", "purchase_cost": 45000, "salvage_value": 5000, "useful_life_years": 5, "acquisition_date": "15-Jun-2023", "status": "Active"}}}
]

for rec in records:
    url = f"{base_url}/{rec['form']}/record"
    try:
        res = requests.post(url, headers=headers, json=rec["data"], timeout=20)
        if res.status_code == 200:
            print(f"  + Added to {rec['form']}")
        else:
            print(f"  - Failed {rec['form']}: {res.json().get('description', res.text)}")
    except Exception as e:
        print(f"  - Exception on {rec['form']}: {e}")

print("\n--- DONE! YOUR APP IS NOW POPULATED ---")

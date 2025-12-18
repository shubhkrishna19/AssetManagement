import requests
import json

# Verified Credentials
with open("zoho_creds.json", "r") as f:
    creds = json.load(f)
    CLIENT_ID = creds["client_id"]
    CLIENT_SECRET = creds["client_secret"]
    REFRESH_TOKEN = creds["refresh_token"]

def get_access_token():
    url = "https://accounts.zoho.com/oauth/v2/token"
    params = {
        "grant_type": "refresh_token",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN
    }
    res = requests.post(url, params=params)
    return res.json().get("access_token")

token = get_access_token()
headers = {"Authorization": f"Zoho-oauthtoken {token}"}

# Definitive Path from Research (V2.1)
# Base URL for US: https://www.zohoapis.com
# Path: /creator/v2.1/data/{owner}/{app}/form/{form}
owner = "bluewudindia"
app = "asset-management-system"
base_url = f"https://www.zohoapis.com/creator/v2.1/data/{owner}/{app}/form"

print(f"--- SEEDING TO {owner}/{app} ---")

records = [
    {"form": "employee", "data": {"data": {"Name": {"first_name": "Tony", "last_name": "Stark"}, "Email1": "tony@stark.com", "Department": "R&D"}}},
    {"form": "asset", "data": {"data": {"item_name": "MacBook Pro M3", "purchase_cost": 250000, "salvage_value": 50000, "useful_life_years": 3, "acquisition_date": "01-Jan-2024", "status": "Active"}}}
]

for rec in records:
    url = f"{base_url}/{rec['form']}"
    try:
        print(f"Pushing to {url}...")
        # V2.1 documentation recommends this endpoint
        res = requests.post(url, headers=headers, json=rec["data"], timeout=120)
        if res.status_code in [200, 201]:
            print(f"  + Added Successfully to {rec['form']}")
        else:
            print(f"  - Failed {rec['form']} (Status {res.status_code}): {res.text}")
    except Exception as e:
        print(f"  - Exception on {rec['form']}: {e}")

print("\n--- SEEDING COMPLETE! ---")

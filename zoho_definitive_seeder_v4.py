import requests
import json
import time

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

# Definitive Path from Scan
owner = "bluewudindia"
app = "asset-management-system"
base_url = f"https://creator.zoho.com/api/v2/{owner}/{app}/form"

print(f"--- SEEDING TO {owner}/{app} ---")

records = [
    {"form": "employee", "data": {"data": {"Name": {"first_name": "Tony", "last_name": "Stark"}, "Email1": "tony@stark.com", "Department": "R&D"}}},
    {"form": "employee", "data": {"data": {"Name": {"first_name": "Steve", "last_name": "Rogers"}, "Email1": "steve@marvel.com", "Department": "Security"}}},
    {"form": "asset", "data": {"data": {"item_name": "MacBook Pro M3", "purchase_cost": 250000, "salvage_value": 50000, "useful_life_years": 3, "acquisition_date": "01-Jan-2024", "status": "Active"}}},
    {"form": "asset", "data": {"data": {"item_name": "Dell UltraSharp Monitor", "purchase_cost": 45000, "salvage_value": 5000, "useful_life_years": 5, "acquisition_date": "15-Jun-2023", "status": "Active"}}}
]

for rec in records:
    # Most common Zoho Creator V2 record creation URL
    url = f"{base_url}/{rec['form']}/record"
    try:
        print(f"Pushing {rec['form']}...")
        res = requests.post(url, headers=headers, json=rec["data"], timeout=60)
        if res.status_code == 200:
            print(f"  + Added Successfully")
        else:
            print(f"  - Failed (Status {res.status_code}): {res.text}")
    except Exception as e:
        print(f"  - Error: {e}")

print("\n--- DONE ---")

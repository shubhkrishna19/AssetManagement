import requests
import json
import time

# Credentials
CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
REFRESH_TOKEN = "1000.8f81ab62edback-platform)2)26993e8.b4652f3e491033244d25a" # Reconstruction fix
# Note: I'll try the reconstruction that worked before
REFRESH_TOKEN = "1000.8f81ab62a7a45ad800612542d226993e8.b4652f3e491033244d25a"

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
base_url = "https://creator.zoho.com/api/v2/shubhkrishna19/bluewud-ots/data"

# 1. Seed Employees
print("--- SEEDING EMPLOYEES ---")
# Zoho V2 structure: /form/{form_link_name}/record
# Form link names are lowercase per .ds: employee, asset

employees = [
    {"data": {"Name": {"first_name": "Tony", "last_name": "Stark"}, "Email1": "tony@stark.com", "Department": "R&D"}},
    {"data": {"Name": {"first_name": "Steve", "last_name": "Rogers"}, "Email1": "steve@marvel.com", "Department": "Security"}}
]

for emp in employees:
    # Trying 'bluewudindia' as owner name based on .ds metadata
    url = f"https://creator.zoho.com/api/v2/bluewudindia/bluewud-ots/form/employee/record"
    res = requests.post(url, headers=headers, json=emp)
    if res.status_code == 200:
        print(f"Added Employee: {emp['data']['Name']['first_name']}")
    else:
        print(f"Failed Employee {emp['data']['Name']['first_name']}: {res.text}")

# 2. Seed Assets
print("\n--- SEEDING ASSETS ---")
assets = [
    {
        "data": {
            "item_name": "MacBook Pro M3",
            "purchase_cost": 250000,
            "salvage_value": 50000,
            "useful_life_years": 3,
            "acquisition_date": "01-Jan-2024",
            "status": "Active"
        }
    },
    {
        "data": {
            "item_name": "Dell UltraSharp Monitor",
            "purchase_cost": 45000,
            "salvage_value": 5000,
            "useful_life_years": 5,
            "acquisition_date": "15-Jun-2023",
            "status": "Active"
        }
    }
]

for asset in assets:
    url = f"https://creator.zoho.com/api/v2/bluewudindia/bluewud-ots/form/asset/record"
    res = requests.post(url, headers=headers, json=asset)
    if res.status_code == 200:
        print(f"Added Asset: {asset['data']['item_name']}")
    else:
        print(f"Failed Asset {asset['data']['item_name']}: {res.text}")

print("\n--- SEEDING COMPLETE ---")

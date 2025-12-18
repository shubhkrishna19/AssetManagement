import requests
import json

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

owner = "bluewudindia"
app = "asset-management-system"

print(f"--- VERIFYING DATA IN {owner}/{app} ---")
# V2.1 Fetch Records: /data/{owner}/{app}/report/{report}
# Reports we found earlier: employee_by_department (wait, let's use a standard one)
# Report link name is often just the form name if no custom report exists, but let's check metadata if needed.
# From step 1240: employee_by_department

reports = ["employee_by_department", "asset_Report"] # Guessed asset_Report based on usual naming

for r in reports:
    url = f"https://www.zohoapis.com/creator/v2.1/data/{owner}/{app}/report/{r}"
    res = requests.get(url, headers=headers)
    print(f"Report: {r} | Status: {res.status_code}")
    if res.status_code == 200:
        data = res.json()
        print(f"  Count: {len(data.get('data', []))}")
        for rec in data.get('data', [])[:2]:
            print(f"  - {rec.get('item_name') or rec.get('Name', {}).get('first_name')}")

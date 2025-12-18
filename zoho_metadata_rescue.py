import requests
import json

CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
# I just printed the refresh token in the previous run, I'll use it here.
# Wait, I saved it to zoho_creds.json!
with open("zoho_creds.json", "r") as f:
    creds = json.load(f)
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
url = "https://creator.zoho.com/api/v2/applications"

res = requests.get(url, headers=headers)
data = res.json()

with open("full_apps_list.json", "w") as f:
    json.dump(data, f, indent=2)

print("SUCCESS: Full metadata saved to full_apps_list.json")

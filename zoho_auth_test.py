import requests
import json

# Updated User Credentials (Self Client)
CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
GRANT_TOKEN = "1000.ef5f733f3664bbad8caece492d182bcd.10dcd1c3a290fd9f06d82fee366421c1"

# 1. Exchange Grant Token for Access/Refresh Tokens
auth_url = "https://accounts.zoho.com/oauth/v2/token"
params = {
    "grant_type": "authorization_code",
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "code": GRANT_TOKEN
}

print("--- EXCHANGING TOKENS ---")
response = requests.post(auth_url, params=params)
auth_data = response.json()

if "error" in auth_data:
    print(f"FAILED: {auth_data['error']}")
    print(auth_data)
    exit()

access_token = auth_data["access_token"]
refresh_token = auth_data.get("refresh_token")
print(f"SUCCESS: Access Token acquired.")
if refresh_token:
    print(f"SUCCESS: Refresh Token acquired: {refresh_token}")

# 2. Heartbeat Test: List Applications
print("\n--- HEARTBEAT TEST (Fetching Metadata) ---")
user_info_url = "https://creator.zoho.com/api/v2/applications"
headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}

res = requests.get(user_info_url, headers=headers)
apps_data = res.json()

if res.status_code == 200:
    print("CONNECTION VERIFIED: I can see your Zoho Creator apps!")
    # Filter for our app if possible, or just show count
    apps = apps_data.get("applications", [])
    print(f"Total Apps Found: {len(apps)}")
    for app in apps:
        print(f"- {app.get('application_name')} (Link: {app.get('link_name')})")
else:
    print(f"HEARTBEAT FAILED: {res.status_code}")
    print(res.text)

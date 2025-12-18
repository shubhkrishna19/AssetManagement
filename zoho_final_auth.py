import requests
import json

# Self Client Credentials
CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
GRANT_TOKEN = "1000.66d634ada0826357c3201e04b7058051.922037c5561a7bb686c15377a3d243a6"

# 1. Exchange Grant Token for Access/Refresh Tokens
print("--- EXCHANGING TOKENS ---")
auth_url = "https://accounts.zoho.com/oauth/v2/token"
params = {
    "grant_type": "authorization_code",
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "code": GRANT_TOKEN
}

res = requests.post(auth_url, params=params)
auth_data = res.json()

if "error" in auth_data:
    print(f"FAILED: {auth_data['error']}")
    print(auth_data)
    exit()

access_token = auth_data["access_token"]
refresh_token = auth_data["refresh_token"]
print(f"SUCCESS: Tokens acquired!")
print(f"REFRESH_TOKEN: {refresh_token}")

# 2. Get Account Information (Owner Name)
print("\n--- IDENTIFYING ACCOUNT OWNER ---")
headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}
# Applications metadata is a reliable way to see the owner in the link names
app_url = "https://creator.zoho.com/api/v2/applications"

res = requests.get(app_url, headers=headers)
app_data = res.json()

if res.status_code == 200:
    apps = app_data.get("applications", [])
    if apps:
        # Link name is usually "owner/app-name" or just "app-name" in V2
        # But we need the owner string for the POST URL.
        # Let's try to get user details directly.
        user_url = "https://creator.zoho.com/api/v2/account" # Experimental V2 endpoint
        user_res = requests.get(user_url, headers=headers)
        print("User Meta Data:")
        print(json.dumps(user_res.json(), indent=2))
    else:
        print("No apps found.")
else:
    print(f"Metadata Fetch Failed: {res.status_code}")
    print(res.text)

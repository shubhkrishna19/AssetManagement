import requests
import json

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

print("--- TOKEN EXCHANGE ---")
tokens = get_tokens()
if "error" in tokens:
    print(f"ERROR: {tokens}")
    exit()

access_token = tokens["access_token"]
refresh_token = tokens["refresh_token"]
print("SUCCESS: Tokens acquired.")

# Save refresh token immediately
with open("zoho_creds.json", "w") as f:
    json.dump({"refresh_token": refresh_token}, f)

# Find Owner
headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}
url = "https://creator.zoho.com/api/v2/applications"
res = requests.get(url, headers=headers)
data = res.json()

print("\n--- APPLICATION METADATA ---")
print(json.dumps(data, indent=2))

import requests
import json

CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
GRANT_TOKEN = "1000.66d634ada0826357c3201e04b7058051.922037c5561a7bb686c15377a3d243a6"

auth_url = "https://accounts.zoho.com/oauth/v2/token"
params = {
    "grant_type": "authorization_code",
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "code": GRANT_TOKEN
}

res = requests.post(auth_url, params=params)
data = res.json()

with open("zoho_token_debug.json", "w") as f:
    json.dump(data, f, indent=2)

if "access_token" in data:
    print("Tokens written to zoho_token_debug.json")
else:
    print(f"Error: {data.get('error')}")

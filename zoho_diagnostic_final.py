import requests
import json

with open("zoho_creds.json", "r") as f:
    creds = json.load(f)
    CLIENT_ID = creds["client_id"]
    CLIENT_SECRET = creds["client_secret"]
    REFRESH_TOKEN = creds["refresh_token"]

def get_access_token():
    # Trying with .com first, but let's check the response to see if we are in the right place
    url = "https://accounts.zoho.com/oauth/v2/token"
    params = {
        "grant_type": "refresh_token",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN
    }
    res = requests.post(url, params=params, timeout=30)
    data = res.json()
    return data.get("access_token"), data

access_token, token_data = get_access_token()
print(f"Token Data: {json.dumps(token_data, indent=2)}")

headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}

# Application Scan
print("\n--- APPLICATION SCAN ---")
res = requests.get("https://creator.zoho.com/api/v2/applications", headers=headers)
print(f"Status: {res.status_code}")
print(f"Body: {json.dumps(res.json(), indent=2)}")

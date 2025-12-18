import requests
import json

CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
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
url = "https://creator.zoho.com/api/v2/applications"
headers = {"Authorization": f"Zoho-oauthtoken {token}"}

res = requests.get(url, headers=headers)
data = res.json()

print(json.dumps(data, indent=2))

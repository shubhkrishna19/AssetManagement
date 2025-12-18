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

# TARGET APP
owner = "bluewudindia"
app = "asset-management-system"

print(f"--- FORMS IN {owner}/{app} ---")
url = f"https://creator.zoho.com/api/v2/{owner}/{app}/metadata/forms"

res = requests.get(url, headers=headers)
data = res.json()

if res.status_code == 200:
    forms = data.get("forms", [])
    for f in forms:
        print(f"Form: {f.get('display_name')} | Link: {f.get('link_name')}")
else:
    print(f"Failed: {res.status_code} | {res.text}")

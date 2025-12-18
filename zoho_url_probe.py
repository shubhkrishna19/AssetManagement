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

# Variations to test
dcs = ["com", "in"]
variations = [
    "bluewudindia/bluewud-ots",
    "shubhkrishna19/bluewud-ots",
    "bluewudindia/bluewudots",
    "shubhkrishna19/bluewudots"
]

print("--- PROBING URL STRUCTURES ---")
for d in dcs:
    for v in variations:
        url = f"https://creator.zoho.{d}/api/v2/{v}/metadata/form"
        res = requests.get(url, headers=headers)
        print(f"Testing: {url} | Status: {res.status_code}")
    if res.status_code == 200:
        print("!!! SUCCESS !!!")
        data = res.json()
        forms = data.get("forms", [])
        for f in forms:
            print(f"  - Form: {f.get('display_name')} | Link: {f.get('link_name')}")
        # Save the winner
        with open("zoho_winner.txt", "w") as f_win:
            f_win.write(v)
    else:
        print(f"  Fail: {res.text[:100]}")

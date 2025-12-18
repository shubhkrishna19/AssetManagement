import requests
import json

CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
REFRESH_TOKEN = "1000.e5cf59e5abfbc84e461ba2043cce4e5d9.48f4e72b854eaea4cd1d4b3e8e97b060"

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

if res.status_code == 200:
    apps = data.get("applications", [])
    print(f"Found {len(apps)} applications:")
    for app in apps:
        # Note: V2 applications endpoint returns 'application_name', 'link_name', and potentially 'owner_name'
        # If 'owner_name' is missing, it might be in the higher level or we can try a metadata call.
        print(f"App: {app.get('application_name')} | Link: {app.get('link_name')} | Owner: {app.get('workspace_name') or 'Not Found'}")
        # Sometimes workspace_name is the owner name in V2
    print(json.dumps(data, indent=2))
else:
    print(f"Failed: {res.status_code}")
    print(res.text)

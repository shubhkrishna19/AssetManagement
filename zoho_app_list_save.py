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
    # Long timeout for unreliable connection
    res = requests.post(url, params=params, timeout=60)
    return res.json().get("access_token")

try:
    token = get_access_token()
    headers = {"Authorization": f"Zoho-oauthtoken {token}"}
    url = "https://creator.zoho.com/api/v2/applications"

    res = requests.get(url, headers=headers, timeout=60)
    data = res.json()

    with open("app_links.txt", "w") as f_out:
        for app in data.get("applications", []):
            line = f"Display: {app.get('application_name')} | Link: {app.get('link_name')} | Workspace: {app.get('workspace_name')}\n"
            f_out.write(line)
    
    print("SUCCESS: App links saved to app_links.txt")
except Exception as e:
    print(f"FAILED: {e}")

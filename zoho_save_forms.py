import requests
import json

with open("zoho_creds.json", "r") as f:
    creds = json.load(f)

def get_token():
    url = "https://accounts.zoho.com/oauth/v2/token"
    params = {
        "grant_type": "refresh_token",
        "client_id": creds["client_id"],
        "client_secret": creds["client_secret"],
        "refresh_token": creds["refresh_token"]
    }
    return requests.post(url, params=params).json().get("access_token")

token = get_token()
headers = {"Authorization": f"Zoho-oauthtoken {token}"}
owner = "bluewudindia"
app = "asset-management-system"

url = f"https://creator.zoho.com/api/v2/{owner}/{app}/forms"
res = requests.get(url, headers=headers)
data = res.json()

with open("ACTUAL_FORMS_LIST.txt", "w") as out:
    if "forms" in data:
        for f in data["forms"]:
            out.write(f"FORM: {f.get('display_name')} | Link: {f.get('link_name')}\n")
    else:
        out.write(str(data))
print("SAVED TO ACTUAL_FORMS_LIST.txt")

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
if not token:
    print("Failed to get token.")
    exit()

headers = {"Authorization": f"Zoho-oauthtoken {token}"}

regions = ["com", "in", "eu", "com.au"]
owners = ["bluewudindia", "shubhkrishna19"]
app = "bluewud-ots"
form = "employee"

print("--- PROBING ENDPOINTS ---")
for r in regions:
    for o in owners:
        url = f"https://creator.zoho.{r}/api/v2/{o}/{app}/form/{form}/record"
        try:
            # We use a GET to the metadata version of this to check existence without adding data
            meta_url = f"https://creator.zoho.{r}/api/v2/{o}/{app}/metadata/form/{form}"
            res = requests.get(meta_url, headers=headers, timeout=5)
            print(f"URL: {meta_url} | Status: {res.status_code}")
            if res.status_code == 200:
                print(f"!!! FOUND SUCCESSFUL ENDPOINT: {r} / {o}")
                # Save this to a file for later
                with open("zoho_endpoint.txt", "w") as f:
                    f.write(f"{r}\n{o}")
        except Exception as e:
            print(f"Error for {r}/{o}: {e}")

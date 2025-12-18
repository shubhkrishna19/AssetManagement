import requests
import json

# Using the persistent refresh token
with open("zoho_creds.json", "r") as f:
    creds = json.load(f)
    REFRESH_TOKEN = creds["refresh_token"]
    CLIENT_ID = creds["client_id"]
    CLIENT_SECRET = creds["client_secret"]

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
    print("Refresh token failed. Need new grant code.")
    exit()

headers = {"Authorization": f"Zoho-oauthtoken {token}"}
owner = "bluewudindia"
app = "asset-management-system"
form = "employee"

# Official Documentation Patterns (V2 and V2.1)
patterns = [
    f"https://www.zohoapis.com/creator/v2.1/data/{owner}/{app}/form/{form}",
    f"https://creator.zoho.com/api/v2/{owner}/{app}/form/{form}",
]

print("--- PROBING OFFICIAL ENDPOINTS ---")
for p in patterns:
    print(f"Testing: {p}")
    # POST with some sample data to see if it accepts it
    payload = {
        "data": {
            "Name": {"first_name": "Antigravity", "last_name": "Test"},
            "Email1": "test@antigravity.ai",
            "Department": "IT"
        }
    }
    res = requests.post(p, headers=headers, json=payload)
    print(f"  Status: {res.status_code}")
    print(f"  Response: {res.text}")
    if res.status_code == 200:
        print("!!! SUCCESS !!! WINNING URL FOUND.")
        break

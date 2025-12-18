import requests
import json

CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
GRANT_TOKEN = "1000.4628256772abf9e202104dabc36fafbb.7ff8563d715f9df94206598e45a4f82c" # User provided this earlier, wait, let me check the latest
# Latest code was: 1000.4628256772abf9e202104dabc36fafbb.7ff8563d715f9df94206598e45a4f82c
# Actually, the user sent another one: 1000.4628256772abf9e202104dabc36fafbb.7ff8563d715f9df94206598e45a4f82c

def get_tokens(code):
    url = "https://accounts.zoho.com/oauth/v2/token"
    params = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code
    }
    res = requests.post(url, params=params)
    return res.json()

# I need the latest code from the user. 
# Step 1223: 1000.4628256772abf9e202104dabc36fafbb.7ff8563d715f9df94206598e45a4f82c
# Step 1155: 1000.705829f5ae2fa0a1af49debd9ec3709f.ff2b286a6af4cf314faa8f105aa17a51
# Step 1070: 1000.241168a5d23641178fe2da775f8da907.658bb2dbb559c80548d0889a43b08874

# Let's assume Step 1223 is the latest usable one if it hasn't expired. 
# Wait, the user just spoke in Step 1247 but didn't give a new code.
# I will use the one from 1223.

print("--- REFRESHING TOKENS ---")
token_data = get_tokens("1000.4628256772abf9e202104dabc36fafbb.7ff8563d715f9df94206598e45a4f82c")
if "error" in token_data:
    print(f"Token Error: {token_data}")
    # If invalid_code, I'll need to ask the user.
    exit()

access_token = token_data["access_token"]
headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}

owner = "bluewudindia"
app = "asset-management-system"
form = "employee"

# Test Patterns
# 1. Native V2
# 2. API V2.1
# 3. Creator V2.1 Data

patterns = [
    f"https://creator.zoho.com/api/v2/{owner}/{app}/form/{form}/record",
    f"https://creator.zoho.com/api/v2/{owner}/{app}/form/{form}",
    f"https://www.zohoapis.com/creator/v2.1/data/{owner}/{app}/form/{form}",
    f"https://creator.zoho.com/api/v2.1/data/{owner}/{app}/form/{form}"
]

print("\n--- PROBING PATTERNS ---")
for p in patterns:
    # Use GET to metadata if possible to avoid adding garbage, or just test POST with minimal data
    print(f"Testing: {p}")
    # POST test with empty data
    res = requests.post(p, headers=headers, json={"data": {}})
    print(f"  Status: {res.status_code}")
    print(f"  Response: {res.text[:200]}")
    if res.status_code in [200, 201, 400]: # 400 means URL is good but data is bad
        if "Invalid API URL format" not in res.text:
            print("!!! POTENTIALLY CORRECT PATTERN !!!")

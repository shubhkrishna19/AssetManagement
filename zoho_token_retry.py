import requests
import json
import time

CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
GRANT_TOKEN = "1000.7247fb9ae5d0638f3f5ee55fc54d71a4.35cc3ab42ddc9197aa522eccaa45d84f"

def get_tokens():
    url = "https://accounts.zoho.com/oauth/v2/token"
    params = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": GRANT_TOKEN
    }
    # Using a long timeout to avoid ConnectTimeout errors
    res = requests.post(url, params=params, timeout=30)
    return res.json()

print("--- TOKEN EXCHANGE (RETRY) ---")
try:
    tokens = get_tokens()
    if "error" in tokens:
        print(f"ERROR: {tokens}")
    else:
        print("SUCCESS: Tokens acquired.")
        with open("zoho_creds.json", "w") as f:
            json.dump(tokens, f, indent=2)
        print("Tokens saved to zoho_creds.json")
except Exception as e:
    print(f"EXCEPTION: {e}")

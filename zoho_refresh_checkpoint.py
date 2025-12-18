import requests
import json

CLIENT_ID = "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA"
CLIENT_SECRET = "f60455449d30984ca1c026a872a2395cb5100dba36"
GRANT_CODE = "1000.81c85471be9ed8de45dbf186f7632d24.af24ffcce43e23a05c0501b7b0901cb6"

def update_creds():
    url = "https://accounts.zoho.com/oauth/v2/token"
    params = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": GRANT_CODE
    }
    res = requests.post(url, params=params)
    data = res.json()
    
    if "refresh_token" in data:
        with open("zoho_creds.json", "w") as f:
            json.dump({
                "refresh_token": data["refresh_token"],
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET
            }, f, indent=2)
        print("SUCCESS: Credentials updated with new long-lived Refresh Token!")
    else:
        print(f"FAILED: {data}")

if __name__ == "__main__":
    update_creds()

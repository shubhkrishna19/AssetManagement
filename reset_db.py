import requests
import json

API_URL = "https://websitewireframeproject-895469053.development.catalystserverless.com/server/bridgex"

def reset_database():
    print(f"Targeting: {API_URL}")
    print("⚠️  WARNING: ALL DATA WILL BE DELETED ⚠️")
    
    payload = {"action": "reset_all"}
    
    try:
        response = requests.post(API_URL, json=payload, timeout=60)
        print(f"Status: {response.status_code}")
        print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_database()

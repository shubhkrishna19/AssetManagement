import requests
import time

# Corrected Function URL based on User Input
API_URL = "https://websitewireframeproject-895469053.development.catalystserverless.com/server/bridgex"

def test_connection():
    print(f"Testing connectivity to: {API_URL}")
    print("Sending GET request (mode=count)...")
    
    try:
        response = requests.get(f"{API_URL}?mode=count", timeout=30)
        print(f"Status Code: {response.status_code}")
        print("Response Body:")
        print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_connection()

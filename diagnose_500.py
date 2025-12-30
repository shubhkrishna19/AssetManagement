
import requests

URL = "https://websitewireframeproject-895469053.development.catalystserverless.com/server/bridgex"
ACTIONS = ['getAssets', 'getConsumables', 'getVendors', 'getReservations', 'getDepartments']

for action in ACTIONS:
    print(f"Testing action: {action}...")
    try:
        response = requests.post(URL, json={"action": action}, timeout=10)
        print(f"Status Code: {response.status_code}")
        if response.status_code != 200:
            print(f"Error Message: {response.text}")
        else:
            data = response.json()
            print(f"Success! Records found: {len(data.get('records', []))}")
    except Exception as e:
        print(f"Request failed: {e}")
    print("-" * 30)

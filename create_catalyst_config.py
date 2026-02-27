import json
import time
import os

config_dir = r"c:\Users\shubh\.zohocatalyst"
if not os.path.exists(config_dir):
    os.makedirs(config_dir)

config = {
    "client_id": "1000.CGGK0M58LOXYJG9IR23UZ5G7XAZZBA",
    "client_secret": "f60455449d30984ca1c026a872a2395cb5100dba36",
    "refresh_token": "1000.4bafe1c127fd18b663e8d64a73b05efc.7c5bf473c5d741f24cd21070f53d54b9",
    "access_token": "1000.f67d525f49aa7e3225943fe372198175.a418dde220fb700f79bd1e7410e32d98",
    "accounts_url": "https://accounts.zoho.com",
    "expiry_time": int(time.time() * 1000) + 3600000 
}

config_path = os.path.join(config_dir, "config.json")
with open(config_path, "w") as f:
    json.dump(config, f, indent=4)

print(f"Created {config_path}")

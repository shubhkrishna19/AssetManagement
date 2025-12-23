import pandas as pd
import os
import json

folder = r"c:\Users\shubh\Downloads\Asset Management Zoho\dataexport"
files_to_check = [
    "asset_12152025_040056.xlsx",
    "contracts_12152025_040123.xlsx",
    "customers_12152025_040131.xlsx",
    "maintenances_12152025_040309.xlsx",
    "persons_12152025_040040.xlsx"
]

results = {}

for f in files_to_check:
    path = os.path.join(folder, f)
    if os.path.exists(path):
        try:
            df = pd.read_excel(path, nrows=0) # Read only headers
            results[f] = list(df.columns)
        except Exception as e:
            results[f] = str(e)
    else:
        results[f] = "File not found"

with open('headers.json', 'w') as f:
    json.dump(results, f, indent=2)
print("Headers written to headers.json")

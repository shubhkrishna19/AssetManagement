import pandas as pd
import os

DATA_FOLDER = r"c:\Users\shubh\Downloads\Asset Management Zoho\dataexport"
files = [
    "contracts_12152025_040123.xlsx", 
    "asset_12152025_040056.xlsx"
]

for f in files:
    path = os.path.join(DATA_FOLDER, f)
    if os.path.exists(path):
        try:
            df = pd.read_excel(path)
            print(f"--- {f} ---")
            print(f"Rows: {len(df)}")
            print(f"Columns: {list(df.columns)}")
        except Exception as e:
            print(f"Error {f}: {e}")
    else:
        print(f"Missing {f}")

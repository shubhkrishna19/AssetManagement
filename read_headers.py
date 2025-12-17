import pandas as pd
import os

files = {
    "Asset": "asset_12152025_040056.xlsx",
    "Persons": "persons_12152025_040040.xlsx",
    "Maintenance": "maintenances_12152025_040309.xlsx",
    "Category": "categories_12152025_040106.xlsx"
}

for key, filename in files.items():
    try:
        path = f"c:/Users/shubh/Downloads/Asset Management Zoho/{filename}"
        df = pd.read_excel(path)
        print(f"--- {key} Columns ---")
        for col in df.columns:
            print(col)
        print("\n")
    except Exception as e:
        print(f"Error reading {key}: {e}")

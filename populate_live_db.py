import pandas as pd
import requests
import json
import os
import datetime
import time

# CONFIGURATION
# ------------------------------------------------------------------
API_URL = "https://websitewireframeproject-895469053.development.catalystserverless.com/server/bridgex"
DATA_FOLDER = r"c:\Users\shubh\Downloads\Asset Management Zoho\dataexport"
# ------------------------------------------------------------------

# Field Mapping: Excel Header -> Database Column
# Note: Use EXACT Case for DocStore Column Names
MAPPINGS = {
    "Assets": {
        "file": "asset_12152025_040056.xlsx",
        "map": {
            "Asset Tag ID": "Asset_ID",
            "Description": "Item_Name",
            "Purchased from": "Vendor_Name",
            "Purchase Date": "Purchase_Date",
            "Serial No": "Serial_Number",
            "Assigned to": "Assigned_User",
            "Cost": "Cost",
            "Status": "Status",
            "Category": "Category",
            "Location": "Location",
            "Brand": "Brand",
            "Model": "Model",
            "Site": "Site",
            "Department": "Department"
        }
    },
    "Contracts": {
        "file": "contracts_12152025_040123.xlsx",
        "map": {
            "Contract No.": "Contract_No",
            "Title": "Title",
            "Vendor": "Vendor",
            "Start Date": "Start_Date",
            "End Date": "End_Date",
            "Cost": "Cost",
            "Active": "Active",
            "Hyperlink": "Hyperlink"
        }
    },
    # "Employees": {
    #     "file": "persons_12152025_040040.xlsx",
    #     "map": {
    #         "Employee ID": "Employee_ID",
    #         "Name": "Name",
    #         "Email": "Email",
    #         "Title": "Title",
    #         "Department": "Department"
    #     }
    # },
    # "Maintenance": {
    #     "file": "maintenances_12152025_040309.xlsx",
    #     "map": {
    #         "Maintenance Title*": "Maintenance_Title",
    #         "Asset Tag ID*": "Asset_ID",
    #         "Maintenance Due Date": "Due_Date",
    #         "Maintenance Cost": "Cost",
    #         "Maintenance Status": "Status"
    #     }
    # }
}

def clean_data(val):
    if pd.isna(val):
        return None
    if isinstance(val, str):
        val = val.strip()
        # Catalyst VarChar limit safety (especially for Hyperlink)
        if len(val) > 255:
            val = val[:255]
        return val
    if isinstance(val, (pd.Timestamp, datetime.date, datetime.datetime)):
        return val.strftime('%Y-%m-%d')
    return str(val).strip()

def process_import():
    print(f"🚀 Starting Data Import to: {API_URL}")
    print("-" * 50)

    for table_name, config in MAPPINGS.items():
        file_path = os.path.join(DATA_FOLDER, config['file'])
        if not os.path.exists(file_path):
            print(f"⚠️ Skipped {table_name}: File not found ({config['file']})")
            continue

        print(f"📄 Processing {table_name} from {config['file']}...")
        
        try:
            df = pd.read_excel(file_path)
            records = []
            
            for _, row in df.iterrows():
                record = {}
                mapping = config['map']
                
                for excel_col, db_col in mapping.items():
                    if excel_col in row:
                        val = clean_data(row[excel_col])
                        if val is not None:
                            record[db_col] = val
                
                # Required ID generation if missing (Catalyst needs logic, but we send raw)
                if record:
                    records.append(record)

            # Send in chunks (Catalyst API limit safety)
            CHUNK_SIZE = 2
            for i in range(0, len(records), CHUNK_SIZE):
                time.sleep(0.5) # Rate limit protection
                chunk = records[i:i+CHUNK_SIZE]
                if not chunk: continue
                
                payload = {
                    "action": "import",
                    "table_name": table_name,
                    "data": chunk
                }
                
                # print(f"   -> Uploading Chunk {i//CHUNK_SIZE + 1} ({len(chunk)} records)...")
                try:
                    resp = requests.post(API_URL, json=payload, headers={'Content-Type': 'application/json'})
                    if resp.status_code == 200:
                        print(f"   ✅ Chunk {i//CHUNK_SIZE + 1} Success")
                    else:
                        print(f"   ❌ Chunk {i//CHUNK_SIZE + 1} Failed: {resp.text}")
                except Exception as e:
                     print(f"   ❌ Network Error: {e}")

        except Exception as e:
            print(f"❌ Error processing {table_name}: {e}")

    print("-" * 50)
    print("🏁 Import Job Completed.")

if __name__ == "__main__":
    process_import()

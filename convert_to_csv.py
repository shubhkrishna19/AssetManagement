import pandas as pd
import os
import shutil

# CONFIGURATION
# ------------------------------------------------------------------
DATA_FOLDER = r"c:\Users\shubh\Downloads\Asset Management Zoho\dataexport"
OUTPUT_FOLDER = r"c:\Users\shubh\Downloads\Asset Management Zoho\csv_ready_for_upload"
# ------------------------------------------------------------------

# Mappings (Identical to before)
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
    "Employees": {
        "file": "persons_12152025_040040.xlsx",
        "map": {
            "Employee ID": "Employee_ID",
            "Name": "Name",
            "Email": "Email",
            "Title": "Title",
            "Department": "Department"
        }
    },
    "Maintenance": {
        "file": "maintenances_12152025_040309.xlsx",
        "map": {
            "Maintenance Title*": "Maintenance_Title",
            "Asset Tag ID*": "Asset_ID",
            "Maintenance Due Date": "Due_Date",
            "Maintenance Cost": "Cost",
            "Maintenance Status": "Status"
        }
    }
}

def convert():
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)
        
    print(f"📂 Preparing CSVs in: {OUTPUT_FOLDER}")
    print("-" * 50)

    for table_name, config in MAPPINGS.items():
        file_path = os.path.join(DATA_FOLDER, config['file'])
        if not os.path.exists(file_path):
            print(f"⚠️ Skipped {table_name}: File not found")
            continue

        try:
            # Read Excel
            df = pd.read_excel(file_path)
            
            # Select ONLY mapped columns and rename them
            db_columns = {}
            for excel_col, db_col in config['map'].items():
                if excel_col in df.columns:
                    db_columns[excel_col] = db_col
            
            final_df = df[list(db_columns.keys())].rename(columns=db_columns)

            # DATA CLEANING RULES
            # 1. Truncate Hyperlinks in Contracts
            if table_name == "Contracts" and "Hyperlink" in final_df.columns:
                final_df["Hyperlink"] = final_df["Hyperlink"].astype(str).str.slice(0, 255)
            
            # 2. General string truncation for safety (optional but good)
            object_cols = final_df.select_dtypes(include=['object']).columns
            for col in object_cols:
                 final_df[col] = final_df[col].astype(str).str.slice(0, 255)

            # Save as CSV
            output_path = os.path.join(OUTPUT_FOLDER, f"{table_name}.csv")
            final_df.to_csv(output_path, index=False)
            
            print(f"✅ Generated: {table_name}.csv ({len(final_df)} rows)")
            
        except Exception as e:
            print(f"❌ Error {table_name}: {e}")

    print("-" * 50)
    print("👉 ACTION: Go to Catalyst Console > Data Store > Table > Import Data > Upload these CSVs.")

if __name__ == "__main__":
    convert()

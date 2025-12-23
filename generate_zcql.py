import pandas as pd
import os
import datetime
import re

# CONFIGURATION
# ------------------------------------------------------------------
DATA_FOLDER = r"c:\Users\shubh\Downloads\Asset Management Zoho\dataexport"
OUTPUT_FOLDER = r"c:\Users\shubh\Downloads\Asset Management Zoho\zcql_queries"
BATCH_SIZE = 50
# ------------------------------------------------------------------

MAPPINGS = {
    "Assets": {
        "file": "asset_12152025_040056.xlsx",
        "map": {
            "Asset Tag ID": "Asset_ID",
            "Description": "Item_Name",
            "Cost": "Cost",
            "Purchase Date": "Purchase_Date",
            "Serial No": "Serial_Number",
            "Purchased from": "Vendor_Name",
            "Location": "Location",
            "Category": "Category",
            "Brand": "Brand",
            "Model": "Model",
            "Site": "Site",
            "Department": "Department",
            "Assigned to": "Assigned_User",
            "Status": "Status"
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
    },
     "Vendors": {
        "file": "customers_12152025_040131.xlsx",
        "map": {
             "Name": "Name",
             "Company": "Company",
             "Email": "Email",
             "Phone": "Phone",
             "Category": "Category"
        }
    }
}

def clean_val_sql(val, col_name, table_name):
    if pd.isna(val) or val == "":
        return "NULL"
    
    # Clean String
    val_str = str(val).strip()

    # RULE: Remove commas from Cost
    if "Cost" in col_name and "," in val_str:
        val_str = val_str.replace(",", "")
        
    # RULE: Fix Asset_ID prefixes (e.g. 1AT-001 -> AT-001)
    if col_name == "Asset_ID":
        val_str = re.sub(r'^\d+(?=AT-)', '', val_str)

    # RULE: Truncate Hyperlink
    if col_name == "Hyperlink" and len(val_str) > 255:
        val_str = val_str[:255]

    if isinstance(val, (bool,)):
        return str(val).lower() # true/false
    
    # Try to return number for Cost if possible, else string
    if "Cost" in col_name:
        try:
            return str(float(val_str))
        except:
            pass # Fallback to string

    if isinstance(val, (pd.Timestamp, datetime.date, datetime.datetime)):
        return f"'{val.strftime('%Y-%m-%d')}'"
        
    # Escape SQL
    val_str = val_str.replace("'", "''") 
    return f"'{val_str}'"

def generate():
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)
        
    print(f"📂 Generating ZCQL (Batched) in: {OUTPUT_FOLDER}")

    for table_name, config in MAPPINGS.items():
        file_path = os.path.join(DATA_FOLDER, config['file'])
        if not os.path.exists(file_path):
            continue

        try:
            df = pd.read_excel(file_path)
            
            # Extract mapped columns
            mapped_cols = list(config['map'].keys())
            db_cols = list(config['map'].values()) # e.g. ['Asset_ID', 'Cost', ...]
            
            all_queries = ["START TRANSACTION;"]
            
            # Process in Batches
            current_batch_vals = []
            
            rows_iter = df.iterrows()
            total_rows = len(df)
            
            for i, (index, row) in enumerate(rows_iter):
                vals = []
                for mapping_key in mapped_cols: # mapping_key is Excel header
                    db_col_name = config['map'][mapping_key]
                    val = row.get(mapping_key, None)
                    vals.append(clean_val_sql(val, db_col_name, table_name))
                
                # Create (v1, v2, v3) string
                row_val_str = f"({', '.join(vals)})"
                current_batch_vals.append(row_val_str)
                
                # If batch full or last row, write INSERT
                if len(current_batch_vals) >= BATCH_SIZE or i == total_rows - 1:
                    cols_str = ", ".join(db_cols)
                    # Join all rows: (v1), (v2), (v3)
                    all_values_block = ", ".join(current_batch_vals)
                    
                    sql = f"INSERT INTO {table_name} ({cols_str}) VALUES {all_values_block};"
                    all_queries.append(sql)
                    current_batch_vals = [] # Reset

            all_queries.append("COMMIT;")
            
            # Save to file
            output_file = os.path.join(OUTPUT_FOLDER, f"insert_{table_name}.sql")
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write("\n\n".join(all_queries))
                
            print(f"✅ Generated: insert_{table_name}.sql ({len(df)} rows -> {len(all_queries)-2} batches)")
            
        except Exception as e:
            print(f"❌ Error {table_name}: {e}")

if __name__ == "__main__":
    generate()

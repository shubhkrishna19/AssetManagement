import zipfile
import os

def create_zip():
    source_dir = r"functions\bridgex"
    output_filename = "bridgex_v2_final.zip"
    
    # INCLUDE config, but now it matches the console (AdvancedIO + Node20)
    files_to_zip = ['index.js', 'package.json', 'catalyst-config.json']
    
    print(f"Creating {output_filename}...")
    
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files_to_zip:
            file_path = os.path.join(source_dir, file)
            if os.path.exists(file_path):
                print(f"Adding {file}...")
                zipf.write(file_path, arcname=file)
            else:
                print(f"WARNING: {file} not found!")

    print("Zip created successfully.")

if __name__ == "__main__":
    create_zip()

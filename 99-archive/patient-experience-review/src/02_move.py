import os
import shutil

DATA_FOLDER = 'data'
SOURCE_FILE = 'src/move_files.txt'

def copy_file_to_subdirectories(src_file, data_folder):
    """
    Copies a file from a source directory to a destination within the data folder.

    Args:
    src_file (str): The path of the source file.
    data_folder (str): The root folder for data processing.
    """
    # Extract the product folder name (e.g., 'prod1') from the source path
    parts = src_file.split('/')
    if 'raw' in parts and len(parts) > 2:
        prod_folder = parts[2]  # Assuming the structure is 'data/raw/prodX/...'
        dest_folder = os.path.join(data_folder, 'processed', prod_folder)

        # Create destination folder if it doesn't exist
        if not os.path.exists(dest_folder):
            os.makedirs(dest_folder)

        # Full path for destination file
        dest_file = os.path.join(dest_folder, os.path.basename(src_file))

        # Copy the file
        shutil.copy(src_file, dest_file)
        print(f"Copied {src_file} to {dest_folder}")
    else:
        print(f"Invalid file path: {src_file}")

def copy_file(src_file, data_folder):
    """
    Copies a file from a source directory to a consolidated folder within the data folder.
    Appends the final subdirectory name to the file name.

    Args:
    src_file (str): The path of the source file.
    data_folder (str): The root folder for data processing.
    """
    parts = src_file.split('/')
    if 'raw' in parts and len(parts) > 2:
        prod_folder = parts[2]  # Extract the final subdirectory name
        dest_folder = os.path.join(data_folder, 'consolidated')

        # Create destination folder if it doesn't exist
        if not os.path.exists(dest_folder):
            os.makedirs(dest_folder)

        # Update the filename to include the final subdirectory name
        new_file_name = f"{prod_folder}-{os.path.basename(src_file)}"
        dest_file = os.path.join(dest_folder, new_file_name)

        # Copy the file
        shutil.copy(src_file, dest_file)
        print(f"Copied {src_file} to {dest_file}")
    else:
        print(f"Invalid file path: {src_file}")

def main():
    """
    Main function to execute the script.
    """
    # Read the list of files to copy from the external text file
    try:
        with open(SOURCE_FILE, 'r') as file:
            for line in file:
                file_path = line.strip()  # Remove any leading/trailing whitespace
                if file_path:
                    copy_file(file_path, DATA_FOLDER)
    except IOError as e:
        print(f"Error opening or reading file: {e}")

if __name__ == "__main__":
    main()

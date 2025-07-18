from aiforge.utils.file_utils import get_file
from aiforge.utils.json_utils import process_json_data


def parse_user_data(file_path=None):
    try:
        # If no file_path is provided, use the default
        if file_path is None:
            json_data = get_file("user_data.json", directory="tmp")
        else:
            json_data = get_file(file_path)

        # Process the JSON data
        users = process_json_data(json_data, key_path="users")

        if users is None:
            print("Error: No user data found or invalid JSON structure")
            return []

        # Extract and print user information
        for user in users:
            print(
                f"ID: {user.get('id')}, Name: {user.get('name')}, Email: {user.get('email')}"
            )

        return users
    except FileNotFoundError:
        print("Error: File not found in specified location")
        return []
    except Exception as e:
        print(f"Error: {str(e)}")
        return []


if __name__ == "__main__":
    parse_user_data()

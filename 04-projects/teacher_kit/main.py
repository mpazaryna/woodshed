from teacher_kit.utils.json_util import read_json_file


def print_first_element_of_json(file_path):
    """
    Reads a JSON file and prints the first element if it's a list.

    :param file_path: Path to the JSON file.
    """
    # Read the JSON file
    data = read_json_file(file_path)

    # Check if the data is a list and has at least one element
    if isinstance(data, list) and data:
        # Print the first element
        print("First element of the JSON file:", data[0])
    else:
        print("The JSON file is empty or not a list.")


def main():
    # Specify the path to your JSON file
    file_path = "teacher_kit/data/asana.json"

    # Call the function to print the first element of the JSON file
    print_first_element_of_json(file_path)


if __name__ == "__main__":
    main()

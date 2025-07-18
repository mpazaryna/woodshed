# json_util.py

import json


def read_json_file(file_path):
    """
    Reads a JSON file and returns its contents.

    :param file_path: Path to the JSON file.
    :return: Parsed JSON data.
    """
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data


def write_json_file(file_path, data):
    """
    Writes data to a JSON file.

    :param file_path: Path to the JSON file.
    :param data: Data to be written to the JSON file.
    """
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


# Example usage:
# asanas = read_json_file('teacher_kit/data/asana.json')
# print(asanas)

# Example usage:
# write_json_file('teacher_kit/data/output.json', {'key': 'value'})

import logging
from typing import Dict, List, Optional

from aiforge.utils.json_utils import read_json_file

# Configure logging
logging.basicConfig(level=logging.INFO)


def load_asanas(
    file_path: str = "asana.json", directory: str = "tmp"
) -> List[Dict[str, str]]:
    asanas: Optional[List[Dict[str, str]]] = read_json_file(
        file_path, directory=directory
    )
    if asanas is None:
        raise ValueError(
            "Failed to load asanas data. Check the logs for more information."
        )
    return asanas


def print_asanas(asanas: List[Dict[str, str]]):
    logging.info(f"Loaded {len(asanas)} asanas: ")
    for asana in asanas[:5]:  # Print first 5 asanas as an example
        logging.info(
            f"ID: {asana['id']}, Name: {asana['name']}, Sanskrit: {asana['sanskrit']}"
        )
    logging.info("...")


def main():
    try:
        asanas = load_asanas()
        print_asanas(asanas)
    except ValueError as e:
        logging.error(f"Error: {str(e)}")


if __name__ == "__main__":
    main()

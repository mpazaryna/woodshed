import json
import logging
from pathlib import Path

import pandas as pd

from risk_kit.config import config

# Configure logging
logging.basicConfig(filename=config.log_file, level=logging.DEBUG)
logger = logging.getLogger(__name__)


# Function to read data from a CSV file
def read_data_from_csv(file_path):
    data = pd.read_csv(file_path)
    return data.to_numpy()  # Convert DataFrame to NumPy array


# Function to write JSON output to a file
def write_json(output, output_path=None):
    output_path = output_path or Path(config.output_json_path)
    logger.info(f"Writing JSON output to: {output_path}")

    try:
        with output_path.open("w") as json_file:
            json.dump(output, json_file, indent=4)
        logger.info(f"JSON output written to {output_path}")
    except Exception as e:
        logger.error(f"Error writing JSON file: {e}")

    return output

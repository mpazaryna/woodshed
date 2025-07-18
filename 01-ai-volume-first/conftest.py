import logging

import pytest


@pytest.fixture(autouse=True)
def configure_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        handlers=[
            logging.FileHandler("/Users/mpaz/workspace/woodshed-ai/logs/test.log"),
            logging.StreamHandler(),
        ],
    )

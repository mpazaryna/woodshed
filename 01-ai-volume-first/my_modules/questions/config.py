from pathlib import Path
from typing import NamedTuple


class ConfigTuple(NamedTuple):
    perplexity_api_key: str
    output_dir: Path
    log_file: str
    log_to_file: bool
    model_name: str
    base_url: str

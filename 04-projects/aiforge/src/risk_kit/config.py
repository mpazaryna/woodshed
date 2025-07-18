import logging
import os
from functools import cached_property
from pathlib import Path


class RiskKitConfig:
    """
    A configuration class for managing directories in the RiskKit module.
    """

    PROJECT_NAME = "RISKKIT"

    @cached_property
    def project_root(self):
        """Lazy-loaded project root directory."""
        env_root = os.environ.get(f"{self.PROJECT_NAME}_PROJECT_ROOT")
        return Path(env_root) if env_root else Path(__file__).parent.parent.parent

    @cached_property
    def logs_dir(self):
        """Lazy-loaded logs directory."""
        return (
            Path(__file__).parent.parent.parent / "logs"
        )  # Updated to point to the root logs directory

    @cached_property
    def data_dir(self):
        """Lazy-loaded data directory."""
        return self._get_directory(f"{self.PROJECT_NAME}_DATA_DIR", "data")

    def _get_directory(self, env_var, default_name):
        """
        Sets up a directory based on environment variables or defaults.
        """
        env_dir = os.environ.get(env_var)
        if env_dir:
            dir_path = Path(env_dir)
        else:
            dir_path = self.project_root / default_name

        return dir_path

    def ensure_directories_exist(self):
        """
        Ensures all directories exist and sets up logging.
        """
        for dir_path in [self.logs_dir, self.data_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        self.setup_logging()

    @cached_property
    def log_file(self):
        """Lazy-loaded log file path."""
        return self.logs_dir / LOGGING_FILENAME

    def setup_logging(self, file_level=logging.DEBUG, console_level=logging.INFO):
        """Set up logging configuration."""
        logger = logging.getLogger()
        logger.setLevel(logging.DEBUG)  # Set root logger to lowest level

        file_handler = logging.FileHandler(
            self.logs_dir / LOGGING_FILENAME
        )  # Updated log file path
        file_handler.setLevel(file_level)

        console_handler = logging.StreamHandler()
        console_handler.setLevel(console_level)

        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)

        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

    @property
    def output_json_path(self):
        """Returns the full path for the output JSON file."""
        return str(self.logs_dir / OUTPUT_JSON_FILENAME)


# Constants
LOGGING_FILENAME = "risk_kit.log"
LOGGING_LEVEL = logging.DEBUG
OUTPUT_JSON_FILENAME = "risk_assessment_output.json"

# Global instance
config = RiskKitConfig()

# Update the OUTPUT_JSON_FILENAME to use the logs_dir
OUTPUT_JSON_PATH = config.output_json_path

# You might also want to add other constants that might be used across your project
DATA_DIRECTORY = config.project_root / "data"

import os
from functools import cached_property
from pathlib import Path


class AiForgeConfig:
    """
    A configuration class for managing directories in the AiForge project.
    """

    PROJECT_NAME = "AIFORGE"

    @cached_property
    def project_root(self):
        """Lazy-loaded project root directory."""
        env_root = os.environ.get(f"{self.PROJECT_NAME}_PROJECT_ROOT")
        return Path(env_root) if env_root else Path.cwd()

    @cached_property
    def data_dir(self):
        """Lazy-loaded data directory."""
        return self._get_directory(f"{self.PROJECT_NAME}_DATA_DIR", "data")

    @cached_property
    def tmp_dir(self):
        """Lazy-loaded temporary directory."""
        return self._get_directory(f"{self.PROJECT_NAME}_TMP_DIR", "tmp")

    @cached_property
    def test_data_dir(self):
        """Lazy-loaded test data directory."""
        return self._get_directory(f"{self.PROJECT_NAME}_TEST_DATA_DIR", "data/test")

    @cached_property
    def logs_dir(self):
        """Lazy-loaded logs directory."""
        return self._get_directory(f"{self.PROJECT_NAME}_LOGS_DIR", "logs")

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
        Ensures all directories exist. Call this method explicitly when you want to create the directories.
        """
        for dir_path in [
            self.data_dir,
            self.tmp_dir,
            self.test_data_dir,
            self.logs_dir,
        ]:
            dir_path.mkdir(parents=True, exist_ok=True)


# Create a global instance of the configuration
config = AiForgeConfig()

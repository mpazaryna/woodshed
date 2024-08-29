import os
import subprocess
import sys
from pathlib import Path


def run_command(command, show_output=False):
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0 or show_output:
        print(f"Running: {' '.join(command)}")
        print(result.stdout)
        if result.stderr:
            print(f"Error: {result.stderr}")
    return result.returncode


def activate_venv(venv_path):
    if sys.platform == "win32":
        site_packages = venv_path / "Lib" / "site-packages"
    else:
        site_packages = list(venv_path.glob("lib/python*/site-packages"))[0]
    sys.path.insert(0, str(site_packages))
    os.environ[
        "PATH"
    ] = f"{venv_path/'bin' if sys.platform != 'win32' else venv_path/'Scripts'}:{os.environ['PATH']}"


def get_python_files(root_dir, exclude_files=None):
    if exclude_files is None:
        exclude_files = set()
    return [
        os.path.join(root, file)
        for root, _, files in os.walk(root_dir)
        for file in files
        if file.endswith(".py")
        and ".lint-venv" not in root
        and os.path.join(root, file) not in exclude_files
    ]


def main():
    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent
    venv_path = repo_root / ".lint-venv"
    ini_config = repo_root / "lint-config.ini"

    if not venv_path.exists():
        print(f"Error: Virtual environment not found at {venv_path}")
        sys.exit(1)
    if not ini_config.exists():
        print(f"Error: Config file not found at {ini_config}")
        sys.exit(1)

    activate_venv(venv_path)

    # Exclude the root directory version of lint-format-script.py
    exclude_files = {str(repo_root / "lint-format-script.py")}
    python_files = get_python_files(repo_root, exclude_files)

    tools = [
        (
            "isort",
            [sys.executable, "-m", "isort", "--settings-path", str(ini_config)]
            + python_files,
        ),
        ("Black", [sys.executable, "-m", "black"] + python_files),
        (
            "Flake8",
            [sys.executable, "-m", "flake8", "--config", str(ini_config)]
            + python_files,
        ),
        (
            "MyPy",
            [sys.executable, "-m", "mypy", "--config-file", str(ini_config)]
            + python_files,
        ),
    ]

    exit_code = 0
    for tool, command in tools:
        result = run_command(command)
        if result != 0:
            print(f"{tool} found issues.")
            exit_code = 1

    if exit_code == 0:
        print("All checks passed successfully.")
    else:
        print("Linting found issues. Please fix them and run the script again.")
    sys.exit(exit_code)


if __name__ == "__main__":
    main()

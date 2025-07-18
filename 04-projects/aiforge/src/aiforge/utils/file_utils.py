from pathlib import Path
from typing import IO, List, Tuple, Union

from aiforge.config import config


def write_to_file(
    content: Union[str, List[Tuple[str, str]]],
    output_filename: str,
    directory: str = "tmp",
) -> Path:
    """
    Write content to a file in the specified directory.

    Args:
        content (Union[str, List[Tuple[str, str]]]): The content to write. If a string, writes directly.
                                                     If a list of tuples, each tuple should be (title, content).
        output_filename (str): The name of the file to save the content.
        directory (str): The directory to save the file in. Options: "data", "tmp". Defaults to "tmp".

    Returns:
        Path: The path to the written file.
    """
    output_dir = get_directory(directory)
    output_file_path = output_dir / output_filename

    if isinstance(content, str):
        with open(output_file_path, "w") as f:
            f.write(content)
    else:
        with open(output_file_path, "w") as f:
            for title, text in content:
                f.write(f"Content from {title}: \n{text}\n\n")

    return output_file_path


def get_file(
    filename: str,
    directory: str = "tmp",
    binary: bool = False,
) -> Union[str, bytes]:
    """
    Retrieve content from a file in the specified directory.

    Args:
        filename (str): The name of the file to retrieve.
        directory (str): The directory to look in. Options: "data", "tmp". Defaults to "tmp".
        binary (bool): If True, read file in binary mode.

    Returns:
        Union[str, bytes]: The content of the file.
    """
    file_dir = get_directory(directory)
    file_path = file_dir / filename

    mode = "rb" if binary else "r"
    with open(file_path, mode) as f:
        return f.read()


def open_project_file(
    filename: str,
    directory: str = "tmp",
    mode: str = "r",
) -> IO:
    """
    Open a file from the specified directory of the project.

    Args:
        filename (str): The name of the file to open.
        directory (str): The directory to look in. Options: "data", "tmp". Defaults to "tmp".
        mode (str): The mode in which to open the file. Defaults to 'r' (read mode).

    Returns:
        IO: The opened file object.

    Raises:
        FileNotFoundError: If the file is not found in the specified directory.
    """
    file_dir = get_directory(directory)
    file_path = file_dir / filename

    if "w" in mode or "a" in mode or file_path.exists():
        return open(file_path, mode)
    else:
        raise FileNotFoundError(f"File {filename} not in {directory} directory.")


def get_directory(directory: str = "tmp") -> Path:
    """
    Get the appropriate directory based on the input.

    Args:
        directory (str): The directory to use. Options: "data", "tmp". Defaults to "tmp".

    Returns:
        Path: The path to the specified directory.

    Raises:
        ValueError: If an invalid directory is specified.
    """
    if directory == "data":
        return config.data_dir
    elif directory == "tmp":
        return config.tmp_dir
    else:
        raise ValueError("Invalid directory specified. Use 'data' or 'tmp'.")

import os
import tempfile
import time
from pathlib import Path
from unittest.mock import patch

import matplotlib.pyplot as plt  # Import plt here
import pandas as pd
import pytest

from trading_kit.exceptions import InvalidDataError
from trading_kit.utils.visualization import plot_line_chart


def test_plot_line_chart(monkeypatch):
    """Test the plot_line_chart function."""
    # Create sample data
    data = [1, 2, 3, 4, 5]

    # Mock plt.show to prevent the plot from displaying during the test
    monkeypatch.setattr("matplotlib.pyplot.show", lambda: None)

    # Call the function
    plot_line_chart(data, title="Test Chart", xlabel="Index", ylabel="Values")


def test_plot_line_chart_with_x_values(monkeypatch):
    """Test the plot_line_chart function with custom x_values."""
    # Create sample data
    data = [1, 2, 3, 4, 5]
    x_values = ["A", "B", "C", "D", "E"]

    # Mock plt.show to prevent the plot from displaying during the test
    monkeypatch.setattr("matplotlib.pyplot.show", lambda: None)

    # Call the function
    plot_line_chart(
        data,
        x_values=x_values,
        title="Test Chart",
        xlabel="Categories",
        ylabel="Values",
    )


def test_plot_line_chart_save():
    """Test the plot_line_chart function and save the plot to a file."""
    # Create sample data
    data = [1, 2, 3, 4, 5]

    # Use patch to mock plt.savefig
    with patch("matplotlib.pyplot.savefig") as mock_savefig:
        # Call the function to save the plot
        plot_line_chart(
            data,
            title="Test Chart",
            xlabel="Index",
            ylabel="Values",
            save_path="test_chart.png",
        )

        # Check if the save function was called with the correct filename
        mock_savefig.assert_called_once_with("test_chart.png")  # Example filename


def test_plot_line_chart_actual_save():
    """Test the plot_line_chart function and actually save the plot to the project's tmp folder."""
    # Create sample data
    data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    # Define the path for the file in the project's tmp folder
    project_root = Path(
        __file__
    ).parent.parent.parent  # Go up three levels from the test file
    tmp_folder = project_root / "tmp"
    tmp_folder.mkdir(exist_ok=True)  # Create tmp folder if it doesn't exist
    file_name = "test_chart_actual.png"
    file_path = tmp_folder / file_name

    # Call the function to save the plot
    plot_line_chart(
        data,
        title="Test Chart",
        xlabel="Index",
        ylabel="Values",
        save_path=str(file_path),
    )

    # Check if the file was created and has content
    assert file_path.exists(), f"File {file_path} does not exist"
    assert file_path.stat().st_size > 0, f"File {file_path} is empty"

    print(f"Plot saved to: {file_path}")
    print("You can now examine the file manually.")


def test_invalid_data():
    """Test that the function raises an error for invalid data."""
    with pytest.raises(InvalidDataError):
        plot_line_chart(["a", "b", "c"])


def test_invalid_x_values():
    """Test that the function raises an error when x_values length doesn't match data."""
    with pytest.raises(InvalidDataError):
        plot_line_chart([1, 2, 3], x_values=["A", "B"])

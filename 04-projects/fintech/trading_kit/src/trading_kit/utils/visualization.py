import os
import random
import warnings
from typing import List, Optional, Union

import matplotlib.pyplot as plt

from trading_kit.exceptions import InvalidDataError, InvalidThresholdError


def plot_line_chart(
    data: Union[List[float], List[int]],
    x_values: Optional[List[Union[float, int, str]]] = None,
    title: str = "Line Chart",
    xlabel: str = "X-axis",
    ylabel: str = "Y-axis",
    save_path: Optional[str] = None,
    max_points: int = 1000,
) -> None:
    """Plot a line chart for the given data and optionally save it to a file."""
    if not isinstance(data, list) or not all(isinstance(x, (int, float)) for x in data):
        raise InvalidDataError("Input data must be a list of numbers.")

    if not data:
        raise InvalidDataError("Input data cannot be empty.")

    if len(data) == 1:
        warnings.warn(
            "Single data point detected. The plot may not be visually meaningful."
        )

    # Prepare data and x_values
    if x_values is None:
        x_values = list(range(len(data)))
    else:
        if len(x_values) != len(data):
            raise InvalidDataError("x_values must have the same length as data.")

    # Sample data if it's too large
    if len(data) > max_points:
        indices = sorted(random.sample(range(len(data)), max_points))
        data = [data[i] for i in indices]
        x_values = [x_values[i] for i in indices]
        warnings.warn(
            f"Data has been sampled to {max_points} points for performance reasons."
        )

    # Sort the data if x_values are strings
    if all(isinstance(x, str) for x in x_values):
        sorted_pairs = sorted(zip(x_values, data))
        x_values, data = zip(*sorted_pairs)

    # Set up a non-interactive backend if necessary
    if not plt.get_backend() or plt.get_backend() == "agg":
        plt.switch_backend("agg")

    plt.figure(figsize=(10, 5))
    plt.plot(data, marker="o")
    plt.title(title)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.grid()

    if save_path:
        try:
            plt.savefig(save_path)
        except (IOError, OSError) as e:
            raise IOError(f"Failed to save the plot: {str(e)}")
    else:
        if plt.get_backend() != "agg":
            plt.show()
        else:
            warnings.warn(
                "Plot cannot be displayed in non-interactive environment. Use save_path to save the plot."
            )

    plt.close()  # Close the figure to free up memory

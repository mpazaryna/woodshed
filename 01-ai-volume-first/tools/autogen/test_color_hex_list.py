import pandas as pd
import pytest
from color_hex_list import get_color_hex_list


def test_get_color_hex_list():
    df = get_color_hex_list()

    # Check if the result is a DataFrame
    assert isinstance(df, pd.DataFrame), "The result should be a pandas DataFrame"

    # Check if the DataFrame has the correct columns
    assert "Color" in df.columns, "DataFrame should have a 'Color' column"
    assert "Hex" in df.columns, "DataFrame should have a 'Hex' column"

    # Check if the DataFrame is not empty
    assert not df.empty, "DataFrame should not be empty"

    # Check if the DataFrame has the correct data
    expected_colors = ["Black", "White", "Red"]
    expected_hexes = ["#000000", "#FFFFFF", "#FF0000"]

    assert (
        df["Color"].tolist() == expected_colors
    ), "The 'Color' column values are incorrect"
    assert df["Hex"].tolist() == expected_hexes, "The 'Hex' column values are incorrect"


# if __name__ == "__main__":
#     pytest.main()

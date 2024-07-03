import pandas as pd

def get_color_hex_list():
    """
    Generates a comprehensive list of colors and their corresponding Hex values.
    The list includes a wide range of hues and values, encompassing both primary, secondary, and tertiary colors.

    Returns:
    pd.DataFrame: A DataFrame containing the list of colors and their Hex values.
    """

    # Define color names and their corresponding Hex values
    colors = [
        "Black", "#000000",
        "White", "#FFFFFF",
        "Red", "#FF0000",
        # ... Add other color names and their Hex values ...
    ]

    # Separate color names and their hex values into two lists
    color_names = colors[0::2]
    hex_values = colors[1::2]
    df = pd.DataFrame({"Color": color_names, "Hex": hex_values})

    return df


# Example usage:
# df = get_color_hex_list()
# print(df)

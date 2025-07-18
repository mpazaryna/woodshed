import json
import sys

import pandas as pd


def parse_json_schedule_and_save(file_path):
    # Load json
    with open(file_path, "r") as f:
        df_json = json.load(f)

    # Convert json into dataframe using the modern pandas method
    try:
        # Try modern pandas approach first
        df = pd.json_normalize(df_json)
    except AttributeError:
        # Fallback for older pandas versions
        df = pd.io.json.json_normalize(df_json)

    # Cast variables to correct types
    df["income_day"] = df["income_day"].astype(int)
    df["time_in"] = pd.to_datetime(df["time_in"])
    df["time_out"] = pd.to_datetime(df["time_out"])

    # Create working_time column using modern pandas methods
    df["working_time"] = df["time_out"] - df["time_in"]

    df.to_csv("data.csv", index=False)

    return df

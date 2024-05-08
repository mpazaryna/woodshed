import numpy as np
import pandas as pd
from pyzipcode import ZipCodeDatabase

from constants import *


class SeattleDataLoader:

    def __init__(self, seattle_data_path="data/seattle_data.csv"):
        self.seattle_data = (
            pd.read_csv(seattle_data_path).dropna().reset_index().drop("index", axis=1)
        )
        acre_indices = self.seattle_data[
            self.seattle_data["lot_size_units"] == "acre"
        ].index.tolist()
        self.seattle_data.loc[acre_indices, "lot_size"] = (
            self.seattle_data.loc[acre_indices, "lot_size"] * ACRE_TO_LOT
        )
        self.seattle_data = self.seattle_data.drop(
            ["lot_size_units", "size_units"], axis=1
        )
        self.seattle_data["Area"] = [
            self.from_zipcode_to_area(str(zipcode))[0]
            for zipcode in self.seattle_data.zip_code.tolist()
        ]
        self.seattle_data["Possibility to negotiate"] = np.random.choice(
            ["High", "Middle", "Low"], p=[0.1, 0.6, 0.3], size=len(self.seattle_data)
        )
        self.seattle_data["Price cut on original price"] = np.array(
            np.random.choice(np.linspace(0, 0.05, 10), size=len(self.seattle_data))
            * self.seattle_data["price"]
        ).astype(int)
        zcdb = ZipCodeDatabase()
        self.seattle_data_with_location = self.seattle_data
        self.seattle_data_with_location["longitude"] = [
            zcdb[z].longitude
            for z in self.seattle_data_with_location["zip_code"].tolist()
        ]
        self.seattle_data_with_location["latitude"] = [
            zcdb[z].latitude
            for z in self.seattle_data_with_location["zip_code"].tolist()
        ]
        self.seattle_data.to_csv("data/seattle_data_processed.csv")

    def from_zipcode_to_area(zipcode_of_interest, seattle_zipcode=SEATTLE_ZIPCODES):
        zipcodes = list(SEATTLE_ZIPCODES.values())
        areas = list(SEATTLE_ZIPCODES.keys())
        res = [
            areas[i] for i in range(len(areas)) if zipcode_of_interest in zipcodes[i]
        ]
        if res == []:
            res = ["Central/Downtown"]
        return res

import json
from collections import OrderedDict
from typing import List, Tuple

import numpy as np


def get_working_days_and_average_income(l: List[Tuple[str, str]]) -> None:
    """
    Given a list in the form [(day_1, user_1), (day_2, user_2), (day_3, user_3), ..., (day_n, user_n)]
    where day_i is a day of the week and user_i is a user_id (may be repeated),
    returns a dictionary with the unique days appearing in the list and the users associated

    Example: [(Monday, a), (Tuesday, a), (Monday, b)]
    Returns: {a: [Monday, Tuesday], b: [Monday]}
    """
    # Define the desired order of days
    day_order = OrderedDict(
        [
            ("Tuesday", 0),
            ("Wednesday", 1),
            ("Thursday", 2),
            ("Friday", 3),
            ("Saturday", 4),
            ("Sunday", 5),
            ("Monday", 6),
        ]
    )

    try:
        unique_values = np.unique(l, axis=0)
        # Use OrderedDict instead of regular dict for Python 3.6
        dic = OrderedDict()

        # First, create an ordered list of user IDs to maintain order
        users = sorted(set(user for _, user in unique_values))
        for user in users:
            dic[user] = {"schedule": set()}

        # Add days to the sets
        for day, user in unique_values:
            dic[user]["schedule"].add(day)

        # Convert sets to lists and sort according to custom order
        for user in dic:
            dic[user]["schedule"] = sorted(
                list(dic[user]["schedule"]), key=lambda x: day_order[x]
            )

        # Write to JSON with ordered dict
        with open("schedule.json", "w") as f:
            json.dump(dic, f, indent=2)

    except Exception as e:
        print(f"Error processing schedule data: {str(e)}")
        raise

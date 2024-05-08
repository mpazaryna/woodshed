# In dataframe_filter.py
import streamlit as st

from ai.tools.supabase.supabase_base import SupabaseClientBase


class DataFrameFilterDemo(SupabaseClientBase):
    def show_dataframe_filter(self):
        """Display the dataframe filter feature and filtered dataframe."""
        st.write("DataFrame Filter Feature")
        df = self.fetch_data()

        # First, ensure the 'state' column exists.
        if "city" in df.columns:
            # Drop rows where 'state' is NaN or None, then get unique values and sort.
            cities = sorted(list(df["city"].dropna().unique()))
        else:
            cities = []
            # Optionally, print a message or handle the absence of the column as needed.
            print("The 'city' column does not exist in the DataFrame.")

        # Dropdown menu for selecting the city
        city = st.selectbox("Select a city:", cities, index=0)

        # Filter the dataframe based on the selected city
        filtered_df = df[df["city"] == city]  # Assume 'city' is your column name

        # Display the filtered dataframe
        st.dataframe(filtered_df, use_container_width=True)


def show_dataframe_filter():
    demo = DataFrameFilterDemo("YOUR_CONNECTION_NAME", "a_batchdata")
    demo.connect()
    demo.show_dataframe_filter()

# In dataframe_filter.py
import streamlit as st

from ai.tools.supabase.supabase_base import SupabaseClientBase


class DataFrameFilterDemo(SupabaseClientBase):
    def show_dataframe_filter(self):
        """Display the dataframe filter feature and filtered dataframe."""
        st.write("DataFrame Filter Feature")
        df = self.fetch_data()

        # First, ensure the 'state' column exists.
        if "state" in df.columns:
            # Drop rows where 'state' is NaN or None, then get unique values and sort.
            states = sorted(list(df["state"].dropna().unique()))
        else:
            states = []
            # Optionally, print a message or handle the absence of the column as needed.
            print("The 'state' column does not exist in the DataFrame.")

        # Dropdown menu for selecting the state, based on unique values in the 'state' column
        state = st.selectbox("Select a state:", states)

        # Filter the dataframe
        filtered_df = df[df["state"] == state]

        # Display the filtered dataframe
        st.dataframe(filtered_df, use_container_width=True)


def show_dataframe_filter_state():
    demo = DataFrameFilterDemo("YOUR_CONNECTION_NAME", "a_batchdata")
    demo.connect()
    demo.show_dataframe_filter()

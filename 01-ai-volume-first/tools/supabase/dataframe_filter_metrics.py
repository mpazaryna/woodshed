# In dataframe_filter.py
import plotly.express as px
import streamlit as st

from ai.tools.supabase.supabase_base import SupabaseClientBase


def additional_function(x):
    return x + 1


class DataFrameFilterDemo(SupabaseClientBase):

    @staticmethod
    def additional_function(x):
        return x + 1

    def average_lot_size(self, df):
        return df["lotSizeSquareFeet"].dropna().mean()

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

        # Metrics
        st.markdown("## Property Metrics")
        col1, col2, col3 = st.columns(3)
        col1.metric(
            "Total Properties", filtered_df.shape[0], help="Number of properties."
        )
        col2.metric(
            "Average Lot Size",
            self.average_lot_size(filtered_df),
            help="Average Lot Size in square feet.",
        )
        col3.metric(
            "Average Sale Amount",
            ("${:,}".format(filtered_df["lastSaleAmount"].dropna().mean())),
            help="Average Sale Amount is calculated based on the 'lastSaleAmount' column.",
        )

        # Charts
        with st.expander("Lot Size Chart", expanded=True):
            fig = px.bar(
                filtered_df, x="lotSizeSquareFeet", title="Lot Size Distribution"
            )
            st.plotly_chart(fig)


def demo_df_metrics():
    demo = DataFrameFilterDemo("YOUR_CONNECTION_NAME", "a_batchdata")
    demo.connect()
    demo.show_dataframe_filter()

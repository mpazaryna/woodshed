# In dataframe_demo.py
import streamlit as st

from ai.tools.supabase.supabase_base import SupabaseClientBase


class SupabaseDataFrameDemo(SupabaseClientBase):
    def show_dataframe(self):
        """Display the dataframe in Streamlit."""
        df = self.fetch_data()
        st.dataframe(df, use_container_width=True)


def show_dataframe_all():
    demo = SupabaseDataFrameDemo("YOUR_CONNECTION_NAME", "a_batchdata")
    demo.connect()
    demo.show_dataframe()

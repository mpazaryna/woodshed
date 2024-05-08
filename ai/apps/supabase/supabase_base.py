# Assuming this code is in a file named supabase_base.py
import pandas as pd
import streamlit as st
from st_supabase_connection import SupabaseConnection


class SupabaseClientBase:
    def __init__(self, connection_name, table_name):
        self.connection_name = connection_name
        self.table_name = table_name
        self.client = None

    def connect(self):
        """Initialize the Supabase connection."""
        self.client = st.connection(
            name=self.connection_name, type=SupabaseConnection, ttl=None
        )

    def fetch_data(self):
        """Fetch data from the specified table."""
        if not self.client:
            raise ValueError("Supabase client not initialized. Call connect() first.")

        rows = self.client.query(
            "*", count="None", table=self.table_name, ttl="0"
        ).execute()
        return pd.DataFrame.from_dict(rows.data)

import streamlit as st

from dataframe_all import show_dataframe_all
from dataframe_filter_city import show_dataframe_filter  # Import the new feature
from dataframe_filter_metrics import demo_df_metrics
from dataframe_filter_state import show_dataframe_filter_state
from intro import show_intro


def main():
    st.sidebar.success("Select a demo")
    # Add the new feature to the selection
    demo_name = st.sidebar.selectbox(
        "Choose a demo",
        [
            "—",
            "Home",
            "Select All",
            "Filter By City",
            "Filter By State",
            "Filter Metrics",
        ],
    )

    if demo_name == "—":
        show_intro()
    elif demo_name == "Select All":
        show_dataframe_all()
    elif demo_name == "Filter By City":  # Condition to show the new feature
        show_dataframe_filter()
    elif demo_name == "Filter By State":
        show_dataframe_filter_state()
    elif demo_name == "Home":
        show_intro()
    elif demo_name == "Filter Metrics":
        demo_df_metrics()


if __name__ == "__main__":
    main()

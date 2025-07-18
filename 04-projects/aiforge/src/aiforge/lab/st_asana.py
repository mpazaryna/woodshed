import streamlit as st

from aiforge.lab.asana import load_asanas


def main():
    st.title("Asana Explorer")

    # Load asanas
    asanas = load_asanas()

    # Display asana list
    st.subheader("Asana List")
    for asana in asanas:
        st.write(f"{asana['name']} ({asana['sanskrit']})")

    # Search functionality
    st.subheader("Search Asana")
    search_query = st.text_input("Enter asana name or Sanskrit name:")
    search_button = st.button("Search")

    if search_button and search_query:
        results = [
            asana
            for asana in asanas
            if search_query.lower() in asana["name"].lower()
            or search_query.lower() in asana["sanskrit"].lower()
        ]

        if results:
            for asana in results:
                st.write("---")
                st.write(f"**Name:** {asana['name']}")
                st.write(f"**Sanskrit:** {asana['sanskrit']}")
                st.write(f"**ID:** {asana['id']}")
        else:
            st.write("No results found.")


if __name__ == "__main__":
    main()

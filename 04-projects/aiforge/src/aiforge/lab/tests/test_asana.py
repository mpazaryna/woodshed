import logging

from aiforge.lab.asana import load_asanas, print_asanas


def test_load_asanas():
    """
    Test the load_asanas function to ensure it returns a non-empty list of asanas,
    and each asana contains the required keys: 'id', 'name', and 'sanskrit'.

    This test verifies:
    - The return type is a list.
    - The list is not empty.
    - Each item in the list is a dictionary containing the keys 'id', 'name', and 'sanskrit'.
    """
    asanas = load_asanas()
    assert isinstance(asanas, list)
    assert len(asanas) > 0
    for asana in asanas:
        assert "id" in asana
        assert "name" in asana
        assert "sanskrit" in asana


def test_load_asanas_content():
    """
    Test the load_asanas function to ensure it returns a list of asanas that includes
    specific known asanas.

    This test verifies:
    - The list of asanas contains "Mountain Pose".
    - The list of asanas contains "Downward-Facing Dog".
    - The list of asanas contains "Warrior I".
    """
    asanas = load_asanas()
    # Check for a few specific asanas that we know should be in the file
    asana_names = [asana["name"] for asana in asanas]
    assert "Mountain Pose" in asana_names
    assert "Downward-Facing Dog" in asana_names
    assert "Warrior I" in asana_names


def test_print_asanas(caplog):
    """
    Test the print_asanas function to ensure it logs the correct information about the asanas.

    This test verifies:
    - The log contains the correct number of loaded asanas.
    - The log contains specific details about the first asana.
    - The log contains an ellipsis indicating more asanas are present.

    Parameters:
    - caplog: The pytest fixture to capture log output.
    """
    asanas = load_asanas()
    with caplog.at_level(logging.INFO):
        print_asanas(asanas)
        assert f"Loaded {len(asanas)} asanas: " in caplog.text
        assert "ID: 1, Name: Mountain Pose, Sanskrit: Tadasana" in caplog.text
        assert "..." in caplog.text


def test_print_asanas_empty_list(caplog):
    """
    Test the print_asanas function with an empty list to ensure it logs the correct message.

    This test verifies:
    - The log contains the message "Loaded 0 asanas:".
    - The log contains an ellipsis indicating more asanas are present.

    Parameters:
    - caplog: The pytest fixture to capture log output.
    """
    with caplog.at_level(logging.INFO):
        print_asanas([])
        assert "Loaded 0 asanas:" in caplog.text
        assert "..." in caplog.text

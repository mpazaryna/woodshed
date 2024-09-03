# test_hello.py
import logging
import os

import hello  # Import the hello module
import pytest


def test_world(capfd):
    hello.world()
    out, err = capfd.readouterr()
    assert (
        out == "Hello, World!\n"
    ), "The world function does not print the correct statement"


def test_shark():
    assert hello.shark == "Sammy", "The shark variable is not correctly defined"


def test_octopus(capfd):
    octopus = hello.Octopus("Ollie", "red")
    octopus.tell_me_about_the_octopus()
    out, err = capfd.readouterr()
    expected_output = "This octopus is red.\nOllie is the octopus's name.\n"
    assert (
        out == expected_output
    ), "The tell_me_about_the_octopus method does not work correctly"


def test_logging():
    # Run the main program
    os.system("python /Users/mpaz/github/woodshed/python/modules/main_program.py")

    # Check if the log file exists
    log_file_path = "/Users/mpaz/github/woodshed/python/modules/app.log"
    assert os.path.exists(log_file_path)

    # Read the log file and check for expected log entries
    with open(log_file_path, "r") as log_file:
        log_contents = log_file.read()
        assert "Value of hello.shark:" in log_contents  # Check for specific log entry

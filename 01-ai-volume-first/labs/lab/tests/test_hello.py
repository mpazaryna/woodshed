import pytest

from woodshed.lab.hello import hello


def test_hello():
    assert hello() == "Hello, world"

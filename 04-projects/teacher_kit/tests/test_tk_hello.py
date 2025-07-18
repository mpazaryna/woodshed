import pytest

from teacher_kit.lab.hello import hello


def test_hello():
    assert hello() == "Hello, world"

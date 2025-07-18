import pytest
from src.helpers import adder

def test_adder():
    assert adder(1, 2) == 3
    assert adder(-1, 1) == 0
    assert adder(0, 0) == 0

@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (-1, 1, 0),
    (0, 0, 0),
])
def test_adder_parametrized(a, b, expected):
    assert adder(a, b) == expected
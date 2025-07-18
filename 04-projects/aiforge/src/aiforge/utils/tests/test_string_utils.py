# File: tests/test_string_utils.py
"""Tests for the paz.utils.string_utils module."""

from hypothesis import given
from hypothesis import strategies as st

from aiforge.utils.string_utils import reverse_string


@given(st.text())
def test_reverse_string(s):
    """Test the reverse_string function in string_utils module."""
    reversed_s = reverse_string(s)
    assert len(reversed_s) == len(s)
    assert reverse_string(reversed_s) == s

    for i in range(len(s)):
        assert s[i] == reversed_s[-(i + 1)]

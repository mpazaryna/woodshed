import pytest

from loop_examples import count_down, find_first_even, sum_of_list


def test_sum_of_list():
    assert sum_of_list([1, 2, 3, 4, 5]) == 15
    assert sum_of_list([0, 0, 0]) == 0
    assert sum_of_list([-1, -2, -3]) == -6


def test_find_first_even():
    assert find_first_even([1, 3, 5, 6, 7]) == 6
    assert find_first_even([1, 3, 5]) is None
    assert find_first_even([2, 4, 6]) == 2


def test_count_down():
    assert count_down(5) == [5, 4, 3, 2, 1, 0]
    assert count_down(0) == [0]
    assert count_down(3) == [3, 2, 1, 0]

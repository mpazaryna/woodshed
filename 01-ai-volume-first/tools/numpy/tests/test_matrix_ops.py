# woodshed/integrations/data_science/numpy/tests/test_matrix_ops.py

import numpy as np
import pytest

from woodshed.integrations.data_science.numpy.matrix_ops import (
    create_identity_matrix,
    matrix_multiply,
    trace_sum,
)


def test_create_identity_matrix():
    # Test valid input
    result = create_identity_matrix(3)
    expected = np.array([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
    assert np.array_equal(result, expected)

    # Test invalid input
    with pytest.raises(ValueError):
        create_identity_matrix(0)
    with pytest.raises(ValueError):
        create_identity_matrix(-1)


def test_matrix_multiply():
    # Test valid multiplication
    a = np.array([[1, 2], [3, 4]])
    b = np.array([[5, 6], [7, 8]])
    result = matrix_multiply(a, b)
    expected = np.array([[19, 22], [43, 50]])
    assert np.array_equal(result, expected)

    # Test incompatible shapes
    c = np.array([[1, 2, 3]])
    with pytest.raises(ValueError):
        matrix_multiply(a, c)


def test_trace_sum():
    # Test valid input
    matrix = np.array([[1, 2], [3, 4]])
    result = trace_sum(matrix)
    assert result == 5  # 1 + 4 = 5

    # Test non-square matrix
    with pytest.raises(ValueError):
        trace_sum(np.array([[1, 2, 3], [4, 5, 6]]))

    # Test 1D array
    with pytest.raises(ValueError):
        trace_sum(np.array([1, 2, 3]))

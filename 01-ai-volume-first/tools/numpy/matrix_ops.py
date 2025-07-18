# woodshed/integrations/data_science/numpy/matrix_ops.py

import numpy as np


def create_identity_matrix(n: int) -> np.ndarray:
    """Create an identity matrix of size n x n."""
    if n <= 0:
        raise ValueError("Matrix size must be positive")
    return np.eye(n)


def matrix_multiply(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """Multiply two matrices."""
    try:
        return np.matmul(a, b)
    except ValueError as e:
        raise ValueError(f"Matrix multiplication failed: {str(e)}")


def trace_sum(matrix: np.ndarray) -> float:
    """Calculate the sum of the diagonal elements."""
    if matrix.ndim != 2 or matrix.shape[0] != matrix.shape[1]:
        raise ValueError("Input must be a square matrix")
    return np.trace(matrix)

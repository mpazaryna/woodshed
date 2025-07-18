# Example 1
def calculate_area(radius):
    """
    Calculate the area of a circle given its radius.

    Parameters:
    radius (float): The radius of the circle.

    Returns:
    float: The area of the circle.
    """
    pi = 3.14159
    return pi * radius * radius


# Example 2
def find_max(numbers):
    """
    Find the maximum number in a list of numbers.

    Parameters:
    numbers (list): A list of numerical values.

    Returns:
    float: The maximum value in the list.
    """
    max_number = numbers[0]
    for number in numbers:
        if number > max_number:
            max_number = number
    return max_number


# Example 3
def bubble_sort(arr):
    """
    Sort a list of numbers using the bubble sort algorithm.

    Parameters:
    arr (list): A list of numerical values to be sorted.

    Returns:
    list: The sorted list of numbers.
    """
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

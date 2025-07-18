# loop_examples.py


def sum_of_list(numbers):
    return sum(numbers)


def find_first_even(numbers):
    for number in numbers:
        if number % 2 == 0:
            return number
    return None


def count_down(start):
    return list(range(start, -1, -1))

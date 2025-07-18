import pytest

from linked_list import LinkedList


def test_append():
    linked_list = LinkedList()
    linked_list.append("Alice")
    linked_list.append("Bob")
    linked_list.append("Charlie")

    current = linked_list.head
    assert current.data == "Alice"
    current = current.next
    assert current.data == "Bob"
    current = current.next
    assert current.data == "Charlie"


def test_display(capsys):
    linked_list = LinkedList()
    linked_list.append("Alice")
    linked_list.append("Bob")
    linked_list.append("Charlie")

    linked_list.display()

    captured = capsys.readouterr()
    assert captured.out == "Alice\nBob\nCharlie\n"


def test_remove():
    linked_list = LinkedList()
    linked_list.append("Alice")
    linked_list.append("Bob")
    linked_list.append("Charlie")

    assert linked_list.remove("Bob") == True
    current = linked_list.head
    assert current.data == "Alice"
    current = current.next
    assert current.data == "Charlie"

    assert linked_list.remove("Alice") == True
    current = linked_list.head
    assert current.data == "Charlie"

    assert linked_list.remove("Charlie") == True
    assert linked_list.head == None

    assert linked_list.remove("NonExistent") == False


def test_input_validation():
    """
    Test Input Validation: Ensures only valid data is appended to the list.
    """
    linked_list = LinkedList()
    with pytest.raises(ValueError):
        linked_list.append(123)  # Non-string data should raise ValueError
    linked_list.append("ValidString")  # Valid string data should not raise an error
    assert linked_list.get_size() == 1


def test_size_tracking():
    """
    Test Size Tracking: Keeps track of the number of elements in the list.
    """
    linked_list = LinkedList()
    linked_list.append("Alice")
    linked_list.append("Bob")
    assert linked_list.get_size() == 2  # Size should be 2 after adding two elements
    linked_list.remove("Alice")
    assert linked_list.get_size() == 1  # Size should be 1 after removing one element


def test_clear_method():
    """
    Test Clear Method: Provides a way to reset the list, aiding in resource management.
    """
    linked_list = LinkedList()
    linked_list.append("Alice")
    linked_list.append("Bob")
    linked_list.clear()
    assert linked_list.get_size() == 0  # Size should be 0 after clearing the list
    assert linked_list.head is None  # Head should be None after clearing the list


def test_get_size_method():
    """
    Test Get Size Method: Allows retrieval of the current size of the list.
    """
    linked_list = LinkedList()
    assert linked_list.get_size() == 0  # Initial size should be 0
    linked_list.append("Alice")
    assert linked_list.get_size() == 1  # Size should be 1 after adding one element
    linked_list.append("Bob")
    assert linked_list.get_size() == 2  # Size should be 2 after adding another element


if __name__ == "__main__":
    pytest.main()

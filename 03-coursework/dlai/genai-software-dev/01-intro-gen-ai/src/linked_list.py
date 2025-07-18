# linked_list.py


class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0

    def append(self, data):
        if not isinstance(data, str):
            raise ValueError("Only string data is allowed")

        new_node = Node(data)
        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        self.size += 1

    def remove(self, data):
        current = self.head
        previous = None
        while current:
            if current.data == data:
                if previous:
                    previous.next = current.next
                else:
                    self.head = current.next
                self.size -= 1
                return True
            previous = current
            current = current.next
        return False

    def display(self):
        current = self.head
        while current:
            print(current.data)
            current = current.next

    def clear(self):
        self.head = None
        self.size = 0

    def get_size(self):
        return self.size

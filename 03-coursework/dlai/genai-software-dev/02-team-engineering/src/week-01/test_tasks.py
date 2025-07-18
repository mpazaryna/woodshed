# team-software-engineering/src/test_tasks.py
import unittest

from tasks import add_task, list_tasks, remove_task, reset_tasks


class TestTasks(unittest.TestCase):

    def setUp(self):
        # Reset tasks before each test
        reset_tasks()

    def test_add_and_remove_task(self):
        # Test adding a task
        result = add_task("Buy groceries")
        self.assertIn("Buy groceries", list_tasks())
        self.assertEqual(result, "Task 'Buy groceries' added.")

        # Test removing a task
        result = remove_task("Buy groceries")
        self.assertNotIn("Buy groceries", list_tasks())
        self.assertEqual(result, "Task 'Buy groceries' removed.")

        # Test removing a non-existent task
        result = remove_task("Read a book")
        self.assertEqual(result, "Task not found.")

    def test_list_tasks(self):
        # Test listing tasks
        add_task("Buy groceries")
        add_task("Read a book")
        self.assertEqual(list_tasks(), ["Buy groceries", "Read a book"])


if __name__ == "__main__":
    unittest.main()

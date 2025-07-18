import unittest

import tasks2


class TestTasks(unittest.TestCase):

    def setUp(self):
        # Reset tasks before each test
        tasks2.tasks.clear()

    def test_add_task(self):
        result = tasks2.add_task("Buy groceries")
        self.assertIn("Buy groceries", tasks2.tasks)
        self.assertEqual(result, "Task 'Buy groceries' added.")

    def test_add_empty_task(self):
        result = tasks2.add_task("")
        self.assertEqual(result, "Task cannot be empty.")

    def test_remove_task(self):
        tasks2.add_task("Read a book")
        result = tasks2.remove_task("Read a book")
        self.assertNotIn("Read a book", tasks2.tasks)
        self.assertEqual(result, "Task 'Read a book' removed.")

    def test_remove_nonexistent_task(self):
        result = tasks2.remove_task("Nonexistent task")
        self.assertEqual(result, "Task not found.")

    def test_list_tasks(self):
        tasks2.add_task("Task 1")
        tasks2.add_task("Task 2")
        result = tasks2.list_tasks()
        self.assertEqual(result, ["Task 1", "Task 2"])


if __name__ == "__main__":
    unittest.main()

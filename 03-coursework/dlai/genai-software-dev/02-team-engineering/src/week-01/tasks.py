tasks = []


def add_task(task):
    tasks.append(task)
    return f"Task '{task}' added."


def remove_task(task):
    if task in tasks:
        tasks.remove(task)
        return f"Task '{task}' removed."
    else:
        return "Task not found."


def list_tasks():
    return tasks


def reset_tasks():
    global tasks
    tasks.clear()


# Example usage
# print(add_task("Buy groceries"))
# print(add_task("Read a book"))
# print(list_tasks())
# print(remove_task("Read a book"))
# print(list_tasks())

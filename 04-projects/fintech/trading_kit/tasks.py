from invoke import task


@task
def test(c):
    """
    Run the test suite using pytest.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("pytest")


@task
def lint(c):
    """
    Run linters on the codebase using flake8 and mypy.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("flake8 .")
    c.run("mypy .")


@task
def format(c):
    """
    Format the codebase using black and isort.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("black .")
    c.run("isort .")


@task
def pre_commit(c):
    """
    Run pre-commit hooks on all files.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("pre-commit run --all-files")  # Added pre-commit task


@task
def pdoc(c):
    """
    Generate API documentation using pdoc.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("pdoc ./src -o docs_api")


@task
def all(c):
    """
    Run all tasks: format, lint, and test.

    Args:
        c: The context object provided by Invoke.
    """
    format(c)
    lint(c)
    test(c)

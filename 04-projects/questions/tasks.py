"""
This module contains tasks for managing the codebase using Invoke.

Tasks include running tests, linting, formatting, and generating documentation.
"""

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
def pdoc(c):
    """
    Generate API documentation using pdoc.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("poetry run pdoc --output-dir docs questions")


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

"""
This module contains tasks for managing the codebase using Invoke.

Tasks include running tests, linting, formatting, and executing various scripts within the project.
"""

from invoke import task


@task
def lint(c):
    """
    Run linters on the codebase using flake8 and mypy.

    This task performs static code analysis to identify potential errors and style issues.
    - flake8: Checks for PEP 8 style guide compliance and programming errors.
    - mypy: Performs static type checking for Python code.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("flake8 .")
    c.run("mypy .")


@task
def format(c):
    """
    Format the codebase using black.

    This task automatically formats Python code in the /apps folder to ensure consistent style.
    - black: An opinionated code formatter that adheres to PEP 8 guidelines.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("black apps/")  # Updated to target only the /apps folder


@task
def run_chat(c):
    """
    Run the universal chat script located in the flex_chat module.

    This task executes the main.py script in the labs/flex_chat directory, which likely
    initializes and runs a chat application or interface.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("python labs/flex_chat/main.py")


@task
def run_teacher_kit(c):
    """
    Run the main script of the teacher_kit module.

    This task executes the main.py script in the teacher_kit package, which likely
    contains functionality related to educational tools or resources for teachers.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("python -m teacher_kit.main")


@task
def test_teacher_kit(c):
    """
    Run the tests for the teacher_kit module using pytest.

    This task executes all test files and functions in the teacher_kit directory
    that follow the pytest naming conventions.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("pytest teacher_kit")


@task
def chunk_files(c):
    """
    Run the enhanced chunking script for text processing.

    This task executes a script that likely splits large text files into smaller,
    more manageable chunks, which can be useful for processing or analysis tasks.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("python -m woodshed.services.text_processing.enhanced_chunking")


@task
def run_finance_test_oop(c):
    """
    Run the object-oriented implementation tests for the finance QA module.

    This task executes pytest on the OOP implementation of the finance question-answering
    system, located in the Perplexity provider integration.

    Args:
        c: The context object provided by Invoke.
    """
    c.run(
        "pytest woodshed/integrations/providers/perplexity/finance_qa/implementations/oop"
    )


@task
def run_finance_test_functional(c):
    """
    Run the functional implementation tests for the finance QA module.

    This task executes pytest on the functional implementation of the finance question-answering
    system, located in the Perplexity provider integration.

    Args:
        c: The context object provided by Invoke.
    """
    c.run(
        "pytest woodshed/integrations/providers/perplexity/finance_qa/implementations/functional"
    )


@task
def run_question_cascade_test(c):
    """
    Run the main script of the question_cascade module.
    """
    c.run("pytest woodshed/modules/question_cascade/")


@task
def questions(c):
    """
    Run the enhanced chunking script for text processing.

    This task executes a script that likely splits large text files into smaller,
    more manageable chunks, which can be useful for processing or analysis tasks.

    Args:
        c: The context object provided by Invoke.
    """
    c.run("python -m woodshed.modules.questions.main")

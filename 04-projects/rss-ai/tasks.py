"""Task definitions for project management using Invoke."""

from invoke import task


@task
def test(c):
    """Run the test suite."""
    c.run("pytest tests/")


@task
def test_verbose(c):
    """Run the test suite with verbose output."""
    c.run("pytest -v", pty=True)


@task
def test_coverage(c):
    """Run the test suite with coverage report."""
    c.run(
        "pytest --cov=rss_ai --cov-report=term-missing --cov-report=html:docs/coverage",
        pty=True,
    )


@task
def lint(c):
    """Run flake8 linter."""
    c.run("flake8 . --config=.flake8")


@task
def format(c):
    """Format code using Black."""
    c.run("poetry run black .")


@task
def check(c):
    """Run linting, formatting, and testing."""
    format(c)
    lint(c)
    lint_markdown(c)
    test(c)


@task
def docs(c):
    """Generate documentation using pdoc"""
    c.run("pdoc --output-dir docs/pdoc rss_ai")


@task
def lint_markdown(c):
    """Lint and format Markdown files."""
    print("Starting Markdown linting and formatting...")
    c.run("poetry run mdformat .")
    print("Finished Markdown linting and formatting.")


@task
def hello(c):
    print("Hello, world!")

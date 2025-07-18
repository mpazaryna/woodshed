from invoke import task


@task
def test(c):
    c.run("pytest")


@task
def lint(c):
    c.run("flake8 .")
    c.run("mypy .")


@task
def format(c):
    c.run("black .")
    c.run("isort .")


@task
def pre_commit(c):
    c.run("pre-commit run --all-files")  # Added pre-commit task


@task
def all(c):
    format(c)
    lint(c)
    test(c)

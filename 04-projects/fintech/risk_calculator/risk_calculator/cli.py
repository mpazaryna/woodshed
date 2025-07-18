import click
from risk_kit.adder import add, multiply, subtract


@click.group()
def cli():
    """A simple calculator CLI using risk_kit functions."""
    pass


@cli.command()
@click.argument("a", type=float)
@click.argument("b", type=float)
def add_numbers(a, b):
    """Add two numbers."""
    result = add(a, b)
    click.echo(f"The result of {a} + {b} is: {result}")


@cli.command()
@click.argument("a", type=float)
@click.argument("b", type=float)
def subtract_numbers(a, b):
    """Subtract two numbers."""
    result = subtract(a, b)
    click.echo(f"The result of {a} - {b} is: {result}")


@cli.command()
@click.argument("a", type=float)
@click.argument("b", type=float)
def multiply_numbers(a, b):
    """Multiply two numbers."""
    result = multiply(a, b)
    click.echo(f"The result of {a} * {b} is: {result}")


if __name__ == "__main__":
    cli()

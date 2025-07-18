import pytest
from click.testing import CliRunner

from risk_calculator.cli import cli


@pytest.fixture
def runner():
    return CliRunner()


def test_add_command(runner):
    result = runner.invoke(cli, ["add-numbers", "2", "3"])
    assert result.exit_code == 0
    assert "The result of 2.0 + 3.0 is: 5.0" in result.output


def test_subtract_command(runner):
    result = runner.invoke(cli, ["subtract-numbers", "5", "3"])
    assert result.exit_code == 0
    assert "The result of 5.0 - 3.0 is: 2.0" in result.output


def test_multiply_command(runner):
    result = runner.invoke(cli, ["multiply-numbers", "2", "3"])
    assert result.exit_code == 0
    assert "The result of 2.0 * 3.0 is: 6.0" in result.output


def test_invalid_input(runner):
    result = runner.invoke(cli, ["add-numbers", "a", "3"])
    assert result.exit_code != 0
    assert "Invalid value for 'A'" in result.output

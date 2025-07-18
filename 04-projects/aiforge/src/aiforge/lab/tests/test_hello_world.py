from aiforge.lab.hello_world import greet


def test_greet_default():
    assert greet() == "Hello, World!"


def test_greet_custom():
    assert greet("Alice") == "Hello, Alice!"

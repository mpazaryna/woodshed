# src/example_kit/core.py


class ExampleCore:
    def __init__(self, name: str):
        self.name = name

    def greet(self) -> str:
        return f"Hello from {self.name}!"

    def process(self, data: str) -> str:
        return f"Processed: {data.upper()}"

# src/example_kit/src/models/base_model.py

from abc import ABC, abstractmethod


class BaseModel(ABC):
    @abstractmethod
    def predict(self, data: dict) -> dict:
        pass

    @abstractmethod
    def train(self, data: list[dict]) -> None:
        pass

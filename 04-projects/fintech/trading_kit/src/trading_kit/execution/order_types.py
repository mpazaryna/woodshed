from trading_kit.exceptions import InvalidDataError, TradingKitError


class OrderType:
    """Base class for order types."""

    def execute(self):
        raise NotImplementedError("This method should be overridden.")


class MarketOrder(OrderType):
    """Market Order implementation."""

    def __init__(self, quantity: int):
        if quantity <= 0:
            raise InvalidDataError("Quantity must be a positive integer.")
        self.quantity = quantity

    def execute(self):
        try:
            # Simulate execution logic
            return f"Executed Market Order for {self.quantity} units."
        except Exception as e:
            raise TradingKitError(f"Failed to execute Market Order: {e}")


class LimitOrder(OrderType):
    """Limit Order implementation."""

    def __init__(self, quantity: int, price: float):
        if quantity <= 0:
            raise InvalidDataError("Quantity must be a positive integer.")
        if price <= 0:
            raise InvalidDataError("Price must be a positive float.")
        self.quantity = quantity
        self.price = price

    def execute(self):
        try:
            # Simulate execution logic
            return f"Executed Limit Order for {self.quantity} units at ${self.price}."
        except Exception as e:
            raise TradingKitError(f"Failed to execute Limit Order: {e}")


# Additional order types can be added here...

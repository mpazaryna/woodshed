import pytest
from agents.base.exceptions import CustomException  # Replace with actual exception names

def test_custom_exception():
    with pytest.raises(CustomException) as exc_info:
        raise CustomException("This is a test exception")
    
    assert str(exc_info.value) == "This is a test exception"
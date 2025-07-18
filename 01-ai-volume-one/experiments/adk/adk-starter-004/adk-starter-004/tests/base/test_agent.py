import pytest
from agents.base.agent import BaseAgent
from agents.base.exceptions import CustomException

@pytest.fixture
def base_agent():
    return BaseAgent()

def test_base_agent_initialization(base_agent):
    assert base_agent is not None

def test_base_agent_functionality(base_agent):
    # Assuming BaseAgent has a method called 'perform_action'
    result = base_agent.perform_action()
    assert result is not None

def test_custom_exception():
    with pytest.raises(CustomException):
        raise CustomException("This is a test exception")
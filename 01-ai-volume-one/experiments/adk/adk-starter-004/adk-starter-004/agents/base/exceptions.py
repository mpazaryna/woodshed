class AgentException(Exception):
    """Base class for all agent exceptions."""
    pass

class AgentNotFoundException(AgentException):
    """Exception raised when an agent is not found."""
    def __init__(self, agent_id):
        super().__init__(f"Agent with ID '{agent_id}' not found.")
        self.agent_id = agent_id

class InvalidAgentConfigurationException(AgentException):
    """Exception raised for invalid agent configuration."""
    def __init__(self, message):
        super().__init__(message)

class AgentExecutionException(AgentException):
    """Exception raised when an agent fails to execute."""
    def __init__(self, agent_id, error):
        super().__init__(f"Agent '{agent_id}' execution failed: {error}")
        self.agent_id = agent_id
        self.error = error
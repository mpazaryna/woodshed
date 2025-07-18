class BaseAgent:
    def __init__(self, agent_id):
        self.agent_id = agent_id

    def perform_action(self):
        raise NotImplementedError("Subclasses must implement this method.")

    def log(self, message):
        # Placeholder for logging functionality
        print(f"[{self.agent_id}] {message}")
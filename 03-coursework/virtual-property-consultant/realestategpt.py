import json
import os

import dotenv
from langchain.agents.agent_types import AgentType
from langchain_experimental.agents import create_csv_agent
from langchain_openai import ChatOpenAI

# from constants import OPENAI_API_KEY  # Assuming this is defined in your constants file

# Get the path and load the .env file
dotenv_path = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_path)


class RealEstateGPT:
    def __init__(self, one_shot=True):
        # os.environ["OPENAI_API_KEY"] = openai_api_key
        file_path = "prompts.json"
        with open(file_path, "r") as file:
            data = json.load(file)
        self.role_playing_prompt = data["one_shot_prompt"]
        self.conversational_prompt = data["conversational_prompt"]
        self.conversation_history = []
        self.one_shot = one_shot

        # Initialize the agent
        initial_context = (
            self.role_playing_prompt if one_shot else self.conversational_prompt
        )
        self.agent = create_csv_agent(
            ChatOpenAI(temperature=0, model="gpt-3.5-turbo-0613"),
            "data/seattle_estate_processed.csv",
            verbose=True,
            agent_type=AgentType.OPENAI_FUNCTIONS,
            initial_context=initial_context,
        )

    def ask_real_estate_question(self, query):
        if not self.one_shot:
            # Update the conversational prompt dynamically based on the conversation history
            dynamic_prompt = (
                self.conversational_prompt
                + "\n\n"
                + self._format_conversation_history()
                + f"\nClient: {query}"
            )
        else:
            # For one-shot interactions, use the static role-playing prompt with the current query
            dynamic_prompt = f"{self.role_playing_prompt}\n\nClient: {query}"

        try:
            response = self.agent.run(dynamic_prompt)
            # Update the conversation history with the new exchange
            if not self.one_shot:
                self.conversation_history.append({"Client": query, "AI": response})
            return response
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    def _format_conversation_history(self):
        # Format the conversation history for inclusion in the dynamic prompt
        formatted_history = ""
        for exchange in self.conversation_history:
            formatted_history += f"Client: {exchange['Client']}\nAI: {exchange['AI']}\n"
        return formatted_history

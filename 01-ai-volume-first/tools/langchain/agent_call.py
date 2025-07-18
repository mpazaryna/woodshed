from dotenv import find_dotenv, load_dotenv
from langchain.agents import AgentType, initialize_agent, load_tools
from langchain.agents.load_tools import get_all_tool_names
from langchain_openai import OpenAI
from langchain_community.output_parsers.rail_parser import GuardrailsOutputParser

def agent_demo():
    llm = OpenAI()
    get_all_tool_names()
    tools = load_tools(["wikipedia"], llm=llm)

    agent = initialize_agent(
        tools,
        llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True,
        handle_parsing_errors=True,
    )

    result = agent.invoke(
        "In what year was python programming language released and who is the original creator?"
    )

    return result


if __name__ == "__main__":
    print(agent_demo())

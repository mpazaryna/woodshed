from langchain.agents import AgentType, initialize_agent
from langchain_community.agent_toolkits.load_tools import get_all_tool_names, load_tools
from langchain_community.output_parsers.rail_parser import GuardrailsOutputParser
from langchain_openai import OpenAI


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

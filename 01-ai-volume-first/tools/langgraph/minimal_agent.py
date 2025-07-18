# woodshed/integrations/frameworks/langgraph/minimal_agent.py

from typing import Any, Dict, List

from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition


def multiply(a: int, b: int) -> int:
    """Multiply a and b."""
    return a * b


def add(a: int, b: int) -> int:
    """Adds a and b."""
    return a + b


def divide(a: int, b: int) -> float:
    """Divides a by b."""
    return a / b


def create_agent(model_name: str = "gpt-4") -> StateGraph:
    """Creates an agent that can perform basic arithmetic operations."""

    # Tools setup
    tools = [add, multiply, divide]
    llm = ChatOpenAI(model=model_name)
    llm_with_tools = llm.bind_tools(tools)

    # System message
    sys_msg = SystemMessage(
        content="You are a helpful assistant tasked with performing arithmetic on a set of inputs."
    )

    # Assistant node
    def assistant(state: MessagesState) -> Dict[str, List[BaseMessage]]:
        """Process messages and generate responses."""
        return {"messages": [llm_with_tools.invoke([sys_msg] + state["messages"])]}

    # Create graph
    builder = StateGraph(MessagesState)

    # Add nodes
    builder.add_node("assistant", assistant)
    builder.add_node("tools", ToolNode(tools))

    # Add edges
    builder.add_edge(START, "assistant")
    builder.add_conditional_edges(
        "assistant",
        tools_condition,
    )
    builder.add_edge("tools", "assistant")

    return builder.compile()


def run_agent(graph: StateGraph, query: str) -> Dict[str, List[BaseMessage]]:
    """Run the agent with a query."""
    messages = [HumanMessage(content=query)]
    return graph.invoke({"messages": messages})


if __name__ == "__main__":
    # Example usage
    graph = create_agent()
    result = run_agent(
        graph, "Add 3 and 4, then multiply by 2, and finally divide by 5"
    )
    for message in result["messages"]:
        print(message.content)

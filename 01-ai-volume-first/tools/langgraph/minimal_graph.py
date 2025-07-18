# woodshed/integrations/frameworks/langgraph/minimal_graph.py

import os
import sys
from typing import Annotated, TypedDict

try:
    from langgraph.graph import Graph, StateGraph

    print("LangGraph imported successfully")
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Python path: {sys.path}")
    raise


# Define our state type
class GraphState(TypedDict):
    message: str
    count: int


def echo_node(state: GraphState) -> GraphState:
    """Simple node that modifies state"""
    print(f"Received message: {state['message']}")
    state["count"] += 1
    return state


# Create graph with our state type
workflow = StateGraph(GraphState)

# Add the node
workflow.add_node("echo", echo_node)

# Set entry and finish points
workflow.set_entry_point("echo")
workflow.set_finish_point("echo")

# Compile and run
graph = workflow.compile()

if __name__ == "__main__":
    # Initial state
    initial_state = {"message": "Hello LangGraph!", "count": 0}

    # Run the graph
    result = graph.invoke(initial_state)
    print(f"Final state: {result}")

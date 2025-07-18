import unittest

from src.graph_advanced import Graph_Advanced


def test_specific_case():
    """
    Helper function to test specific cases during development
    """
    # Example: Test shortest_path with a small graph
    graph = Graph_Advanced()

    # Add vertices
    for i in range(5):
        graph.add_vertex(i)

    # Add some edges
    graph.add_edge(0, 1, 4)
    graph.add_edge(0, 2, 2)
    graph.add_edge(1, 2, 1)
    graph.add_edge(1, 3, 5)
    graph.add_edge(2, 3, 8)
    graph.add_edge(2, 4, 10)
    graph.add_edge(3, 4, 2)

    # Test shortest path
    dist, path = graph.shortest_path(0, 4)
    print(f"Shortest path from 0 to 4:")
    print(f"Distance: {dist}")
    print(f"Path: {path}")


if __name__ == "__main__":
    # Run specific test cases
    print("Running specific test case:")
    test_specific_case()

    # Run all unit tests
    print("\nRunning all unit tests:")
    unittest.main(module="tests.test_graph", verbosity=2, argv=["dummy"])

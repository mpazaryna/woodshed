# test_graph.py

import pytest

from src.graph import Graph


def test_add_vertex():
    graph = Graph()
    graph.add_vertex("A")
    assert "A" in graph.graph


def test_add_edge():
    graph = Graph()
    graph.add_vertex("A")
    graph.add_vertex("B")
    graph.add_edge("A", "B", 5)
    assert graph.graph["A"]["B"] == 5
    assert "B" in graph.graph["A"]


def test_add_edge_undirected():
    graph = Graph()
    graph.add_vertex("A")
    graph.add_vertex("B")
    graph.add_edge("A", "B", 5)
    assert graph.graph["B"]["A"] == 5


def test_remove_edge():
    graph = Graph()
    graph.add_vertex("A")
    graph.add_vertex("B")
    graph.add_edge("A", "B", 5)
    graph.remove_edge("A", "B")
    assert "B" not in graph.graph["A"]


def test_remove_vertex():
    graph = Graph()
    graph.add_vertex("A")
    graph.add_vertex("B")
    graph.add_edge("A", "B", 5)
    graph.remove_vertex("A")
    assert "A" not in graph.graph
    assert "A" not in graph.graph["B"]


def test_get_adjacent_vertices():
    graph = Graph()
    graph.add_vertex("A")
    graph.add_vertex("B")
    graph.add_edge("A", "B", 5)
    assert graph.get_adjacent_vertices("A") == ["B"]


def test_get_edge_weight():
    graph = Graph()
    graph.add_vertex("A")
    graph.add_vertex("B")
    graph.add_edge("A", "B", 5)
    assert graph._get_edge_weight("A", "B") == 5
    assert graph._get_edge_weight("B", "A") == 5  # For undirected graphs


def test_str():
    graph = Graph()
    graph.add_vertex("A")
    graph.add_vertex("B")
    graph.add_edge("A", "B", 5)
    assert str(graph) == "{'A': {'B': 5}, 'B': {'A': 5}}"


if __name__ == "__main__":
    pytest.main()

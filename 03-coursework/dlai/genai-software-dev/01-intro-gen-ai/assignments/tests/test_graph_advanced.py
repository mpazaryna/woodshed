import heapq
import itertools
import os
import random
import time
import unittest
from multiprocessing import Process, Queue

import numpy as np

from src.graph_advanced import Graph_Advanced


def generate_graph(
    nodes, edges=None, complete=False, weight_bounds=(1, 600), seed=None
):
    """Helper function to generate test graphs"""
    random.seed(seed)
    graph = Graph_Advanced()
    if edges is not None and complete:
        raise ValueError("edges must be None if complete is set to True")
    if not complete and edges > nodes:
        raise ValueError("number of edges must be less than number of nodes")

    for i in range(nodes):
        graph.add_vertex(i)
    if complete:
        for i in range(nodes):
            for j in range(i + 1, nodes):
                weight = random.randint(weight_bounds[0], weight_bounds[1])
                graph.add_edge(i, j, weight)
    else:
        for i in range(nodes):
            for _ in range(edges):
                j = random.randint(0, nodes - 1)
                while (j == i or j in graph.get_adjacent_vertices(i)) and len(
                    graph.get_adjacent_vertices(i)
                ) < nodes - 1:
                    j = random.randint(0, nodes - 1)
                weight = random.randint(weight_bounds[0], weight_bounds[1])
                if len(graph.graph[i]) < edges and len(graph.graph[j]) < edges:
                    graph.add_edge(i, j, weight)
    return graph


def run_with_timeout(func, args, timeout):
    """Helper function to run a method with a timeout"""
    queue = Queue()
    process = Process(
        target=lambda q, fn, args: q.put(fn(*args)), args=(queue, func, args)
    )
    process.start()
    process.join(timeout)

    if process.is_alive():
        process.terminate()
        process.join()
        return None
    return queue.get()


class TestGraphAdvanced(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures"""
        random.seed(42)

    def test_shortest_path(self):
        """Test shortest_path implementation"""
        # Test method existence
        self.assertTrue(
            hasattr(Graph_Advanced, "shortest_path"),
            "Graph_Advanced class missing shortest_path method",
        )

        # Test cases from original unittests.py
        test_cases = [(654, 114), (25, 759), (281, 250)]
        solutions = [31, 31, 33, 36, 23, 35, 31, 26, 34]
        time_limit = 0.5

        count = 0
        for i in range(3):  # Testing with 3 different graphs
            graph = generate_graph(nodes=1000, edges=100, seed=42 + i)

            for start, end in test_cases:
                # Run with timeout
                result = run_with_timeout(graph.shortest_path, (start, end), time_limit)

                if result is None:
                    self.fail(
                        f"Exceeded time execution limit ({time_limit}s) for path between nodes "
                        f"{start} and {end}. Graph can be replicated with: "
                        f"generate_graph(nodes=1000, edges=100, seed={42+i})"
                    )

                dist, path = result
                self.assertEqual(
                    dist,
                    solutions[count],
                    f"Failed to find optimal solution for path between nodes {start} and {end}. "
                    f"Expected {solutions[count]}, got {dist}. Graph can be replicated with: "
                    f"generate_graph(nodes=1000, edges=100, seed={42+i})",
                )
                count += 1

    def test_tsp_small_graph(self):
        """Test tsp_small_graph implementation"""
        self.assertTrue(
            hasattr(Graph_Advanced, "tsp_small_graph"),
            "Graph_Advanced class missing tsp_small_graph method",
        )

        solutions = [799, 893, 978, 776, 1394]
        time_limit = 1.0

        for i in range(5):  # Test with 5 different small graphs
            graph = generate_graph(nodes=10, complete=True, seed=42 + i)

            # Run with timeout
            result = run_with_timeout(graph.tsp_small_graph, (0,), time_limit)

            if result is None:
                self.fail(
                    f"Exceeded time execution limit ({time_limit}s) for tour starting at node 0. "
                    f"Graph can be replicated with: generate_graph(nodes=10, complete=True, seed={42+i})"
                )

            dist, path = result
            self.assertEqual(
                dist,
                solutions[i],
                f"Failed to find optimal solution for tour starting at node 0. "
                f"Expected {solutions[i]}, got {dist}. Graph can be replicated with: "
                f"generate_graph(nodes=10, complete=True, seed={42+i})",
            )

    def test_tsp_large_graph(self):
        """Test tsp_large_graph implementation"""
        self.assertTrue(
            hasattr(Graph_Advanced, "tsp_large_graph"),
            "Graph_Advanced class missing tsp_large_graph method",
        )

        solutions = [4367, 4774, 5217, 4357, 4613]
        time_limit = 0.5

        for i in range(5):  # Test with 5 different large graphs
            graph = generate_graph(nodes=1000, complete=True, seed=42 + i)

            # Run with timeout
            result = run_with_timeout(graph.tsp_large_graph, (0,), time_limit)

            if result is None:
                self.fail(
                    f"Exceeded time execution limit ({time_limit}s) for tour starting at node 0. "
                    f"Graph can be replicated with: generate_graph(nodes=1000, complete=True, seed={42+i})"
                )

            dist, path = result
            self.assertLess(
                dist,
                solutions[i] * 1.2,
                f"Solution not within acceptable range. Got {dist}, which is more than 20% above "
                f"the target of {solutions[i]}. Graph can be replicated with: "
                f"generate_graph(nodes=1000, complete=True, seed={42+i})",
            )

    def test_tsp_medium_graph(self):
        """Test tsp_medium_graph implementation"""
        self.assertTrue(
            hasattr(Graph_Advanced, "tsp_medium_graph"),
            "Graph_Advanced class missing tsp_medium_graph method",
        )

        solutions = [3855, 3554, 3665, 3192, 3760, 3786, 3669, 3668, 4362, 4148]
        time_limit = 1.5

        for i in range(10):  # Test with 10 different medium graphs
            graph = generate_graph(nodes=300, complete=True, seed=42 + i)

            # Run with timeout
            result = run_with_timeout(graph.tsp_medium_graph, (0,), time_limit)

            if result is None:
                self.fail(
                    f"Exceeded time execution limit ({time_limit}s) for tour starting at node 0. "
                    f"Graph can be replicated with: generate_graph(nodes=300, complete=True, seed={42+i})"
                )

            dist, path = result
            self.assertLess(
                round(dist / solutions[i], 2),
                1.76,
                f"Solution not within acceptable range. Got {dist}, which is more than 76% above "
                f"the nearest neighbor solution of {solutions[i]}. Graph can be replicated with: "
                f"generate_graph(nodes=300, complete=True, seed={42+i})",
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)

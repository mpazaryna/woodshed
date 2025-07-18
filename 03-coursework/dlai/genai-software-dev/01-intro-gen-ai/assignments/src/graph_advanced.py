import heapq
import itertools
import random
from itertools import permutations

from .graph import Graph


class Graph_Advanced(Graph):
    def shortest_path(self, start, end):
        """
        Calculate the shortest path from a starting node to an ending node in a sparse graph
        with potentially 10000s of nodes. Must run under 0.5 seconds and find the shortest distance between two nodes.

        Parameters:
        start: The starting node.
        end: The ending node.

        Returns:
        A tuple containing the total distance of the shortest path and a list of nodes representing that path.
        """
        # Check if start or end nodes don't exist in graph
        if start not in self.graph or end not in self.graph:
            return float("inf"), []

        # Priority queue to store (distance, node) tuples
        priority_queue = [(0, start)]
        # Dictionary to store the shortest distance to each node
        distances = {start: 0}
        # Dictionary to store the path taken to reach each node
        previous_nodes = {start: None}

        while priority_queue:
            current_distance, current_node = heapq.heappop(priority_queue)

            # If we've found the end node, reconstruct and return the path
            if current_node == end:
                path = []
                while current_node is not None:
                    path.append(current_node)
                    current_node = previous_nodes[current_node]
                return current_distance, path[::-1]

            # Skip if we've found a better path already
            if current_distance > distances.get(current_node, float("inf")):
                continue

            # Process each neighbor directly from the graph dictionary
            for neighbor, weight in self.graph[current_node].items():
                distance = current_distance + weight

                # Only process if we've found a shorter path
                if distance < distances.get(neighbor, float("inf")):
                    distances[neighbor] = distance
                    previous_nodes[neighbor] = current_node
                    heapq.heappush(priority_queue, (distance, neighbor))

        # If no path is found, return infinity and empty path
        return float("inf"), []

    def tsp_small_graph(self, start_vertex):
        """
        Solve the Travelling Salesman Problem for a small (~10 node) complete graph starting from a specified node.
        Required to find the optimal tour. Expect graphs with at most 10 nodes. Must run under 1 second.

        Parameters:
        start_vertex: The starting node.

        Returns:
        A tuple containing the total distance of the tour and a list of nodes representing the tour path.
        """
        # Get list of nodes excluding start vertex
        nodes = [n for n in self.graph.keys() if n != start_vertex]
        min_distance = float("inf")
        best_tour = None

        # Cache edge weights for faster lookup
        weights = {}
        for i in self.graph:
            for j, w in self.graph[i].items():
                weights[(i, j)] = w

        def get_weight(a, b):
            return weights.get((a, b), weights.get((b, a)))

        # Try all possible permutations
        for perm in itertools.permutations(nodes):
            current_distance = get_weight(start_vertex, perm[0])
            if current_distance >= min_distance:
                continue

            # Calculate path distance
            valid_path = True
            for i in range(len(perm) - 1):
                dist = get_weight(perm[i], perm[i + 1])
                current_distance += dist
                if current_distance >= min_distance:
                    valid_path = False
                    break

            if not valid_path:
                continue

            # Add return to start
            final_dist = get_weight(perm[-1], start_vertex)
            current_distance += final_dist

            if current_distance < min_distance:
                min_distance = current_distance
                best_tour = [start_vertex] + list(perm) + [start_vertex]

        return min_distance, best_tour

    def tsp_medium_graph(self, start):
        """
        Solve the Travelling Salesman Problem for a medium (~300 node) complete graph starting from a specified node.
        Expected to perform better than tsp_large_graph. Must run under 1.5 seconds.

        Parameters:
        start: The starting node.

        Returns:
        A tuple containing the total distance of the tour and a list of nodes representing the tour path.
        """
        # Cache edge weights for O(1) lookup
        weights = {}
        for i in self.graph:
            for j, w in self.graph[i].items():
                weights[(i, j)] = w

        def get_weight(a, b):
            return weights.get((a, b), weights.get((b, a)))

        # Phase 1: Build initial tour using nearest neighbor with random sampling
        unvisited = set(self.graph.keys())
        unvisited.remove(start)
        current = start
        tour = [start]

        while unvisited:
            # Sample a subset of candidates for speed
            sample_size = min(50, len(unvisited))
            candidates = random.sample(list(unvisited), sample_size)
            next_node = min(candidates, key=lambda x: get_weight(current, x))
            tour.append(next_node)
            unvisited.remove(next_node)
            current = next_node
        tour.append(start)

        # Phase 2: Quick 2-opt improvement with early stopping
        def calculate_segment_delta(i, j):
            """Calculate change in tour length if segments are swapped"""
            if j == i + 1:
                return 0
            a, b = tour[i], tour[i + 1]
            c, d = tour[j], tour[j + 1]
            old_distance = get_weight(a, b) + get_weight(c, d)
            new_distance = get_weight(a, c) + get_weight(b, d)
            return new_distance - old_distance

        # Limited 2-opt improvement
        improved = True
        max_fails = 100  # Early stopping counter
        fails = 0

        while improved and fails < max_fails:
            improved = False
            # Randomly sample segments to check
            segments = random.sample(range(1, len(tour) - 2), min(20, len(tour) - 3))

            for i in segments:
                # Check a limited window of possibilities
                window = random.sample(
                    range(i + 2, len(tour) - 1), min(20, len(tour) - i - 2)
                )
                for j in window:
                    delta = calculate_segment_delta(i, j)
                    if delta < 0:  # If improvement found
                        tour[i + 1 : j + 1] = reversed(tour[i + 1 : j + 1])
                        improved = True
                        fails = 0
                        break
                if improved:
                    break

            if not improved:
                fails += 1

        # Calculate final distance
        total_distance = sum(
            get_weight(tour[i], tour[i + 1]) for i in range(len(tour) - 1)
        )

        return total_distance, tour

    def tsp_large_graph(self, start):
        """
        Solve the Travelling Salesman Problem for a large (~1000 node) complete graph starting from a specified node.
        No requirement to find the optimal tour. Must run under 0.5 second with a "pretty good" solution.

        Parameters:
        start: The starting node.

        Returns:
        A tuple containing the total distance of the tour and a list of nodes representing the tour path.
        """
        unvisited = set(self.graph.keys())
        unvisited.remove(start)
        current_node = start
        tour = [start]
        total_distance = 0

        while unvisited:
            # Find the nearest neighbor
            nearest_neighbor = min(
                unvisited, key=lambda node: self._get_edge_weight(current_node, node)
            )
            distance = self._get_edge_weight(current_node, nearest_neighbor)
            total_distance += distance
            tour.append(nearest_neighbor)
            current_node = nearest_neighbor
            unvisited.remove(nearest_neighbor)

        # Return to the starting node
        total_distance += self._get_edge_weight(current_node, start)
        tour.append(start)

        return total_distance, tour

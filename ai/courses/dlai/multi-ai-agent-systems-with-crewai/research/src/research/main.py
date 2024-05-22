#!/usr/bin/env python
from research.crew import ResearchCrew


def run():
    # Replace with your inputs, it will automatically interpolate any tasks and agents information
    inputs = {"topic": "Artificial Intelligence"}
    ResearchCrew().crew().kickoff(inputs=inputs)

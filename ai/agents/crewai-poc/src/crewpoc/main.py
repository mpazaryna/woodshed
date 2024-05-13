#!/usr/bin/env python
from crewpoc.crew import CrewpocCrew


def run():
    # Replace with your inputs, it will automatically interpolate any tasks and agents information
    inputs = {
        'topic': 'AI LLMs'
    }
    CrewpocCrew().crew().kickoff(inputs=inputs)
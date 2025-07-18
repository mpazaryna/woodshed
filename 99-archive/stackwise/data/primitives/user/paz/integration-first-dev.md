---
name: integration-first-development
description: A systematic approach to software development that prioritizes service integration, real-world testing, and systematic refactoring while embracing AI-assisted development practices
category: Software Engineering Methodology
tags: ["integration-first","development-methodology","ai-assisted-development","systematic-refactoring","integration-testing"]
---

# Integration First Development

I'm starting a new software project and want to follow an "integration-first development" approach. This means prioritizing real-world integration, systematic refactoring, and leveraging AI assistance. The core principle is to start with a simple, single-file implementation that directly connects to actual APIs, focusing on building working integrations from day one.

Here's the breakdown of what I want to achieve, step-by-step:

**Project Goal:** [Clearly state the high-level goal of your project. Be as specific as possible. For example: "Build a simple command-line tool to fetch weather data from the OpenWeatherMap API."]

## Initial Setup & Single-File Implementation

- Task: Generate the initial Python (or your chosen language) file that includes:
  - Basic structure for a command-line interface (using argparse for Python, or equivalent).
  - A function to interact with a real external API (e.g., the [API you plan to use], be sure to specify the endpoint and parameters you are thinking about to start).
  - A barebones test function or block to be able to run the initial implementation.
- Output: The code for this single file with clear comments.

## Integration Test Development

- Task: Write a basic integration test function/block (also in the same single file) that verifies the API call function. This should check if the response matches some basic criteria from the API response (for example a valid status code).
- Output: The integration test code, placed below the implementation.

## CLI Interface Integration

- Task: Integrate the API function into a command line interface. Use `argparse` or similar library to set this up so that a user can pass parameters to the API via the command line.
- Output: Updated code of the single file with the CLI working and passing arguments to the API.

## Natural Documentation

- Task: Based on the implementation so far, generate an initial description of the project (in markdown format), including:
    - A summary of the project's purpose
    - A basic explanation of how the API interaction works
    - Instructions on running the initial implementation (command-line).
- Output: A markdown file outlining these points.

## Systematic Refactoring (Initial)

- Task: Suggest a refactoring opportunity on the single file. Suggest a way to reorganize the code into new classes or functions, while still keeping the original implementation to compare against. Include the new code in the response, as well as comments explaining the refactoring and its advantages.
- Output: The new code and an explanation of the advantages of the refactoring.

## Important Considerations

- Language: I'm working in [Specify your programming language, e.g., "Python," "JavaScript," "Go"].
- API Endpoint: I will be using [Specify the API endpoint you want to target] for integrations.
- AI Tool Usage: Please highlight ways in which an LLM like you could continue to assist this process during refactoring, documentation, testing, and tool integration throughout the project's evolution.

I expect a response that is both functional (code and markdown) and explanatory (comments and reasoning). Let's start with step 1, and create the initial version of the single file for this project, then continue in order.

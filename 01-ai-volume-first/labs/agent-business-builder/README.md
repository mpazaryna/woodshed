# Business Builder

Business Builder is a Python-based application that leverages OpenAI's GPT models to assist entrepreneurs in starting or growing their online businesses. The application uses a team of AI agents, each with a specific role, to provide comprehensive business strategies and actionable insights.

## Table of Contents

1. [Features](#features)
2. [Requirements](#requirements)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Project Structure](#project-structure)
6. [Agents](#agents)
7. [Logging](#logging)
8. [Prompts](#prompts)
9. [Contributing](#contributing)
10. [License](#license)

## Features

- Multi-agent system for comprehensive business analysis
- Clarity agent for need clarification
- Niche agent for target audience identification
- Action agent for concrete next steps
- Business strategist for synthesizing insights
- Logging for tracking the application's operations

## Requirements

- Python 3.7+
- OpenAI Python library

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/business-builder.git
   cd business-builder
   ```

2. Install the required packages:

   ```
   pip install openai
   ```

3. Set up your OpenAI API key as an environment variable:

   ```
   export OPENAI_API_KEY='your-api-key-here'
   ```

## Usage

Run the main script:

```shell
python main.py
```

Follow the prompts to input your business idea or current business situation. The application will process your input through various agents and provide a comprehensive business strategy.

## Project Structure

- `main.py`: The main script containing the Business Builder logic and agent implementations.
- `prompts.md`: A file containing prompts used for development and testing.
- `output.log`: Log file generated during the application's runtime.

## Agents

1. **Clarity Agent**: Asks questions to clarify the user's business needs.
2. **Niche Agent**: Generates niche content and identifies the ideal target avatar.
3. **Action Agent**: Provides specific, actionable steps for the user to implement immediately.
4. **Business Strategist**: Synthesizes information from other agents to create a comprehensive business strategy.

## Logging

The application uses Python's `logging` module to log information to both the console and a file (`output.log`). This helps in tracking the application's flow and debugging.

## Prompts Used

### Code Optimizations

> Split this into multiline for clarity

### Code Generation

> For context, we are building a "Business Builder" team of agents that will help entrepreneurs either start their own online business or grow their current business. The team of agents will consist of separate agents that will call each other one after another.

### Business Ideas

>Example business idea: Selling custom AI image models to companies that sell physical products (such as sunglasses, fashion, phone cases, etc.) to reduce their costs on traditional photoshoots and create high-quality creatives.


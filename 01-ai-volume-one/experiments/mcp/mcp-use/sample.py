import asyncio
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from mcp_use import MCPAgent, MCPClient


async def main():
    # Load environment variables from .env
    load_dotenv()
    # Define the MCP server configuration
    config = {
        "mcpServers": {
            "playwright": {
                "command": "npx",
                "args": ["@playwright/mcp@latest"],
                "env": {"DISPLAY": ":1"}
            }
        }
    }
    # Initialize the MCPClient from the configuration dictionary
    client = MCPClient.from_dict(config)
    # Create an LLM using LangChain (using GPT-4o as an example)
    llm = ChatOpenAI(model="gpt-4o")
    # Build the MCP agent with a maximum of 30 steps
    agent = MCPAgent(llm=llm, client=client, max_steps=30)
    # Run the query and print the result
    result = await agent.run("Find the best restaurant in San Francisco")
    print(f"\nResult: {result}")
if __name__ == "__main__":
    asyncio.run(main())
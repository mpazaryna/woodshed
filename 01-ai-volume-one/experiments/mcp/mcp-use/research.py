import asyncio
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from mcp_use import MCPAgent, MCPClient

async def budget_research_assistant():
    load_dotenv()
    # Configure MCP server for web browsing
    config = {
        "mcpServers": {
            "playwright": {
                "command": "npx",
                "args": ["@playwright/mcp@latest"]
            }
        }
    }
    # Use GPT-3.5-Turbo for lower-cost operations
    client = MCPClient.from_dict(config)
    llm = ChatOpenAI(model="gpt-3.5-turbo-0125")
    agent = MCPAgent(llm=llm, client=client)
    result = await agent.run(
        "Research budget-friendly developer tools for startups. "
        "Find options that offer free tiers or affordable pricing for small teams. "
        "Focus on version control, CI/CD, and project management tools."
    )
    print(f"Research completed: {result}")
if __name__ == "__main__":
    asyncio.run(budget_research_assistant())
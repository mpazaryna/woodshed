import asyncio
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from mcp_use import MCPAgent, MCPClient

async def budget_github_assistant():
    config = {
        "mcpServers": {
            "github": {
                "command": "npx",
                "args": ["@github/mcp-server"]
            }
        }
    }

    client = MCPClient.from_dict(config)
    # Use free or low-cost models when appropriate
    llm = ChatOpenAI(model="gpt-3.5-turbo-0125")  # Less than $1/hour of use
    agent = MCPAgent(llm=llm, client=client)
    # For simpler tasks, the cheaper model works great
    result = await agent.run(
        "Check my repositories for any new issues assigned to me in the last 24 hours, "
        "and create a summary list grouped by repository."
    )
    print(f"GitHub summary: {result}")

if __name__ == "__main__":
    asyncio.run(budget_github_assistant())

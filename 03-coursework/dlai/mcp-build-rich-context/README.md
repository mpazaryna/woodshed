# deeplearning-mcp

[Course](https://learn.deeplearning.ai/courses/mcp-build-rich-context-ai-apps-with-anthropic)

## Course Outline

- Lesson 1: Why MCP? - video only
- Lesson 2: MCP Architecture - video only
- Lesson 3: Chatbot Example - video with code example
- Lesson 4: Creating an MCP Server - video with code example
- Lesson 5: Creating an MCP Client - video with code example
- Lesson 6: Connecting the MCP Chatbot to Reference Servers - video with code example
- Lesson 7: Adding Prompt & Resource Features - video with code example
- Lesson 8: Configuring Servers for Claude Desktop - video only
- Lesson 9: Creating and Deploying Remote Server  - video with code example 
- Lesson 10: MCP Roadmap & Conclusion - video only

## Add requirements with UV

uv add -r requirements.txt

## Run with uv

```bash
uv run src/L3.py
```

## MCP Server Example

# mcp-project

Navigate to the project directory and initiate it with uv:
cd mcp_project
uv init

Create virtual environment and activate it:
uv venv
source .venv/bin/activate

Install dependencies:
uv add mcp arxiv

Launch the inspector:
npx @modelcontextprotocol/inspector uv run research_server.py

If you get a message asking "need to install the following packages", type: y
You will get a message saying that the inspector is up and running at a specific address. To open the inspector, click on that given address. The inspector will open in another tab.
In the inspector UI, make sure to follow the video. You would need to specify under configuration the Inspector Proxy Address. Please check the "Inspector UI Instructions" below and run the last cell (after the terminal) to get the Inspector Proxy Address for your configurations.

If you tested the tool and would like to access the papers folder: 1) click on the File option on the top menu of the notebook and 2) click on Open and then 3) click on L4 -> mcp_project.

Once you're done with the inspector UI, make sure to close the inspector by typing Ctrl+C in the terminal below.
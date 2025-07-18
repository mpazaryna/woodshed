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
# main.py
# from dotenv import find_dotenv, load_dotenv
# from langchain.llms import OpenAI

# Load environment variables
# load_dotenv(find_dotenv())

from agent_call import agent_demo
from chain_call import chain_demo
from conversation_call import conversation_demo
from prompt_template_call import run_prompt_template_demo

if __name__ == "__main__":
    # Call each function
    print("Langchain Demos:")
    print("Prompt Template Demo:")
    print(run_prompt_template_demo())
    print("Chain Demo:")
    print(chain_demo())
    print("Agent Demo:")
    print(agent_demo())
    print("Conversation Demo:")
    output1, output2 = conversation_demo()
    print(output1)
    print(output2)

import os

import dotenv
from langchain_openai import ChatOpenAI

from langchain import hub
from langchain.agents import AgentExecutor, create_react_agent
from langchain.chains import LLMChain
from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain.tools import Tool

dotenv_path = dotenv.find_dotenv()
dotenv.load_dotenv(dotenv_path)

llm = ChatOpenAI()

prompt = PromptTemplate(
    template="""
    You are a movie expert. You find movies from a genre or plot.

    Chat History:{chat_history}
    Question:{input}
    """,
    input_variables=["chat_history", "input"],
)

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

chat_chain = LLMChain(llm=llm, prompt=prompt, memory=memory)

tools = [
    Tool.from_function(
        name="Movie Chat",
        description="For when you need to chat about movies. The question will be a string. Return a string.",
        func=chat_chain.run,
        return_direct=True,
    )
]

agent_prompt = hub.pull("hwchase17/react-chat")
agent = create_react_agent(llm, tools, agent_prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, memory=memory)

while True:
    q = input("> ")
    response = agent_executor.invoke({"input": q})
    print(response["output"])

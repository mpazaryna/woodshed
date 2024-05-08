from dotenv import find_dotenv, load_dotenv
from langchain.chains import ConversationChain
from langchain_community.llms import OpenAI

load_dotenv(find_dotenv())


def conversation_demo():
    llm = OpenAI()
    conversation = ConversationChain(llm=llm, verbose=True)
    output1 = conversation.predict(input="Hi there!")
    output2 = conversation.predict(
        input="I'm doing well! Just having a conversation with an AI."
    )
    return output1, output2


if __name__ == "__main__":
    print(conversation_demo())

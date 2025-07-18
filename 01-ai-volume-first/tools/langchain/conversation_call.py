from langchain.chains import ConversationChain
from langchain_openai import OpenAI

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

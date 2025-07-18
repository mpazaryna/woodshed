from openai import OpenAI


def handle_openai(client, messages):
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        stream=True,
    )
    return completion

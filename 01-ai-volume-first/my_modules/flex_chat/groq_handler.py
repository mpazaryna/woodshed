from groq import Groq


def handle_groq(client, messages):
    stream = client.chat.completions.create(
        messages=messages,
        model="mixtral-8x7b-32768",
        temperature=0.5,
        max_tokens=1024,
        top_p=1,
        stop=None,
        stream=True,
    )
    return stream

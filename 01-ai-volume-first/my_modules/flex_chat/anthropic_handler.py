import anthropic


def handle_anthropic(client, messages):
    messages.pop(0)
    return client.messages.stream(
        max_tokens=1024,
        messages=messages,
        model="claude-3-opus-20240229",
    ).text_stream

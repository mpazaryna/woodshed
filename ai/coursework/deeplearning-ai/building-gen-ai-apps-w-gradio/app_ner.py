import gradio as gr
from transformers import pipeline

get_completion = pipeline("ner", model="dslim/bert-base-NER")


def merge_tokens(tokens):
    merged_tokens = []
    for token in tokens:
        if (
            merged_tokens
            and token["entity"].startswith("I-")
            and merged_tokens[-1]["entity"].endswith(token["entity"][2:])
        ):
            # If current token continues the entity of the last one, merge them
            last_token = merged_tokens[-1]
            last_token["word"] += token["word"].replace("##", "")
            last_token["end"] = token["end"]
            last_token["score"] = (last_token["score"] + token["score"]) / 2
        else:
            # Otherwise, add the token to the list
            merged_tokens.append(token)

    return merged_tokens


def ner(input):
    output = get_completion(input)
    return {"text": input, "entities": output}


demo = gr.Interface(
    fn=ner,
    inputs=[gr.Textbox(label="Text to find entities", lines=2)],
    outputs=[gr.HighlightedText(label="Text with entities")],
    title="NER with dslim/bert-base-NER",
    description="Find entities using the `dslim/bert-base-NER` model under the hood!",
    allow_flagging="never",
    examples=[
        "My name is Andrew, I'm building DeeplearningAI and I live in California",
        "My name is Poli, I live in Vienna and work at HuggingFace",
    ],
)

demo.launch()

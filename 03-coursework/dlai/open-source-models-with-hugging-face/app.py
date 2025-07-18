import gradio as gr
from transformers import pipeline

pipe = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")


def launch(input):
    out = pipe(input)
    return out[0]["generated_text"]


iface = gr.Interface(launch, inputs=gr.Image(type="pil"), outputs="text")

iface.launch()

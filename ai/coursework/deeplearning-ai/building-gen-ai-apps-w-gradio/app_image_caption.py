import gradio as gr
from transformers import pipeline

pipe = pipeline("image-to-text", model="Salesforce/blip-image-captioning-base")


def caption_image(input):
    out = pipe(input)
    return out[0]["generated_text"]


gr.close_all()

demo = gr.Interface(
    fn=caption_image,
    inputs=[gr.Image(label="Upload image", type="pil")],
    outputs=[gr.Textbox(label="Caption")],
    title="Image captioning with Salesforce/blip-image-captioning-base",
    description="Caption any image using the BLIP model",
    allow_flagging="never",
    examples=["christmas_dog.jpeg", "bird_flight.jpeg", "cow.jpeg"],
)

demo.launch()
gr.close_all()

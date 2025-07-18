import gradio as gr
import torch
from transformers import pipeline
from transformers.utils import logging

# Set logging verbosity to error only to reduce clutter
logging.set_verbosity_error()

# Initialize the summarizer pipeline with the specified model and dtype
summarizer = pipeline(
    task="summarization", model="facebook/bart-large-cnn", torch_dtype=torch.bfloat16
)


def summarize_text(input_text):
    """
    Summarizes the input text using the specified summarization model.

    Parameters:
    - input_text (str): The text to summarize.

    Returns:
    - str: The summarized text.
    """
    # Generate summary with constraints on minimum and maximum length
    summary = summarizer(input_text, min_length=10, max_length=100)[0]["summary_text"]
    return summary


# Close any existing Gradio interfaces to prevent conflicts
gr.close_all()

# Define the Gradio interface
demo = gr.Interface(
    fn=summarize_text,  # Function to call
    # inputs="text",  # Text input with multiline
    # outputs="text",  # Text output
    inputs=[
        gr.Textbox(label="Text to summarize", lines=6)
    ],  # Text input with multiline
    outputs=[gr.Textbox(label="Result", lines=3)],  # Text output
    title="Text Summarizer",  # Title of the web interface
    description="Summarize any text using the `facebook/bart-large-cnn` model.",
)

# Launch the Gradio app
demo.launch(share=True)

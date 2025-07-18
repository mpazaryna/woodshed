# Import the configuration to set up the path
import config
import gradio as gr

from woodshed.lab.hello import hello


def greet(name):
    return hello(name)


iface = gr.Interface(
    fn=greet,
    inputs=gr.Textbox(label="Enter your name"),
    outputs="text",
    title="Woodshed Hello App",
    description="Enter your name to be greeted!",
    allow_flagging="never",  # Remove the flag button
)

if __name__ == "__main__":
    iface.launch()

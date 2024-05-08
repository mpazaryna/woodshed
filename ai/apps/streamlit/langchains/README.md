# Streamlit and LangChain

This repository houses a unique collection of working examples and experiments that showcase the powerful integration of Streamlit and Langchain. Streamlit, a fast and simple way to build and share data apps, combined with Langchain, a toolkit for building language model applications, unlocks new possibilities for creating interactive, AI-driven applications.  

This project aims to demonstrate how these two technologies can be used together to develop applications that leverage the capabilities of cutting-edge language models within an intuitive, user-friendly interface. Whether you're a data scientist, a developer, or an AI enthusiast, the examples provided here offer a practical starting point for exploring the potential of combining Streamlit's interactivity with Langchain's language model integration.  

From simple demonstrations to more complex experiments, this repository serves as a playground for those looking to dive deeper into the world of AI-powered applications.

```sh
conda create --name streamlit-langchain python=3.12
conda activate streamlit-langchain
```

```sh
# build
python3 -m venv venv

# activate
source venv/bin/activate
 
# exit
deactivate
```




## Examples

- [app-001.py](https://blog.streamlit.io/langchain-tutorial-1-build-an-llm-powered-app-in-18-lines-of-code/) is the
simplest proof of concept possible.

- [app-003.py](https://alejandro-ao.com/how-to-use-streaming-in-langchain-and-streamlit/) demonstrates a streaming response.

## References

- [Axios Error](https://discuss.streamlit.io/t/axioserror-request-failed-with-status-code-403/38112/12)

# Gitpod

After running this repo from gitpod, I was able to get the streamlit langchain csv reader working.
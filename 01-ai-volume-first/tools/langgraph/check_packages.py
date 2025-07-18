# woodshed/integrations/frameworks/langgraph/check_packages.py

try:
    import langgraph

    print("LangGraph installed successfully")
except ImportError:
    print("LangGraph not installed")

try:
    import langchain

    print(f"LangChain version: {langchain.__version__}")
except ImportError:
    print("LangChain not installed")

try:
    import langchain_core

    print(f"LangChain Core version: {langchain_core.__version__}")
except ImportError:
    print("LangChain Core not installed")

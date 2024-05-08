# fastapi_poc

## Conda

```sh
# create and activate a new enviroment
conda create --name fastapi_poc python=3.12 
conda activate fastapi_poc
```

## Create Python environment

```sh
python3 -m venv venv
source venv/bin/activate
deactivate
```

```sh
# when running locally, otherwise I get a error
python3 -m uvicorn server:app --reload
```

## API Docs

[Swagger UI](http://127.0.0.1:8000/docs)
[Redoc](http://127.0.0.1:8000/redoc)

## Refactor main.py to server.py

To refactor your server.py for better code separation and maintainability, you can extract the route handlers and configurations into separate modules. The goal is to have serve.py primarily serve as a router and entry point to your application, while the business logic and configurations are managed in their respective modules.

## ModuleNotFoundError 

The ModuleNotFoundError you're encountering is likely due to Python not recognizing src as a module in your project structure. This issue can be resolved by adjusting the way Python recognizes your project packages and modules. Here are two common solutions:

### Solution 1: Adjust the PYTHONPATH Environment Variable

You can add your project's root directory to the PYTHONPATH environment variable, so Python can locate your modules correctly. This tells Python where to look for modules when importing.

In your terminal, navigate to your project's root directory and run:

```sh
(fastapi_poc) mpaz@MATTHEWs-Air fastapi_poc % export PYTHONPATH=$(pwd)
(fastapi_poc) mpaz@MATTHEWs-Air fastapi_poc % pytest       
```

### Solution 2: Initialize src as a Python Package

Another approach is to turn src into a package by adding an __init__.py file. This file can be empty but it needs to be present. Here's how you can do it:

Create an empty __init__.py file in the src directory.
Create another empty __init__.py file in the src/agent directory.

After adding these __init__.py files, Python will recognize src and its subdirectories as Python packages, and the import should work correctly.



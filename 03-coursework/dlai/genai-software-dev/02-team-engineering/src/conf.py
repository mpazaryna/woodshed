# conf.py for Sphinx documentation

# -- Project information -----------------------------------------------------

project = "Your Project Name"
author = "Your Name"
release = "0.1"

# -- General configuration ---------------------------------------------------

extensions = [
    "sphinx.ext.autodoc",  # Include documentation from docstrings
    "sphinx.ext.viewcode",  # Add links to highlighted source code
    "sphinx.ext.napoleon",  # Support for Google style docstrings
]

templates_path = ["_templates"]
exclude_patterns = []

# -- Options for HTML output -------------------------------------------------

html_theme = "alabaster"  # Choose a theme
html_static_path = ["_static"]

# setup.py

from setuptools import setup, find_packages

setup(
    name="delta_8_analysis",
    version="0.1",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "nltk",
        "matplotlib",
        "wordcloud",
    ],
    extras_require={
        "dev": [
            "pytest",
        ],
    },
    entry_points={
        "console_scripts": [
            "delta8analysis=delta_8_analysis.analysis:main",
        ],
    },
)

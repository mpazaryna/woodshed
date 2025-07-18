# PRISM Project Layout

```
prism/
│
├── src/
│   ├── __init__.py
│   ├── pipeline.py
│   ├── company_management.py
│   ├── data_collection.py
│   ├── analysis.py
│   ├── reporting.py
│   └── utils.py
│
├── tests/
│   ├── __init__.py
│   ├── test_pipeline.py
│   ├── test_company_management.py
│   ├── test_data_collection.py
│   ├── test_analysis.py
│   ├── test_reporting.py
│   └── test_utils.py
│
├── config/
│   └── config.yaml
│
├── docs/
│   ├── architecture.md
│   ├── api_reference.md
│   └── user_guide.md
│
├── scripts/
│   └── run_pipeline.py
│
├── .gitignore
├── README.md
├── requirements.txt
└── setup.py
```

## Directory Explanations

- `src/`: Contains the main source code for the PRISM project.
  - `pipeline.py`: The core pipeline that orchestrates the entire process.
  - `company_management.py`: Functions for managing the list of companies to research.
  - `data_collection.py`: Functions for gathering data from various sources.
  - `analysis.py`: AI-driven analysis functions.
  - `reporting.py`: Functions for generating and formatting reports.
  - `utils.py`: Utility functions used across the project.

- `tests/`: Contains all the test files, mirroring the structure of the `src/` directory.

- `config/`: Holds configuration files, including `config.yaml` for project-wide settings.

- `docs/`: Stores project documentation.

- `scripts/`: Contains utility scripts, including `run_pipeline.py` for executing the main pipeline.

- Root directory files:
  - `.gitignore`: Specifies intentionally untracked files to ignore.
  - `README.md`: Provides an overview of the project and setup instructions.
  - `requirements.txt`: Lists all Python dependencies.
  - `setup.py`: Script for installing the project.
  
# Data Alchemy Course Work

Since this is part of the mono repo, open it in Visual Studio Code as the root.

## Set Up Python Environment

# build
python3 -m venv venv

# activate
source venv/bin/activate
 
# exit
deactivate

# verify it's working
pip list

# freeze contents to a requirements file
pip freeze > requirements.txt

# install based on the requirements file
pip install -r requirements.txt

# exit the environment
deactivate
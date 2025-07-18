import os
import sys

# Add the root directory to the system path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

# Debug: Print the current Python path
print(sys.path)

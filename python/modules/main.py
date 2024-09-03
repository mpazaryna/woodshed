# Import hello module
# Import logging module
import logging

import hello

# Configure logging
logging.basicConfig(
    filename="/Users/mpaz/github/woodshed/python/modules/app.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",  # Optional: Add timestamp and log level
)

# Call function
hello.world()

# Print variable
print(hello.shark)

# Log the value of hello.shark
logging.info(f"Value of hello.shark1: {hello.shark}")

# Call class
jesse = hello.Octopus("Jesse", "orange")
jesse.tell_me_about_the_octopus()

# Logging Functionality in `main_program.py` with `pytest`

## Overview

This document explains the changes made to ensure that the logging functionality in `main_program.py` works correctly when executed directly and when tested using `pytest`. 

## Initial Issues

Initially, the logging functionality was not working as expected when running tests with `pytest`. The main issues were:

1. **Execution Context**: When running `pytest`, the `main_program.py` file was not executed in the same way as when run directly from the command line. This meant that the logging configuration might not have been applied before the logging calls were made.

2. **Log Capture**: `pytest` captures all output, including logs, and may not display them unless configured to do so. This could lead to confusion about whether logging was functioning correctly.

3. **Test Isolation**: The tests may not have been calling the logging code directly, resulting in the logging statements not being executed during the test runs.

## Changes Made

To resolve these issues, the following changes were implemented:

1. **Logging Configuration**: The logging configuration in `main_program.py` was set up to log messages to a specified log file (`app.log`). This configuration includes:
   - Setting the log file path.
   - Specifying the logging level (INFO).
   - Adding a format for log messages that includes timestamps and log levels.

   ```python
   logging.basicConfig(
       filename="/Users/mpaz/github/woodshed/python/modules/app.log", 
       level=logging.INFO,
       format='%(asctime)s - %(levelname)s - %(message)s'
   )
   ```

2. **Test Implementation**: A new test file (`test_main_program.py`) was created to verify the logging functionality. The test:
   - Uses `os.system` to execute `main_program.py`, ensuring that the logging code is run.
   - Checks if the log file exists after execution.
   - Reads the log file to verify that it contains the expected log entries.

   ```python
   def test_logging():
       os.system('python /Users/mpaz/github/woodshed/python/modules/main_program.py')
       assert os.path.exists(log_file_path)
       with open(log_file_path, 'r') as log_file:
           log_contents = log_file.read()
           assert "Value of hello.shark:" in log_contents
   ```

3. **Running Tests**: The tests are run using `pytest` with the `-s` option to allow for output visibility, ensuring that any logs generated during the test execution can be seen in the console.

   ```bash
   pytest -s /Users/mpaz/github/woodshed/python/modules/test_main_program.py
   ```

## Conclusion

With these changes, the logging functionality in `main_program.py` now works correctly both when executed directly and when tested with `pytest`. The logging configuration is applied properly, and the tests effectively verify that the expected log entries are created. This ensures that the application maintains a reliable logging mechanism, which is crucial for debugging and monitoring.
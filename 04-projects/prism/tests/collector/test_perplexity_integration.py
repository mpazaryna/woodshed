"""
This module contains tests for the data collection functionality of PRISM.
"""

import os

import pytest
from requests.exceptions import RequestException, Timeout

from research_kit.collector.collector_perplexity import get_perplexity_response


@pytest.mark.integration
def test_get_perplexity_response():
    # Test data
    query = "What do you know about Mount Vernon Mills?"
    company_domain = "mvmills.com"

    try:
        # Call the function
        result = get_perplexity_response(query, company_domain)

        # Assertions for successful response
        assert isinstance(result, str)
        assert len(result) > 0
        assert "Mount Vernon Mills" in result

        # Check if the log file was created and contains the response
        log_file_path = "logs/collector_perplexity.log"
        assert os.path.exists(log_file_path)

        with open(log_file_path, "r") as log_file:
            log_content = log_file.read()
            assert f"Perplexity response for query '{query}'" in log_content
            assert result in log_content

    except Timeout:
        # Log a message indicating the timeout
        print("The request to Perplexity API timed out.")

        # Check if timeout is logged
        with open("logs/collector_perplexity.log", "r") as log_file:
            log_content = log_file.read()
            assert "Request to Perplexity API timed out" in log_content

        pytest.skip("Test skipped due to API timeout")

    except RequestException as e:
        # Check if the error is logged
        with open("logs/collector_perplexity.log", "r") as log_file:
            log_content = log_file.read()
            assert "Error making request to Perplexity API" in log_content

        if "524 Server Error" in str(e):
            assert "Received a 524 error (Origin Time-out)" in log_content
            pytest.skip("Test skipped due to 524 Server Error (Origin Time-out)")
        else:
            pytest.fail(f"Test failed with unexpected RequestException: {str(e)}")

    except Exception as e:
        pytest.fail(f"Test failed with unexpected exception: {str(e)}")

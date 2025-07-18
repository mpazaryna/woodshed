import pytest

from woodshed.integrations.providers.openai.url_summarizer import run_call_summarize


def test_run_call_summarize():
    """
    Test the run_call_summarize function to ensure it returns a non-empty summary
    for a valid URL.
    """
    url_to_test = "https://austinkleon.com/2010/01/31/logbook/"
    summary = run_call_summarize(url_to_test)

    # Check that the summary is a non-empty string
    assert isinstance(summary, str), "Summary should be a string"
    assert len(summary) > 0, "Summary should not be empty"

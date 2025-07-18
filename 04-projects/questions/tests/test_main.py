import pytest

from questions.main import main


@pytest.mark.asyncio
async def test_main_integration():
    # Define test inputs
    question = "Tell me more about Miliken Mills the fabric industry leader?"
    expert_type = "investment analyst"
    log_to_file = False  # Change to True if you want to log to a file

    # Set up logging to capture output for verification
    # logging.basicConfig(level=logging.INFO)
    # logger = logging.getLogger()

    # Run the main function with the test inputs
    await main(question=question, expert_type=expert_type, log_to_file=log_to_file)

    # Here you can add assertions based on expected outcomes
    # For example, you might want to check if certain log messages were produced
    # or if the results were saved correctly. This will depend on your implementation.
    # Since this is an integration test, you may want to check the output directory
    # or any files created as a result of running the main function.

    # Example assertion (you may need to adjust based on your actual implementation):
    # assert some_condition_based_on_results

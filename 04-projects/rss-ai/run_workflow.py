import os

from rss_kit.logger import setup_logger
from rss_kit.workflow import process_feeds

# Setup logger
logger = setup_logger("run_workflow", "run_workflow.log")


def main():
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Construct paths
    feed_file = os.path.join(current_dir, "data", "feeds.yaml")
    output_dir = os.path.join(current_dir, "data", "workflow")

    # Process feeds
    try:
        process_feeds(feed_file, output_dir, days=30)
        logger.info("Workflow completed successfully")
    except Exception as e:
        logger.error(f"An error occurred during workflow execution: {str(e)}")


if __name__ == "__main__":
    main()

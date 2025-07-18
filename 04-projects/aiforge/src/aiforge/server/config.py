# config.py
import logging

# Set up logging
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Define critical thresholds
CRITICAL_CPU_THRESHOLD = 90.0
CRITICAL_MEMORY_THRESHOLD = 90.0
CRITICAL_DISK_THRESHOLD = 90.0

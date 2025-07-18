import logging
from io import BytesIO
from typing import Union

from PIL import Image

from aiforge.utils.file_utils import get_file

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def load_image(file_name: str) -> Image.Image:
    try:
        # Get the file content as bytes
        image_data: Union[str, bytes] = get_file(file_name, binary=True)

        # Ensure image_data is bytes
        if isinstance(image_data, str):
            image_data = image_data.encode("utf-8")

        # Create an image object from the bytes data
        image = Image.open(BytesIO(image_data))

        return image
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Image file not found: {file_name}") from e
    except IOError as e:
        raise IOError(f"Error loading image {file_name}: {str(e)}") from e

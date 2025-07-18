from PIL import Image, ImageEnhance, ImageFilter

from aiforge.images.load import load_image


async def enhance_document_image(
    image_name: str,
    contrast_factor: float = 1.5,
    sharpen: bool = True,
    grayscale: bool = True,
) -> Image.Image:
    """
    Enhance a document image by increasing contrast, applying sharpening,
    and optionally converting to grayscale.

    Args:
        image_name (str): Name of the input image file.
        contrast_factor (float): Factor to increase contrast (default: 1.5).
        sharpen (bool): Whether to apply sharpening filter (default: True).
        grayscale (bool): Whether to convert to grayscale (default: True).

    Returns:
        Image.Image: Enhanced PIL Image object.

    Raises:
        IOError: If the image file cannot be loaded.
    """
    try:
        # Load the image
        image = await load_image(image_name)
    except IOError as e:
        raise IOError(f"Failed to load image '{image_name}': {str(e)}")

    # Increase contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(contrast_factor)

    # Apply sharpening filter if requested
    if sharpen:
        image = image.filter(ImageFilter.SHARPEN)

    # Convert to grayscale if requested
    if grayscale:
        image = image.convert("L")

    return image

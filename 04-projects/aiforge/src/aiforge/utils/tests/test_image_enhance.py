import os
from pathlib import Path

import pytest
from PIL import Image

from aiforge.config import config
from aiforge.images.enhance import enhance_document_image
from aiforge.images.load import load_image


@pytest.fixture
def output_files():
    return {
        "enhanced": config.tmp_dir / "test_enhanced.png",
        "another_enhanced": Path(os.getcwd()) / "test_enhanced.png",
    }


@pytest.fixture(autouse=True)
def cleanup(output_files):
    yield
    # Clean up files after tests only if KEEP_TEST_FILES is not set
    if os.environ.get("KEEP_TEST_FILES", "").lower() != "true":
        for file_path in output_files.values():
            if file_path.exists():
                file_path.unlink()
    else:
        print("\nTest files were not deleted. You can find them at:")
        for key, file_path in output_files.items():
            if file_path.exists():
                print(f"- {key}: {file_path}")


@pytest.mark.asyncio
async def test_load_image():
    # Arrange
    test_image_name = config.tmp_dir / "test.png"

    # Act
    loaded_image = await load_image(test_image_name)

    # Assert
    assert isinstance(
        loaded_image, Image.Image
    ), "load_image did not return a PIL Image"
    assert loaded_image.mode in [
        "RGB",
        "RGBA",
        "L",
    ], f"Unexpected image mode: {loaded_image.mode}"


@pytest.mark.asyncio
async def test_enhance_document_image_two(output_files):
    # Arrange
    test_image_name = config.tmp_dir / "test.png"

    # Act
    original_image = await load_image(test_image_name)

    # Ensure the test image was loaded successfully
    assert isinstance(
        original_image, Image.Image
    ), f"Failed to load test image: {test_image_name}"

    # Process the image
    enhanced_image = await enhance_document_image(test_image_name)

    # Assert
    assert isinstance(enhanced_image, Image.Image), "Result is not a PIL Image"
    assert enhanced_image.mode == "L", "Resulting image is not grayscale"
    assert enhanced_image.size == original_image.size, "Image dimensions have changed"

    # Save the enhanced image for manual inspection
    enhanced_image.save(output_files["another_enhanced"])

    # Check if the enhanced image file was created
    assert output_files[
        "another_enhanced"
    ].exists(), f"Enhanced image was not saved to {output_files['another_enhanced']}"

    print(f"Enhanced image saved to {output_files['another_enhanced']}")

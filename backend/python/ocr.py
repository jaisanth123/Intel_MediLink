import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import cv2
import numpy as np
import os
import re

def enhance_image_for_ocr(image_path, scale_factor=2):
    """
    Enhance image for better OCR performance by:
    1. Grayscaling
    2. Upscaling
    3. Contrast enhancement
    4. Sharpening

    Args:
        image_path (str): Path to input image
        scale_factor (int): Factor to upscale the image (default: 2)

    Returns:
        PIL.Image: Enhanced image for OCR
    """
    # Read image
    image = Image.open(image_path)

    # Convert to grayscale
    grayscale_image = image.convert('L')

    # Upscale the image
    width, height = grayscale_image.size
    upscaled_image = grayscale_image.resize(
        (width * scale_factor, height * scale_factor),
        Image.LANCZOS  # High-quality upscaling algorithm
    )

    # Enhance contrast
    enhancer = ImageEnhance.Contrast(upscaled_image)
    enhanced_image = enhancer.enhance(2.0)

    # Apply sharpening filter
    sharpened_image = enhanced_image.filter(ImageFilter.SHARPEN)

    return sharpened_image

def extract_text_from_enhanced_image(image_path, lang='eng'):
    """
    Extract text using enhanced image preprocessing

    Args:
        image_path (str): Path to input image
        lang (str): OCR language (default: English)

    Returns:
        str: Extracted and cleaned text
    """
    # Enhance the image
    enhanced_image = enhance_image_for_ocr(image_path)

    # Tesseract configuration for improved accuracy
    config = (
        '--oem 3 '  # OCR Engine Mode 3 (default)
        '--psm 6 '  # Assume a single uniform block of text
        '-c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 '
    )

    try:
        # Extract text
        raw_text = pytesseract.image_to_string(enhanced_image, lang=lang, config=config)

        # Clean the text
        cleaned_text = clean_text(raw_text)

        return cleaned_text

    except Exception as e:
        print(f"OCR Error: {e}")
        return ""

def clean_text(text):
    """
    Clean extracted text

    Args:
        text (str): Raw extracted text

    Returns:
        str: Cleaned text
    """
    if not text:
        return ""

    # Remove excessive whitespace
    text = re.sub(r'[\n\r\t]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()

    # Optional: Remove non-alphanumeric characters
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)

    return text

# Example usage
if __name__ == "__main__":
    try:
        # Replace with your image path
        image_path = "/home/brooklin/Downloads/Ingredient/1.png"

        # Extract text
        extracted_text = extract_text_from_enhanced_image(image_path)

        print("Extracted Text:")
        print(extracted_text)

    except Exception as e:
        print(f"An error occurred: {e}")
from paddleocr import PaddleOCR
import fitz
import os
import cv2
import numpy as np

def draw_boxes_on_image(image_path, results, output_path):
    """
    Draw boxes around detected text on the image
    """
    # Read the image
    img = cv2.imread(image_path)
    
    # Draw boxes for each detected text
    for line in results[0]:
        box = line[0]
        # Convert box coordinates to integers
        box = np.array(box).astype(np.int32)
        # Draw rectangle
        cv2.polylines(img, [box], True, (0, 255, 0), 2)
    
    # Save the image with boxes
    cv2.imwrite(output_path, img)
    return output_path

def convert_pdf_to_image(pdf_path, output_dir='temp_images'):
    """
    Convert PDF to images and save them in the output directory
    Returns the path to the first image
    """
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    doc = fitz.open(pdf_path)

    # Convert first page to image
    page = doc.load_page(0)  # page numbering starts at 0
    image = page.get_pixmap()
    
    # Save first page as image
    image_path = os.path.join(output_dir, 'page_1.jpg')
    image.save(image_path)
    
    return image_path

# Initialize OCR model
ocr = PaddleOCR(use_angle_cls=True, lang='en')

# Convert PDF to image and run OCR
pdf_path = 'tp2.pdf'  # Replace with your PDF path
image_path = convert_pdf_to_image(pdf_path)
results = ocr.ocr(image_path, cls=True)

# Draw boxes on the image and save the result
output_image_path = 'output_with_boxes.jpg'
draw_boxes_on_image(image_path, results, output_image_path)

# Print results
for line in results[0]:
    box = line[0]
    text = line[1][0]
    confidence = line[1][1]
    print(f"Detected text: '{text}' with confidence {confidence:.2f} at {box}")

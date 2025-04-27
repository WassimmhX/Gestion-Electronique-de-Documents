import ollama
import tempfile
import subprocess
import fitz
import os
from datetime import datetime, timedelta

def classify_document(text: str) -> str:
    """
    Classifies a document based on its content.
    Args:
        text (str): The text extracted from the PDF.
    Returns:
        str: The type of the document (e.g., 'facture', 'contrat', etc.).
    """
    prompt = f"""
You are a document classification expert.
Given the following document content, determine its type.
Respond with a single word like: Facture, Contrat, Rapport, Lettre, etc.

Document:
\"\"\"
{text}
\"\"\"

Type:"""

    response = ollama.chat(
        model='qwen2.5',  # or the model you prefer, like mistral, llama2, etc.
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    
    # Extract and clean the model's response
    document_type = response['message']['content'].strip()
    
    return document_type

def convert_pdf_to_image(pdf_file):
    """
    Convert PDF (in memory) to images and return image paths
    """
    output_dir = 'temp_images'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    doc = fitz.open(stream=pdf_file, filetype="pdf")

    # Convert first page to image
    page = doc.load_page(0)  # page numbering starts at 0
    image = page.get_pixmap()

    # Save first page as image
    image_path = os.path.join(output_dir, 'page_1.jpg')
    image.save(image_path)
    
    return image_path
def convert_docx_to_image(docx_bytes):
    # Step 1: Save DOCX temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp_docx:
        tmp_docx.write(docx_bytes)
        docx_path = tmp_docx.name

    # Step 2: Convert DOCX to PDF
    output_pdf_path = docx_path.replace('.docx', '.pdf')
    
    # Use libreoffice to convert
    try:
        subprocess.run([
            'libreoffice', '--headless', '--convert-to', 'pdf', '--outdir',
            os.path.dirname(docx_path), docx_path
        ], check=True)
    except subprocess.CalledProcessError as e:
        raise Exception("Failed to convert DOCX to PDF") from e

    # Step 3: Convert PDF to Image
    doc = fitz.open(output_pdf_path)
    page = doc.load_page(0)
    image = page.get_pixmap()

    image_path = output_pdf_path.replace('.pdf', '.jpg')
    image.save(image_path)

    return image_path

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)
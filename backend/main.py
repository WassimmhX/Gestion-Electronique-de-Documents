from fastapi import FastAPI, File, UploadFile, HTTPException, status, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from paddleocr import PaddleOCR
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import cv2
import os
import tempfile
from utils import *

MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["DataBase"]
users_collection = db["users"]

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow any origin (good for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')


# Helper functions
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# API Endpoints

@app.post("/signup")
async def signup(email: str = Form(...), password: str = Form(...)):
    existing_user = await users_collection.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(password)
    user = {"email": email, "password": hashed_password}
    await users_collection.insert_one(user)

    return {"message": "User created successfully"}


@app.post("/login")
async def login(email: str = Form(...), password: str = Form(...)):
    user = await users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"message": "Login successful"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_content = await file.read()
        filename = file.filename.lower()

        if filename.endswith('.pdf'):
            image_path = convert_pdf_to_image(file_content)
        elif filename.endswith('.docx'):
            image_path = convert_docx_to_image(file_content)
        else:
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[-1]) as temp_img:
                temp_img.write(file_content)
                image_path = temp_img.name

        # OCR processing
        results = ocr.ocr(image_path, cls=True)
        image = cv2.imread(image_path)
        image_height, image_width, _ = image.shape

        content = []
        text = ""
        for result in results[0]:
            item = {"content": result[1][0], "coordinates": result[0]}
            content.append(item)
            text += result[1][0] + "\n"

        docType = classify_document(text)

        return {
            "image_size": {"width": image_width, "height": image_height},
            "content": content,
            "type": docType
        }

    except Exception as e:
        return {"error": str(e)}

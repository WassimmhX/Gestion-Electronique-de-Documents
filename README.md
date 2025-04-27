# Document Management System

A modern web application for document management and processing, featuring OCR capabilities, AI files recognition and understanding and user authentication.
100% local solution without using any API.
## Video Tutorial

Watch the video tutorial for a walkthrough of the document management system:

[Video Link](https://drive.google.com/file/d/1i5CGDpYGJoOnQkzthLql0PyqfiKZUsby/view?usp=drive_link)
## Features

- User authentication (login/signup)
- Document upload and processing
- OCR (Optical Character Recognition) using PaddleOCR
- Support for multiple file formats (PDF, DOCX, images)
- Document classification
- Modern UI with Tailwind CSS
- Responsive design

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Framer Motion for animations
- React Dropzone for file uploads

### Backend
- FastAPI (Python)
- MongoDB for database
- PaddleOCR for document processing
- OpenCV for image processing
- Bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- MongoDB
- PaddleOCR

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
```bash
venv\Scripts\activate
```
- Unix/MacOS:
```bash
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Install dependencies:
```bash
ollama run qwen2.5
```

6. Start the backend server:
```bash
uvicorn main:app --reload --port 5000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Create an account or login with existing credentials
3. Upload documents through the interface
4. View processed documents and their extracted text



## License

This project is developped by Lost Programmers.
## Contact
wmaharsia@gmail.com

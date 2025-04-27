# Document Management System

A modern web application for document management and processing, featuring OCR capabilities, AI files recognition and understanding and user authentication.
100% local solution without using any API.
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

## API Endpoints

- `POST /signup` - Create a new user account
- `POST /login` - Authenticate user
- `POST /upload` - Upload and process documents

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is developped by Lost Programmers.
## Contact
wmaharsia@gmail.com

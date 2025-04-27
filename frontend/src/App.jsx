import React, { useState, useEffect } from 'react';
import FileUploadPage from './components/FileUploadPage';
import PDFViewer from './components/PDFViewer';
import Login from './components/Login';
import Signup from './components/SignUp';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [pageItems, setPageItems] = useState([]);
  const [docType, setDocType] = useState("");
  const [imageSize, setImageSize] = useState({ width: 596, height: 842 });
  const [fileProcessed, setFileProcessed] = useState(false);
  const [editedContent, setEditedContent] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleSignupSuccess = () => {
    setShowSignup(false); // After signup, go to login
  };

  const handleFileProcessed = (data) => {
    setPageItems(data.content);
    setImageSize(data.image_size);
    setDocType(data.type)
    setFileProcessed(true);
  };

  const handleContentChange = (updatedContent) => {
    setEditedContent(updatedContent);
  };

  const handleReturnToUpload = () => {
    setFileProcessed(false);
    setPageItems([]);
    setEditedContent([]);
  };

  if (!isAuthenticated) {
    return showSignup ? (
      <Signup onSignupSuccess={handleSignupSuccess} goToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onLoginSuccess={handleLoginSuccess} goToSignup={() => setShowSignup(true)} />
    );
  }

  return (
    <div className="App min-h-screen bg-gray-100">
      <header className="py-6 text-center flex justify-between items-center px-8 bg-white shadow">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">PDF Content Editor</h1>
          <p className="text-gray-500 mt-1 text-sm">Upload and edit your PDFs easily</p>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {!fileProcessed ? (
        <div className="container mx-auto py-12">
          <FileUploadPage onFileProcessed={handleFileProcessed} />
        </div>
      ) : (
        <PDFViewer 
          pageItems={pageItems} 
          imageSize={imageSize} 
          docType={docType}
          onContentChange={handleContentChange}
          onReturn={handleReturnToUpload}
        />
      )}
      <footer className="text-center text-xs text-gray-400 py-4">
        Built with ❤️ by Lost Programmers | 2025
      </footer>
    </div>
  );
}

export default App;

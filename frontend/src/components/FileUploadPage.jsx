import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function FileUploadPage({ onFileProcessed }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      onFileProcessed(response.data);
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/30 overflow-hidden"
      >
        {/* Decorative blobs */}
        <motion.div 
          className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-30 filter blur-3xl" 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-20 -right-20 w-72 h-72 bg-gradient-to-tr from-indigo-400 to-blue-500 rounded-full opacity-20 filter blur-3xl" 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-center text-gray-800 drop-shadow-sm mb-8">
            Upload & Analyze
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.label
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-purple-400 rounded-3xl bg-white/30 cursor-pointer transition hover:bg-white/50"
            >
              <input
                type="file"
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4h10v12m-5 4h.01M12 4v16" />
                </svg>
                <span className="text-gray-700 font-medium text-lg">
                  {selectedFile ? selectedFile.name : 'Drag & Drop or Click to Select'}
                </span>
              </div>
            </motion.label>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center text-sm font-semibold"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={!selectedFile || isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-white tracking-wide transition-all 
                ${!selectedFile || isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 hover:from-purple-600 hover:via-pink-600 hover:to-red-500'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload File'
              )}
            </motion.button>

            <p className="text-xs text-gray-600 text-center">
              Supported formats: PDF, DOCX, JPG, PNG | Max: 10MB
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default FileUploadPage;

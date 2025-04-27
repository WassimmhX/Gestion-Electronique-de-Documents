import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
function PDFViewer({ pageItems, imageSize,docType, onContentChange, onReturn}) {
  const [isLoading, setIsLoading] = useState(false);
  const [editableItems, setEditableItems] = useState(pageItems || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const editInputRef = useRef(null);

  // Container dimensions
  const displayWidth = 800;
  const displayHeight = 1130; // Adjusted for A4 aspect ratio

  // Update editableItems when pageItems changes
  React.useEffect(() => {
    if (pageItems && pageItems.length > 0) {
      setEditableItems([...pageItems]);
    }
  }, [pageItems]);

  const handleEditStart = (index) => {
    setEditingIndex(index);
    // Focus on the input after it renders
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 0);
  };

  const handleEditSave = (index, newText) => {
    const updatedItems = [...editableItems];
    updatedItems[index] = { ...updatedItems[index], content: newText };
    setEditableItems(updatedItems);
    setEditingIndex(null);
    
    // Notify parent component of content change
    if (onContentChange) {
      onContentChange(updatedItems);
    }
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
  };

  const handleKeyDown = (e, index, text) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave(index, text);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const saveToTextFile = () => {
    const content = editableItems.map(item => item.content).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited-document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export to PDF requires additional libraries
  const saveToPDF = () => {
    alert('To save as PDF, you need to add PDF generation logic using libraries like jsPDF and html2canvas.');
    // Implementation would go here if those libraries are added
  };
  const handleReturn = () => {
    // Call any parent function to reset state
    if (window.confirm('Return to file upload? Any unsaved changes will be lost.')) {
      onReturn() // Simple reload as fallback
    }
  };
  const autoResizeTextarea = (textarea) => {
    if (!textarea) return;
    // Reset height to allow shrinking
    textarea.style.height = 'auto';
    // Set height to scrollHeight to fit content
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  const handleTextareaChange = (e) => {
    // Auto-resize as user types
    autoResizeTextarea(e.target);
  };
  // Render individual text items
  const renderTextItems = () => {
    const scaleX = displayWidth / imageSize.width;
    const scaleY = displayHeight / imageSize.height;

    return editableItems.map((item, index) => {
      if (!item.coordinates || item.coordinates.length !== 4) {
        console.warn('Invalid coordinates for item:', item);
        return null;
      }

      // Scale coordinates
      const scaledCoordinates = item.coordinates.map(coord => [
        Math.round(coord[0] * scaleX), 
        Math.round(coord[1] * scaleY)
      ]);

      const [topLeft, topRight, bottomRight, bottomLeft] = scaledCoordinates;

      // Calculate width and height based on scaled coordinates
      const width = Math.max(5, topRight[0] - topLeft[0]); // Ensure minimum width
      const height = Math.max(5, bottomLeft[1] - topLeft[1]); // Ensure minimum height

      const style = {
        position: 'absolute',
        top: `${topLeft[1]}px`,
        left: `${topLeft[0]}px`,
        width: `${width}px`,
        height: `${height}px`,
        padding: '2px',
        fontSize: '14px',
        lineHeight: '1.2',
        boxSizing: 'border-box',
        wordBreak: 'break-word',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid transparent',
        cursor: 'pointer',
        overflow: 'visible',
        transition: 'background-color 0.2s, border 0.2s',
      };

      if (editingIndex === index) {
        return (
            <div key={index} style={style} className="editing-container">
              <textarea
                ref={editInputRef}
                defaultValue={item.content}
                style={{ 
                  width: '100%', 
                  minHeight: `${height - 8}px`, // Account for padding
                  border: 'none', 
                  outline: 'none',
                  background: 'transparent',
                  resize: 'none',
                  padding: '0',
                  margin: '0',
                  lineHeight: '1.2',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  overflow: 'hidden'
                }}
                onBlur={(e) => handleEditSave(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index, e.target.value)}
                onChange={handleTextareaChange}
              />
            </div>
          );
      }

      return (
        <div 
          key={index} 
          style={style}
          onClick={() => handleEditStart(index)}
          className="hover:bg-blue-50 hover:border-blue-200"
          title="Click to edit"
        >
          {item.content}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6 w-full">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-6 relative flex flex-col space-y-6">
  
        {/* Header Bar */}
        <div className="flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-2xl shadow">
          <button
            onClick={handleReturn}
            className="flex items-center space-x-2 bg-white text-indigo-600 font-semibold px-4 py-2 rounded-full hover:bg-indigo-50 transition"
            title="Return to file upload"
          >
            <span className="material-icons text-sm mr-1">←</span>
            <span>Back</span>
          </button>
          <h2 className="text-2xl font-bold tracking-wide">Document Type: {docType || 'Document'}</h2>
          <div className="flex space-x-3">
            <button
              onClick={saveToTextFile}
              className="bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold hover:bg-indigo-50 transition"
            >
              Save as Text
            </button>
            <button
              onClick={saveToPDF}
              className="bg-white text-green-600 px-4 py-2 rounded-full font-semibold hover:bg-green-50 transition"
            >
              Save as PDF
            </button>
          </div>
        </div>
  
        {/* Document Preview */}
        <div
          className="relative border-2 border-dashed border-gray-300 bg-white rounded-xl overflow-hidden"
          style={{
            width: `${displayWidth}px`,
            height: `${displayHeight}px`,
            margin: '0 auto',
          }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500 animate-pulse">Loading document content...</p>
            </div>
          ) : editableItems.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-400">No content found in document</p>
            </div>
          ) : (
            renderTextItems()
          )}
        </div>
  
        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-4">
          <button className="px-6 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition">
            Previous
          </button>
          <span className="text-sm text-gray-600">Page 1</span>
          <button className="px-6 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition">
            Next
          </button>
        </div>
  
        {/* Footer */}
        <div className="text-center text-xs text-gray-400">
          * PDF export requires libraries like <strong>jsPDF</strong> and <strong>html2canvas</strong>.
        </div>
  
      </div>
    </div>
  );
}

export default PDFViewer;
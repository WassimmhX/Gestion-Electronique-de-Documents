import React, { useState, useRef, useEffect } from 'react';

function PDFViewer({ pageItems, imageSize, docType, onContentChange, onReturn }) {
  const [isLoading, setIsLoading] = useState(false);
  const [editableItems, setEditableItems] = useState(pageItems || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const editInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const resultRefs = useRef([]);

  // Container dimensions
  const displayWidth = 800;
  const displayHeight = 1130; // Adjusted for A4 aspect ratio

  // Update editableItems when pageItems changes
  useEffect(() => {
    if (pageItems && pageItems.length > 0) {
      setEditableItems([...pageItems]);
    }
  }, [pageItems]);

  // Effect to handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setCurrentResultIndex(-1);
      return;
    }

    const results = [];
    editableItems.forEach((item, itemIndex) => {
      const content = item.content || '';
      let startIndex = 0;
      let index;

      // Find all occurrences of searchTerm in this item
      while ((index = content.toLowerCase().indexOf(searchTerm.toLowerCase(), startIndex)) !== -1) {
        results.push({
          itemIndex,
          startIndex: index,
          endIndex: index + searchTerm.length,
          text: content.substring(index, index + searchTerm.length)
        });
        startIndex = index + 1;
      }
    });

    setSearchResults(results);
    setCurrentResultIndex(results.length > 0 ? 0 : -1);
  }, [searchTerm, editableItems]);

  // Scroll to current search result
  useEffect(() => {
    if (currentResultIndex >= 0 && currentResultIndex < searchResults.length) {
      const currentRef = resultRefs.current[currentResultIndex];
      if (currentRef) {
        currentRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentResultIndex, searchResults]);

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
      onReturn(); // Simple reload as fallback
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

  // Search navigation functions
  const goToNextResult = () => {
    if (searchResults.length === 0) return;
    setCurrentResultIndex((prevIndex) => (prevIndex + 1) % searchResults.length);
  };

  const goToPrevResult = () => {
    if (searchResults.length === 0) return;
    setCurrentResultIndex((prevIndex) => (prevIndex - 1 + searchResults.length) % searchResults.length);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setCurrentResultIndex(-1);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
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

      // If we have a search term, highlight occurrences
      if (searchTerm && item.content) {
        const content = item.content;
        const lowerContent = content.toLowerCase();
        const lowerSearchTerm = searchTerm.toLowerCase();
        
        if (lowerContent.includes(lowerSearchTerm)) {
          // Split content into segments: highlighted and non-highlighted
          const segments = [];
          let lastIndex = 0;
          let searchIndex = 0;
          
          while ((searchIndex = lowerContent.indexOf(lowerSearchTerm, lastIndex)) !== -1) {
            // Add text before this occurrence
            if (searchIndex > lastIndex) {
              segments.push({
                text: content.substring(lastIndex, searchIndex),
                highlight: false
              });
            }
            
            // Add the highlighted term
            const resultIndex = searchResults.findIndex(
              r => r.itemIndex === index && r.startIndex === searchIndex
            );
            
            segments.push({
              text: content.substring(searchIndex, searchIndex + searchTerm.length),
              highlight: true,
              isCurrent: resultIndex === currentResultIndex,
              resultIndex
            });
            
            lastIndex = searchIndex + searchTerm.length;
          }
          
          // Add any remaining text
          if (lastIndex < content.length) {
            segments.push({
              text: content.substring(lastIndex),
              highlight: false
            });
          }
          
          return (
            <div 
              key={index} 
              style={style}
              onClick={() => handleEditStart(index)}
              className="hover:bg-blue-50 hover:border-blue-200"
              title="Click to edit"
            >
              {segments.map((segment, segIdx) => {
                if (segment.highlight) {
                  return (
                    <span 
                      key={segIdx}
                      ref={segment.isCurrent ? (el) => (resultRefs.current[segment.resultIndex] = el) : null}
                      style={{
                        backgroundColor: segment.isCurrent ? '#FFCC00' : '#FFFF00',
                        padding: '0 1px',
                        borderRadius: '2px',
                        fontWeight: segment.isCurrent ? 'bold' : 'normal',
                        boxShadow: segment.isCurrent ? '0 0 3px rgba(0,0,0,0.3)' : 'none'
                      }}
                    >
                      {segment.text}
                    </span>
                  );
                }
                return <span key={segIdx}>{segment.text}</span>;
              })}
            </div>
          );
        }
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
        
        {/* Search Bar */}
        <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-xl">
          <div className="relative flex-grow">
            <input
              type="text"
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in document..."
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={goToPrevResult}
            disabled={searchResults.length === 0}
            className={`p-2 rounded-lg ${searchResults.length > 0 ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            title="Previous result"
          >
            ↑
          </button>
          <button
            onClick={goToNextResult}
            disabled={searchResults.length === 0}
            className={`p-2 rounded-lg ${searchResults.length > 0 ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            title="Next result"
          >
            ↓
          </button>
          <div className="text-sm font-medium text-gray-600">
            {searchResults.length > 0 ? 
              `${currentResultIndex + 1} of ${searchResults.length} results` : 
              searchTerm ? 'No results' : ''}
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
          <p>* PDF export requires libraries like <strong>jsPDF</strong> and <strong>html2canvas</strong>.</p>
          <p>* Search results: {searchResults.length > 0 ? `${searchResults.length} occurrences found` : 'Type to search'}</p>
        </div>
  
      </div>
    </div>
  );
}

export default PDFViewer;
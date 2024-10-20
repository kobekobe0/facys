import React, { useState } from 'react';

const DragAndDrop = ({ setFile, handleNext, file }) => {
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFileName(droppedFile.name);
      setFile(droppedFile);
    }
  };

  const handleClick = () => {
    document.getElementById('file-input').click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  return (
    <div className="mt-4 w-full">
      <div className='flex flex-col mb-8'>
        <h2 className='text-xl font-semibold text-gray-600'><span className='text-lg font-normal'>Step 1:</span> Upload your COR</h2>
        <p className='text-sm text-gray-500'>Upload the original file that came from student portal.</p>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 h-[200px] flex flex-col items-center justify-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-100'
            : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
      {fileName ? (
          <p className="mt-2 text-gray-700 font-medium">{fileName}</p>
      ) : (
          <p className="text-gray-500">Drag & drop your file here or click to upload</p>
      )}
        
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="application/pdf"
        />
      </div>

      <div className='flex items-end w-full justify-end my-4'>
        <button 
          onClick={handleNext}  // Fixed here
          className={`${file ? 'bg-red-600' : 'bg-gray-400'} text-white px-8 py-2 rounded-md ${file ? 'hover:bg-red-800' : ''} transition-all ease-in-out`} 
          disabled={!file}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DragAndDrop;

import React, { useState } from 'react';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isStepCompleted, setIsStepCompleted] = useState(false);

  const handleNext = () => {
    if (isStepCompleted) {
      setActiveTab((prev) => prev + 1);
      setIsStepCompleted(false); // Reset step completion for the next tab
    }
  };

  const handleBack = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  const handleStepCompletion = () => {
    setIsStepCompleted(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registration</h1>
      <div className="tabs flex space-x-4 mb-4">
        <button
          className={`tab ${activeTab === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab(0)}
        >
          Instructions
        </button>
        <button
          className={`tab ${activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab(1)}
        >
          File Upload
        </button>
        <button
          className={`tab ${activeTab === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab(2)}
        >
          Webcam
        </button>
        <button
          className={`tab ${activeTab === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab(3)}
        >
          Finish
        </button>
      </div>

      {activeTab === 0 && (
        <div className="instruction">
          <h2 className="text-xl font-semibold">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Step 1: Fill in the required information.</li>
            <li>Step 2: Upload the necessary documents.</li>
            <li>Step 3: Capture your photo using the webcam.</li>
          </ol>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleStepCompletion}
          >
            Complete Instructions
          </button>
        </div>
      )}

      {activeTab === 1 && (
        <div className="file-upload">
          <h2 className="text-xl font-semibold">File Upload</h2>
          <input type="file" className="mt-2" />
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleStepCompletion}
          >
            Complete File Upload
          </button>
        </div>
      )}

      {activeTab === 2 && (
        <div className="webcam">
          <h2 className="text-xl font-semibold">Webcam Capture</h2>
          {/* Placeholder for webcam component */}
          <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
            <p className="text-gray-600">Webcam will be here.</p>
          </div>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleStepCompletion}
          >
            Complete Webcam Capture
          </button>
        </div>
      )}

      {activeTab === 3 && (
        <div className="finish">
          <h2 className="text-xl font-semibold">Finish</h2>
          <p className="mt-2">Thank you for completing your registration!</p>
        </div>
      )}

      <div className="navigation flex justify-between mt-4">
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          onClick={handleBack}
          disabled={activeTab === 0}
        >
          Back
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleNext}
          disabled={!isStepCompleted || activeTab === 3}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Tabs;

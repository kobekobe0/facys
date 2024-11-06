import React, { useState } from 'react';
import * as faceapi from 'face-api.js';
import toast from 'react-hot-toast';

const SetFaceData = ({ faceData, setFaceData2, setFaceData3, activeTab, setActiveTab, screenshot, handleRetry }) => {
    const [faceMatchStatus, setFaceMatchStatus] = useState({ faceData2: null, faceData3: null });

    // onChange handler to validate uploaded files
    const handleFileChange = async (event, setFaceDataState, faceKey) => {
        const file = event.target.files[0];
        
        // Check if file is an image
        if (file && file.type.startsWith('image/')) {
            const image = await loadImageFromFile(file);
            const result = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
    
            if (result) {
                const uploadedDescriptor = result.descriptor;
                setFaceDataState(uploadedDescriptor); // Set descriptor state for the uploaded image
    
                // Compare with the main face data
                const faceMatcher = new faceapi.FaceMatcher([new faceapi.LabeledFaceDescriptors('mainFace', [faceData])], 0.4);
                const bestMatch = faceMatcher.findBestMatch(uploadedDescriptor);
    
                // Check if uploaded face matches the main face data
                const isMatch = bestMatch.label !== 'unknown';
                setFaceMatchStatus(prev => ({ ...prev, [faceKey]: isMatch ? 'Match' : 'No Match' }));
    
                if (!isMatch) {
                    toast.error("Face does not match the main photo. Please try another.");
                }
            } else {
                setFaceMatchStatus(prev => ({ ...prev, [faceKey]: 'No Face Detected' }));
                toast.error("No face detected in the uploaded photo. Please upload a clear face image.");
            }
        } else {
            setFaceMatchStatus(prev => ({ ...prev, [faceKey]: 'Invalid File Type' }));
            toast.error("Invalid file type. Please upload an image file.");
        }
    };
    

    // Helper to load image from file input
    const loadImageFromFile = (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => resolve(img);
        });
    };

    const handleNext = () => {
        // Ensure both files are uploaded and matched
        if (faceMatchStatus.faceData2 === 'Match' && faceMatchStatus.faceData3 === 'Match') {
            setActiveTab(activeTab + 1);
        } else {
            toast.error("Please upload matching photos for both supporting images.");
        }
    };

    return (
        <div>
            <h2 className="text-2xl">Confirm Registration</h2>
            <p className="text-sm mb-4">Does this photo resemble your face?</p>
            <img src={screenshot} alt="Screenshot" className="h-[380px] w-[320px] object-cover" />
            
            {/* File input for first supporting image */}
            <div className="mt-4">
                <label className="text-sm">Upload first supporting photo:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFaceData2, 'faceData2')}
                />
                <p className="text-sm">{faceMatchStatus.faceData2}</p>
            </div>
            
            {/* File input for second supporting image */}
            <div className="mt-4">
                <label className="text-sm">Upload second supporting photo:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFaceData3, 'faceData3')}
                />
                <p className="text-sm">{faceMatchStatus.faceData3}</p>
            </div>

            <div className="flex mt-4 gap-4 justify-end">
                <button className="flex items-center border-red-700 border rounded text-red-700 gap-2 px-2 py-1" onClick={() => handleRetry(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                        <path fill="#c20000" fillRule="evenodd" d="M7.32.029a8 8 0 0 1 7.18 3.307V1.75a.75.75 0 0 1 1.5 0V6h-4.25a.75.75 0 0 1 0-1.5h1.727A6.5 6.5 0 0 0 1.694 6.424A.75.75 0 1 1 .239 6.06A8 8 0 0 1 7.319.03Zm-3.4 14.852A8 8 0 0 0 15.76 9.94a.75.75 0 0 0-1.455-.364A6.5 6.5 0 0 1 2.523 11.5H4.25a.75.75 0 0 0 0-1.5H0v4.25a.75.75 0 0 0 1.5 0v-1.586a8 8 0 0 0 2.42 2.217" clipRule="evenodd"/>
                    </svg>
                    Retry
                </button>
                <button className="border border-red-700 text-white bg-red-700 rounded px-2 py-1" onClick={handleNext}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default SetFaceData;

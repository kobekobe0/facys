import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import API_URL from '../../constants/api';

const CORUpdate = ({student}) => {
    const [details, setDetails] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [file, setFile] = useState(null);

    const handleDrop = (event) => {
        event.preventDefault();
        const uploadedFile = event.dataTransfer.files[0];
        if (uploadedFile && uploadedFile.type === "application/pdf") {
            setFile(uploadedFile);
        } else {
            toast.error("Please upload a PDF file.");
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleUpload = () => {
        if (file) {
            // Simulate upload and show a toast notification
            toast.success("File uploaded successfully!");
            setDetails({name: "sda"}); // Set to true to show details and schedule fields
        } else {
            toast.error("Please select a file to upload.");
        }
    };

    const handleConfirm = () => {
        if (details) {
            toast.success("Details confirmed!");
            // Logic to confirm details goes here
        } else {
            toast.error("Please enter details.");
        }
    };

    const corUpdate = async () => {
        if(!file) return toast.error('Please upload a valid PDF file.');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${API_URL}student/cor`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(res.data.details.studentNumber !== student.studentNumber) return toast.error("Please upload student's COR");
            console.log(res.data)
            setDetails(res.data.details);
            setSchedule(res.data.schedules);
            toast.success('COR Uploaded');
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        }
    };

    const handleSubmitDetails = async () => {

        console.log('clicked')
        console.log(schedule)
        if(!details) return toast.error('Please upload a COR file first.');
        try {
            const res = await axios.put(`${API_URL}student/update/${student._id}`, {
                ...details,
                schedule: JSON.stringify(schedule)
            }, {
                headers: {
                    'Authorization': localStorage.getItem('authToken')
                }
            });
            toast.success('Details Updated');
            window.location.reload()
        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-800 mb-8">COR Update</h2>

            {/* Drag-and-Drop File Upload Section */}
            <div
                className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <input
                    type="file"
                    id="fileInput"
                    onChange={(e) => {
                        const uploadedFile = e.target.files[0];
                        if (uploadedFile && uploadedFile.type === "application/pdf") {
                            setFile(uploadedFile);
                        } else {
                            toast.error("Please upload a PDF file.");
                        }
                    }}
                    className="hidden"
                />
                <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="M3 10h18M3 6h18M3 14h18m-7 4h7m-7-4v4m-5-6l4-4-4-4"/>
                    </svg>
                    <p className="text-gray-500">Drag and Drop file here or <span className="text-blue-600 cursor-pointer">Choose file</span></p>
                    <p className="text-xs text-gray-400">Supported format: PDF. Maximum size: 25MB</p>
                </div>
            </div>

            {/* Display Uploaded File Name */}
            {file && (
                <div className="my-8 text-gray-700">
                    <p>Uploaded File: <strong>{file.name}</strong></p>
                </div>
            )}

            {/* Upload Button */}
            {
                details && (
                    <div className="mt-4">
                        <button
                            onClick={handleSubmitDetails}
                            className="bg-red-600 text-white py-2 rounded-lg w-full hover:bg-red-700 transition"
                        >
                            Confirm
                        </button>
                    </div>
                )

            }
            {
                !details && (
                    <div className="mt-4">
                        <button
                            onClick={corUpdate}
                            className="border border-red-600 text-red-600 py-2 rounded-lg w-full hover:bg-red-700 transition"
                        >
                            Upload
                        </button>
                    </div>
                )

            }            
        </div>
    );
};

export default CORUpdate;

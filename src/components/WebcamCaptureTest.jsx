import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import MODEL_URL from '../constants/model';
import API_URL from '../constants/api';
import axios from 'axios';
import toast from 'react-hot-toast';

const WebcamCaptureTest = ({ setFaceData, next, back, id }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalIdRef = useRef(null);
    const [confidence, setConfidence] = useState(0);
    const [capturedImage, setCapturedImage] = useState(null);
    const [capturedFile, setCapturedFile] = useState(null);
    const [faceData, setFaceDataState] = useState(null); // Store face descriptor
    const [start, setStart] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);

    // Load face-api.js models
    const loadModels = async () => {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
        ]);
        console.log("Models loaded successfully");
    };

    // Get list of video input devices (cameras)
    const getVideoDevices = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);
    };

    useEffect(() => {
        loadModels();
        getVideoDevices();
    }, []);

    const startVideo = async () => {
        if (!selectedDeviceId) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: selectedDeviceId,
                    width: 720,
                    height: 720,
                },
                audio: false,
            });
            videoRef.current.srcObject = stream;

            // Set canvas dimensions to match the video dimensions
            videoRef.current.onloadedmetadata = () => {
                const { videoWidth, videoHeight } = videoRef.current;
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;
            };

            // Start face detection at regular intervals
            intervalIdRef.current = setInterval(detectFace, 500);
        } catch (err) {
            console.error("Error accessing webcam: ", err);
        }
    };

    useEffect(() => {
        if (start) {
            startVideo();
        }
        return () => clearInterval(intervalIdRef.current); // Clear interval on component unmount
    }, [start, selectedDeviceId]);

    // Detect face and display it on the canvas
    const detectFace = async () => {
        if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
            const detections = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks();

            const canvas = canvasRef.current;
            const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
            faceapi.matchDimensions(canvas, displaySize);

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous detections

            if (detections) {
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

                // Update confidence level
                const detectionScore = detections.detection.score;
                setConfidence(detectionScore);
            } else {
                setConfidence(0); // Reset confidence if no face is detected
            }
        }
    };

    // Capture the screenshot from the video, extract face data, and save it as a file
    const captureImage = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (video.readyState === 4) {
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to Blob and then to File
            canvas.toBlob(async (blob) => {
                const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
                setCapturedFile(file);

                // Display the captured image
                const imageUrl = URL.createObjectURL(file);
                setCapturedImage(imageUrl);

                // Extract face data from the captured image
                const img = new Image();
                img.src = imageUrl;
                img.onload = async () => {
                    const detection = await faceapi
                        .detectSingleFace(img)
                        .withFaceLandmarks()
                        .withFaceDescriptor();
                    
                    if (detection) {
                        setFaceDataState(detection.descriptor); // Store face descriptor in state
                        console.log("Extracted face data (descriptor):", detection.descriptor); // Debug log
                    }
                };

                // Stop the video stream and clear the canvas
                stopVideo();
            }, 'image/jpeg', 0.9);
        }
    };

    // Stop the video and clear the canvas
    const stopVideo = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setStart(false);
        clearInterval(intervalIdRef.current);
    };

    // Retry capturing a new image
    const handleRetry = () => {
        setCapturedImage(null);
        setCapturedFile(null);
        setFaceDataState(null); // Reset face data
        setConfidence(0);
        setStart(true); // Restart the video
    };

    // Update only the face data
    const handleUpdateFaceData = async () => {
        toast.loading("Updating face data...");
        try{
            if (faceData) {
                const formData = new FormData();
    
                // Append face data to form data
                formData.append('faceData', JSON.stringify(faceData));
                formData.append('updatePfp', false);
    
                const res = await axios.post(`${API_URL}student/update-face/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `${localStorage.getItem('authToken')}` }
                })
    
                toast.dismiss()
                toast.success("Face data updated successfully.");
                window.location.reload()
            }
        } catch (error) {
            toast.dismiss()
            console.error(error);
            toast.error("An error occurred while updating the face data.");
        }

    };

    // Update only the face data
    const handleUpdateFaceDataAndImage = async () => {
        toast.loading("Updating face data and profile image...");
        try{
            if (faceData && capturedFile) {
                const formData = new FormData();
    
                // Append face data to form data
                formData.append('faceData', JSON.stringify(faceData));
                formData.append('image', capturedFile);
                formData.append('updatePfp', true);
    
                const res = await axios.post(`${API_URL}student/update-face/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `${localStorage.getItem('authToken')}` }
                })
    
                console.log(res)
                
                toast.success("Face data and profile image updated successfully.");
                window.location.reload()
            }
        } catch (err) {
            toast.dismiss()
            console.error(err);
            toast.error("An error occurred while updating the face data and profile image.");

        }

    };


    // Handle camera selection
    const handleDeviceChange = (event) => {
        setSelectedDeviceId(event.target.value);
    };

    return (
        <div className="flex flex-col justify-center items-center w-full overflow-y-scroll">
            {/* Camera selection dropdown */}
            <div className="mb-4">
                <label htmlFor="camera-select" className="mr-2">Select Camera:</label>
                <select id="camera-select" onChange={handleDeviceChange} value={selectedDeviceId}>
                    {devices.map((device, index) => (
                        <option key={index} value={device.deviceId}>{device.label || `Camera ${index + 1}`}</option>
                    ))}
                </select>
            </div>

            {!capturedImage ? (
                <>
                    <div className="relative w-full max-w-[500px] h-[500px]">
                        <video
                            ref={videoRef}
                            playsInline
                            autoPlay
                            className="absolute top-0 left-0 w-full h-full object-cover shadow-lg"
                        />
                        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

                        {/* Circular border for face detection */}
                        <div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-20 border-dashed border-4 border-white"
                            style={{ width: '60%', height: '60%' }}
                        />
                    </div>

                    {/* Show Capture Button if confidence > 0.85 */}
                    {confidence > 0.85 && (
                        <button 
                            className="bg-blue-600 text-xs text-white rounded-md p-2 mt-4"
                            onClick={captureImage}
                        >
                            Capture Image
                        </button>
                    )}
                </>
            ) : (
                <div className="mt-4">
                    <h3 className="text-gray-600">Captured Image:</h3>
                    <img src={capturedImage} alt="Captured" className="w-[500px] h-[500px] object-cover mt-2 border" />
                    
                    <div className="flex gap-4 mt-4">
                        <button 
                            className="bg-gray-600 text-xs text-white rounded p-2"
                            onClick={handleRetry}
                        >
                            Retry
                        </button>
                        <button 
                            className="border border-red-600 text-xs text-red-600 rounded p-2"
                            onClick={handleUpdateFaceData}
                        >
                            Update Face Data
                        </button>
                        <button 
                            className="bg-red-600 text-xs text-white rounded p-2"
                            onClick={handleUpdateFaceDataAndImage}
                        >
                            Update Face Data & Profile Image
                        </button>
                    </div>
                </div>
            )}

            {
                !start && !capturedImage && (
                    <button 
                        className="bg-blue-600 text-xs text-white rounded-md p-2 mt-4"
                        onClick={() => setStart(true)}
                    >
                        Start Camera
                    </button>
                )
            }
        </div>
    );
};

export default WebcamCaptureTest;

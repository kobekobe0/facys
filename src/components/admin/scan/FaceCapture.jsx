import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import MODEL_URL from '../../../constants/model';
import toast from 'react-hot-toast';

const FaceCapture = ({ start, handleSend, setStudent }) => {
    const videoRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const faceDetectedRef = useRef(false);
    const detectIntervalRef = useRef(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Load models once when the component mounts
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL) // Load expression model
                ]);
                setModelsLoaded(true);
                console.log("Models loaded successfully");
            } catch (error) {
                console.error("Error loading face-api models:", error);
                toast.error('Error loading face recognition models, reload the page.');
            }
        };
        loadModels();
    }, []);

    const setupCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing webcam: ", err);
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        if (start && modelsLoaded) {
            setupCamera();
            setIsDetecting(true);
        } else {
            stopCamera();
            setIsDetecting(false);
        }
        return () => stopCamera(); // Cleanup on unmount
    }, [start, modelsLoaded]);

    useEffect(() => {
        const startDetection = () => {
            if (detectIntervalRef.current) return; // Prevent duplicate intervals
    
            detectIntervalRef.current = setInterval(async () => {
                if (videoRef.current && !faceDetectedRef.current && isDetecting) {
                    const result = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceDescriptor()
                        .withFaceExpressions(); // Include expressions in detection
    
                    if (result) {
                        const isSmiling = result.expressions.happy > 0.7; // Adjust threshold as needed
    
                        if (isSmiling) {
                            faceDetectedRef.current = true;
                            setMessage(""); // Clear message if smiling
                            console.log("Face detected with smile, starting 5-second check...");
    
                            // Pause detection temporarily
                            clearInterval(detectIntervalRef.current);
                            detectIntervalRef.current = null;
    
                            const confirmResult = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                                .withFaceLandmarks()
                                .withFaceDescriptor()
                                .withFaceExpressions(); // Check expression again
    
                            if (confirmResult && confirmResult.expressions.happy > 0.7) {
                                console.log("Face confirmed with smile. Sending face descriptors.");
                                handleSend(confirmResult.descriptor);
                            } else {
                                console.log("Smile changed, resetting.");
                            }
    
                            // Reset face detection and resume interval
                            faceDetectedRef.current = false;
                            startDetection(); // Restart detection after confirmation check
                        } else {
                            setMessage("Please smile"); // Show smile prompt if not smiling
                        }
                    } else {
                        setMessage("")
                    }
                }
            }, 2000); // Detect every 3000ms
        };
    
        if (isDetecting) {
            startDetection();
        }
    
        return () => {
            if (detectIntervalRef.current) {
                clearInterval(detectIntervalRef.current);
                detectIntervalRef.current = null; // Ensure interval is fully cleared
            }
        };
    }, [isDetecting]);

    return (
        <div className="relative">
            {message && (
                <p className="absolute inset-0 flex margin-auto w-full items-center justify-center text-white text-xl py-2 font-semibold bg-red-600 bg-opacity-75">
                    {message}
                </p>
            )}
            <video ref={videoRef} autoPlay style={{ width: '100%' }} />

        </div>

    );
};

export default FaceCapture;

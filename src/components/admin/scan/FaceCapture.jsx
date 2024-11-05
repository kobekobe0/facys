import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import MODEL_URL from '../../../constants/model';
import toast from 'react-hot-toast';

const FaceCapture = ({ start, handleSend }) => {
    const videoRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const faceDetectedRef = useRef(false);
    const detectIntervalRef = useRef(null);

    useEffect(() => {
        // Load models once when the component mounts
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
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
            // Start the camera and detection if start is true and models are loaded
            setupCamera();
            setIsDetecting(true);
        } else {
            // Stop the camera and detection if start is false
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
                        .withFaceDescriptor();
    
                    if (result) {
                        faceDetectedRef.current = true;
                        console.log("Face detected, starting 5-second check...");
    
                        // Pause detection temporarily
                        clearInterval(detectIntervalRef.current);
                        detectIntervalRef.current = null; // Clear interval reference
    
                        const confirmResult = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                            .withFaceLandmarks()
                            .withFaceDescriptor();
    
                        if (confirmResult) {
                            console.log("Face confirmed for 5 seconds. Sending face descriptors.");
                            handleSend(confirmResult.descriptor);
                        } else {
                            console.log("Face changed, resetting.");
                        }
    
                        // Reset face detection and resume interval
                        faceDetectedRef.current = false;
                        startDetection(); // Restart detection after confirmation check
                    }
                }
            }, 3000); // Detect every 3000ms
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
        <div>
            <video ref={videoRef} autoPlay style={{ width: '100%' }} />
        </div>
    );
};

export default FaceCapture;

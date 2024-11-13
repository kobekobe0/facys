import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import MODEL_URL from '../../../constants/model';
import toast from 'react-hot-toast';

const VisitorFaceCapture = ({ start, setStart, visitorFaceData, visitorFaceData2, visitorFaceData3, setVisitorFaceData, setVisitorFaceData2, setVisitorFaceData3, setScreenshot }) => {
    const videoRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
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
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
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
        return () => stopCamera();
    }, [start, modelsLoaded]);

    const captureFace = async () => {
        if (videoRef.current) {
            const result = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (result) {
                const descriptor = result.descriptor;

                if (!visitorFaceData) {
                    // First capture
                    setVisitorFaceData(descriptor);
                    setScreenshot(await takeScreenshot());
                    console.log("First face data captured.");
                } else if (!visitorFaceData2) {

                        setVisitorFaceData2(descriptor);
                        setScreenshot(await takeScreenshot());
                        console.log("Second face data captured.");
                    
                } else if (!visitorFaceData3) {

                        setVisitorFaceData3(descriptor);
                        setScreenshot(await takeScreenshot());
                        console.log("Third face data captured.");
                        setStart(false); // Stop after third capture
                    
                }
            } else {
                toast.error("No face detected. Please ensure your face is visible in the frame.");
            }
        }
    };

    const compareDescriptors = (descriptor1, descriptor2) => {
        const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
        return distance < 0.5; // Adjust threshold as needed
    };

    const takeScreenshot = async () => {
        const canvas = faceapi.createCanvasFromMedia(videoRef.current);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return new Promise((resolve) => canvas.toBlob(blob => resolve(blob), 'image/png'));
    };

    useEffect(() => {
        const detectFace = async () => {
            if (videoRef.current && isDetecting) {
                const result = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions());
                setFaceDetected(!!result);
                setMessage(result ? "" : "No face detected");
            }
        };

        if (isDetecting) {
            const interval = setInterval(detectFace, 2000);
            return () => clearInterval(interval);
        }
    }, [isDetecting]);

    return (
        <div className="relative">
            {message && (
                <p className="absolute inset-0 flex items-center justify-center text-white text-xl py-2 font-semibold bg-red-600 bg-opacity-75">
                    {message}
                </p>
            )}
            <video ref={videoRef} autoPlay style={{ width: '100%' }} />
            {faceDetected && (
                <button
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white border-2 border-red-500 text-white px-4 py-2 rounded-full h-16 w-16"
                    onClick={captureFace}
                >
                    .
                </button>
            )}
        </div>
    );
};

export default VisitorFaceCapture;

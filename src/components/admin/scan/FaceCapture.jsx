import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceCapture = ({ start, handleSend }) => {
    const videoRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const faceDetectedRef = useRef(false); // Tracks if a face is being processed
    const detectIntervalRef = useRef(null);

    // Load face-api.js models
    const loadModels = async () => {
        try {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models')
            ]);
            setModelsLoaded(true);
            console.log("Models loaded successfully");
        } catch (error) {
            console.error("Error loading face-api models:", error);
        }
    };

    // Set up the webcam video stream
    useEffect(() => {
        const setupCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
                videoRef.current.srcObject = stream;
            } catch (err) {
                console.error("Error accessing webcam: ", err);
            }
        };

        loadModels();
        setupCamera();
    }, []);

    // Start face detection
    useEffect(() => {
        if (start && modelsLoaded) {
            detectIntervalRef.current = setInterval(async () => {
                if (videoRef.current && !faceDetectedRef.current) {
                    const result = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                        .withFaceLandmarks()
                        .withFaceDescriptor();

                    if (result) {
                        faceDetectedRef.current = true;
                        console.log("Face detected, starting 2-second check...");

                        // Wait for 2 seconds and confirm the same face is detected
                        setTimeout(async () => {
                            const confirmResult = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                                .withFaceLandmarks()
                                .withFaceDescriptor();

                            if (confirmResult) {
                                console.log("Face confirmed for 2 seconds. Sending face descriptors.");
                                handleSend(confirmResult.descriptor);

                                // After sending, reset face detection so it can detect the next face
                                faceDetectedRef.current = false;
                            } else {
                                console.log("Face changed, resetting.");
                                faceDetectedRef.current = false;
                            }
                        }, 2000);
                    }
                }
            }, 200); // Continuously detect every 200ms
        }

        return () => {
            if (detectIntervalRef.current) {
                clearInterval(detectIntervalRef.current);
            }
            const stream = videoRef.current?.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop()); // Stop video stream
            }
        };
    }, [start, modelsLoaded]);

    return (
        <div>
            <video ref={videoRef} autoPlay style={{ width: '100%' }} />
        </div>
    );
};

export default FaceCapture;

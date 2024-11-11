import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import MODEL_URL from '../../../constants/model';

const CaptureUpdate = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const timerRef = useRef(null); // Ref for 3-second timer
    const intervalIdRef = useRef(null); // Ref for interval ID
    const [confidence, setConfidence] = useState(null);
    const [captured, setCaptured] = useState(false);
    const [start, setStart] = useState(false);
    const [screenshot, setScreenshot] = useState(null); // State for screenshot
    const [faceData, setFaceData] = useState(null); // State for face data

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

    // Set up video stream
    useEffect(() => {
        if (!start) return;

        const getVideo = async () => {
            await loadModels();
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: 640,
                        height: 480,
                    },
                    audio: false,
                });
                videoRef.current.srcObject = stream;
            } catch (err) {
                console.error("Error accessing webcam: ", err);
            }
        };

        if (!captured) {
            getVideo();
        }

        // Start detection every 200ms
        intervalIdRef.current = setInterval(() => {
            if (!captured) {
                detectFace();
            }
        }, 200);

        return () => {
            cleanup();
        };
    }, [start]);

    // Cleanup process after capturing face data
    const cleanup = () => {
        clearInterval(intervalIdRef.current);
        clearTimeout(timerRef.current); // Clear the timer if set
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        intervalIdRef.current = null;
        timerRef.current = null;
    };

    // Capture the screenshot from the video
    const capture = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (video.readyState === 4) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageSrc = canvas.toDataURL('image/jpeg');
            setScreenshot(imageSrc); // Set the screenshot

            setCaptured(true); // Mark as captured

            // Convert imageSrc to a Blob
            const blob = await fetch(imageSrc).then(r => r.blob());

            // Create a new image element
            const img = new Image();
            img.src = URL.createObjectURL(blob);

            // Wait for the image to load
            img.onload = async () => {
                // Extract face embeddings after the image is loaded
                const result = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

                // Set face data and log it
                console.log("Face data captured: ", result?.descriptor);
                setFaceData(result?.descriptor);

                // Clean up after setting face data
                cleanup();

                // Release the object URL
                URL.revokeObjectURL(img.src);
            };
        } else {
            console.error("Video is not ready for capture.");
        }
    };

    // Detect face and start the 3-second timer
    const detectFace = async () => {
        if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
            const detections = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();
    
            if (detections) {
                setConfidence(detections.detection.score.toFixed(2));
    
                if (detections.detection.score >= 0.6) {
                    // Start a 3-second timer if not already started
                    if (!timerRef.current) {
                        timerRef.current = setTimeout(() => {
                            capture(); // Capture the image after 3 seconds of continuous detection
                        }, 1500);
                    }
                } else {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                    setConfidence(null);
                }

            } else {
                // No face detected, reset timer
                console.log("No face detected, resetting timer");
                clearTimeout(timerRef.current);
                timerRef.current = null;
                setConfidence(null);
            }
        }
    };

    // Retry function to reset face data and screenshot
    const retry = () => {
        cleanup(); // Ensure the video stream and detection loop are stopped

        // Reset state variables
        setFaceData(null);
        setScreenshot(null);
        setCaptured(false);
        setConfidence(null);
        setStart(false);

        // Restart face detection after cleanup
        setTimeout(() => setStart(true), 100); // Restart face detection after a short delay
    };

    return (
        <div className="flex flex-col justify-center items-center w-full overflow-y-scroll">
            <div className="relative w-full max-w-[320px] h-[568px] overflow-hidden">
                {screenshot ? (
                    <img src={screenshot} alt="Screenshot" className="absolute top-0 left-0 w-full h-full object-cover shadow-lg" />
                ) : (
                    <video
                        ref={videoRef}
                        playsInline
                        autoPlay
                        className="absolute top-0 left-0 w-full h-full object-cover shadow-lg"
                    />
                )}
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* Circular border for face detection */}
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-4 border-dashed ${confidence >= 0.6 ? 'border-green-600' : 'border-white'} transition-all ease-in-out rounded-full pointer-events-none z-20`} />
            </div>

            {!start && (
                <div className='flex flex-col gap-4 items-center'>
                    <button className='bg-red-600 text-xs text-white rounded-md p-2' onClick={() => setStart(true)}>Start Face Detection</button>
                </div>
            )}

            {captured && (
                <div className='mt-4 flex flex-col items-center gap-2'>
                    <p className='text-center text-green-600'>Face Captured Successfully</p>
                    <p className='text-center text-gray-500'>Confidence: {confidence}</p>
                    <button className='bg-blue-600 text-xs text-white rounded-md p-2' onClick={retry}>Retry</button>
                </div>
            )}
        </div>
    );
};

export default CaptureUpdate;

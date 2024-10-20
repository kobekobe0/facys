import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import MODEL_URL from '../../constants/model';

const WebcamCapture = ({ setFaceData, next, back, setScreenshot, screenshot }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [confidence, setConfidence] = useState(null);
    const [isSmiling, setIsSmiling] = useState(false);
    const phaseRef = useRef(1);
    const [captured, setCaptured] = useState(false);
    const [nonSmilingBuffer, setNonSmilingBuffer] = useState(false);
    const intervalIdRef = useRef(null); // Ref for interval ID
    const [start, setStart] = useState(false);

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

    // Unload face-api.js models
    const unloadModels = () => {
        faceapi.nets.tinyFaceDetector.dispose();
        faceapi.nets.faceLandmark68Net.dispose();
        faceapi.nets.faceExpressionNet.dispose();
        faceapi.nets.faceRecognitionNet.dispose();
        faceapi.nets.ssdMobilenetv1.dispose();
    };

    // Set up video stream
    useEffect(() => {
        if(!start) return;
        const getVideo = async () => {
            await loadModels();
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        facingMode: 'user', 
                        width: 640, // Reduce resolution to 640x480 for mobile devices
                        height: 480,
                        orientation: 'portrait'
                    },
                    audio: false,
                });
                videoRef.current.srcObject = stream;
            } catch (err) {
                if (err.name === 'NotReadableError') {
                    console.error(err);
                } else {
                    console.error("Error accessing webcam: ", err);
                }
            }
        };
        if(!captured) {
            getVideo();
        }

        // Start detection
        intervalIdRef.current = setInterval(() => {
            if (!captured) {
                detectFace();
            }
        }, 200);

        return () => {
            clearInterval(intervalIdRef.current); // Clean up interval on unmount
            const stream = videoRef.current?.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop()); // Stop video stream
            }
        };
    }, [start]);

    // Cleanup process after capturing face data
    const cleanup = () => {
        clearInterval(intervalIdRef.current); // Stop face detection
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop()); // Stop video stream
        }
        unloadModels(); // Unload models
    };

    // Capture the screenshot from the video
    const capture = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
    
        // Ensure the video has enough data
        if (video.readyState === 4) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
    
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
            const imageSrc = canvas.toDataURL('image/jpeg');
            if (!screenshot) {
                setScreenshot(imageSrc);
            }
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
    
                // Set face data and move to the next step
                console.log("Face data captured: ", result.descriptor);
                setFaceData(result.descriptor);
                next();
    
                // Clean up after setting face data
                cleanup();
    
                // Release the object URL
                URL.revokeObjectURL(img.src);
            };
        } else {
            console.error("Video is not ready for capture.");
        }
    };

    // Detect face and manage phase transitions
    const detectFace = async () => {
        if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
            const detections = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (detections) {
                const confidenceScore = detections.detection.score.toFixed(2);
                const smileValue = detections.expressions.surprised;

                setConfidence(confidenceScore);
                setIsSmiling(smileValue > 0.5);

                if (phaseRef.current === 1) {
                    // Detect a smiling face with at least 70% confidence
                    if (detections.detection.score >= 0.7 && smileValue > 0.5) {
                        console.log("Phase 1 completed: Smiling face detected.");
                        phaseRef.current = 2; // Move to Phase 2 (detect not smiling)
                    }
                } else if (phaseRef.current === 2 && !nonSmilingBuffer) {
                    // Buffer the detection of a non-smiling face to avoid rapid transitions
                    if (detections.detection.score >= 0.7 && smileValue < 0.3) {
                        console.log("Non-smiling detected, entering buffer period...");
                        setNonSmilingBuffer(true); // Start the buffer
                        capture(); // Capture the image
                    }
                }
            } else {
                // alert user to face detection failure and abort all processes
                alert("Anomaly detected: Face detection failed. Please try again.");
                cleanup(); // Stop everything related to face capture
                back();
                setConfidence(null);
                setIsSmiling(false);
            }
        }
    };

    // Determine what the current instruction should be based on the phase
    const getInstruction = () => {
        if (phaseRef.current === 1) {
            return 'Open your mouth wide 😮';
        } else if (phaseRef.current === 2) {
            return 'Close your mouth and look neutral 😐';
        }
        return '';
    };
    return (
        <div className="flex flex-col justify-center items-center w-full overflow-y-scroll">
            <div className='flex justify-start gap-4 items-center w-full my-8'>
                <div className='flex gap-2'>
                    <button className='text-3xl' onClick={back} >◁</button>
                </div>
                <div>
                    <h2 className='text-xl font-semibold text-gray-600'>
                        <span className='text-lg font-normal'>Step 3:</span> Face Registration
                    </h2>
                    <p className='text-sm text-gray-500'>Face to a well-lit area</p>
                </div>


            </div>

            <div className="relative w-full max-w-[320px] h-[568px] overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    className="absolute top-0 left-0 w-full h-full object-cover shadow-lg"
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* Dimmed overlay */}
                <div className="absolute inset-0 bg-black opacity-50 z-10 pointer-events-none"></div>

                {/* Circular border for face detection */}
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border-4 border-dashed ${confidence >= 0.7 ? 'border-green-600' : 'border-white'} transition-all ease-in-out rounded-full pointer-events-none z-20`} />

                {
                    start && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-30">
                            <p className="text-lg text-gray-700 font-semibold">{getInstruction()}</p>
                        </div>
                    )
                }

            </div>

            {
                !start && (
                    <div className='flex flex-col gap-4 items-center'>
                        <button className='bg-red-600 text-xs text-white rounded-md p-2' onClick={() => setStart(true)}>Start Face Detection</button>
                    </div>
                )
            }
        </div>
    );
};

export default WebcamCapture;

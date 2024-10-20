import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const BlinkDetector = () => {
  const videoRef = useRef(null);
  const [blinkCount, setBlinkCount] = useState(0);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]);
      startVideo();
    };

    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      detectBlinks();
    };

    const detectBlinks = () => {
      const irisC = [];
      let nowBlinking = false;

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        
        if (detections.length > 0) {
          const landmarks = detections[0].landmarks;
          const landmarkPositions = landmarks.positions;

          const leftEyeY = landmarkPositions[38].y; // Left eye lower
          const rightEyeY = landmarkPositions[42].y; // Right eye lower
          const averageY = (landmarkPositions[41].y + landmarkPositions[37].y) / 2; // Average Y of top and bottom of the eyes

          // Calculate iris color intensity
          const currentIrisC = averageY;
          irisC.push(currentIrisC);
          if (irisC.length > 100) {
            irisC.shift();
          }

          const meanIrisC = irisC.reduce((sum, element) => sum + element, 0) / irisC.length;
          const vThreshold = 1.5;

          if (irisC.length === 100) {
            if (!nowBlinking) {
              if (currentIrisC <= meanIrisC * vThreshold) {
                nowBlinking = true;
                setBlinkCount((prevCount) => prevCount + 1);
                console.log(`Blink detected! Total Blinks: ${blinkCount + 1}`);
              }
            } else {
              if (currentIrisC > meanIrisC * vThreshold) {
                nowBlinking = false;
              }
            }
          }
        }
      }, 33);
    };

    loadModels();

    return () => {
      // Cleanup: Stop video stream when component unmounts
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [blinkCount]);

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
      <h2>Total Blinks: {blinkCount}</h2>
    </div>
  );
};

export default BlinkDetector;

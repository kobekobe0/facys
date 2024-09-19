import React from "react";
import Webcam from "react-webcam";

const videoConstraints = {
    width: 150,
    height: 150,
    facingMode: "user"
};

const WebcamCapture = ({ setPhoto, onClose }) => {
    const webcamRef = React.useRef(null);

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        const base64Image = imageSrc.split(';base64,')[1];
        const blob = base64ToBlob(base64Image);
        const file = new File([blob], 'photo.jpg', {type: 'image/jpeg', lastModified: Date.now()});
        //download file
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'photo.jpg';
        // a.click();
        // window.URL.revokeObjectURL(url);

        setPhoto(file);
        onClose();
    }, [webcamRef, setPhoto]); // Add setPhoto to the dependency array

    const base64ToBlob = (base64) => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], {type: 'image/jpeg'});
    };
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <Webcam
                            audio={false}
                            height={150}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={150}
                            videoConstraints={videoConstraints}
                        />
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" onClick={capture} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Capture photo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebcamCapture;
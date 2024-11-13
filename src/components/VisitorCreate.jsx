import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import React from 'react'
import API_URL from "../constants/api";
import debounce from "../helper/debounce";
import abbreviate from "../helper/abbreviate";
import { Link, useNavigate } from "react-router-dom";
import FaceCapture from "./admin/scan/FaceCapture";
import VisitorFaceCapture from "./admin/scan/VisitorFaceCapture";
import toast from "react-hot-toast";
function VisitorCreate() {
    const navigate = useNavigate()
    const [start, setStart] = useState(false)

    const [visitorDetails, setVisitorDetails] = useState({
        name: "",
        address: "",
        contactNumber: "",
        email: "",
        dateOfBirth: "",
        organization: "",
    })

    const handleDetailsChange = (e) => {
        setVisitorDetails({
            ...visitorDetails,
            [e.target.name]: e.target.value
        })
    }

    const [visitorFaceData, setVisitorFaceData] = useState(null);
    const [visitorFaceData2, setVisitorFaceData2] = useState(null);
    const [visitorFaceData3, setVisitorFaceData3] = useState(null);
    const [screenshot, setScreenshot] = useState(null);

    const restart = () => {
        setVisitorFaceData(null);
        setVisitorFaceData2(null);
        setVisitorFaceData3(null);
        setScreenshot(null);
        setStart(false)
    }

    const handleSubmit = async () => {
        console.log("Main Descriptor:", visitorFaceData);
        console.log("Support Descriptor 1:", visitorFaceData2);
        console.log("Support Descriptor 2:", visitorFaceData3);
  
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (
            !visitorDetails.name ||
            !visitorDetails.address ||
            !visitorDetails.contactNumber ||
            !visitorDetails.dateOfBirth
        ) {
            return toast.error("Please fill in all fields");
        }
        if (!emailRegex.test(visitorDetails.email)) return toast.error("Invalid email address");

        if (!visitorFaceData || !visitorFaceData2 || !visitorFaceData3) {
            return toast.error("Please upload all required face images.");
        }
    
        toast.loading("Uploading data...");

        try {
            // Create a new FormData object
            const formData = new FormData();

            formData.append("name", visitorDetails.name);
            formData.append("address", visitorDetails.address);
            formData.append("contactNumber", visitorDetails.contactNumber);
            formData.append("email", visitorDetails.email);
            formData.append("dateOfBirth", visitorDetails.dateOfBirth);
            formData.append("organization", visitorDetails.organization);
    
            // Prepare face data structure
            const faceDataPayload = {
                mainDescriptor: Array.from(visitorFaceData),            // Main descriptor as array
                supportDescriptor1: Array.from(visitorFaceData2),       // First support descriptor as array
                supportDescriptor2: Array.from(visitorFaceData3),       // Second support descriptor as array
            };
            
            // Append faceData as a JSON string
            formData.append("faceData", JSON.stringify(faceDataPayload));
    
            if (screenshot) {
                formData.append("image", screenshot, "screenshot.jpg");
            }
            // Send the FormData with Axios
            const response = await axios.post(`${API_URL}visitor/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            console.log(response.data);
            toast.dismiss();
            toast.success("Registration successful.");
            navigate('/');
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || "Registration failed.");
            console.error(error);
        }
    };

    return (
        <div className='flex p-8 flex-col h-full'>
            <div className="flex items-center justify-between">
                <h2 className="font-medium ">Register Visitor</h2>
                <button onClick={restart} className="bg-red-500 text-white px-4 py-1 rounded">Restart</button>
            </div>
            <div className='flex justify-between items-start mt-8 gap-4 w-full h-full'>
                {
                    !visitorFaceData3 && (
                        <div className='w-2/3 p-4 h-full rounded'>
                            {
                                !start && (
                                <button onClick={() => setStart(!start)} className='p-2 w-full flex items-center flex-col gap-4 justify-center h-full text-red-500 transition rounded-md border border-dashed border-red-400 hover:bg-red-500/65 hover:text-white'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8em" height="8em" viewBox="0 0 24 24"><path fill="currentColor" d="M9 11.75A1.25 1.25 0 0 0 7.75 13A1.25 1.25 0 0 0 9 14.25A1.25 1.25 0 0 0 10.25 13A1.25 1.25 0 0 0 9 11.75m6 0A1.25 1.25 0 0 0 13.75 13A1.25 1.25 0 0 0 15 14.25A1.25 1.25 0 0 0 16.25 13A1.25 1.25 0 0 0 15 11.75M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a4 4 0 0 1 0-.86a10.05 10.05 0 0 0 5.26-5.37A9.99 9.99 0 0 0 17.42 10c.76 0 1.51-.09 2.25-.26c1.25 4.26-1.17 8.69-5.41 9.93c-.76.22-1.5.33-2.26.33M0 2a2 2 0 0 1 2-2h4v2H2v4H0zm24 20a2 2 0 0 1-2 2h-4v-2h4v-4h2zM2 24a2 2 0 0 1-2-2v-4h2v4h4v2zM22 0a2 2 0 0 1 2 2v4h-2V2h-4V0z"/></svg>
                                    <h2 className='text-xl font-medium'>Start Face Recognition</h2>
                                </button>
                                )
                            }
                            {
                                start && (
                                    <VisitorFaceCapture
                                    visitorFaceData2={visitorFaceData2}
                                    visitorFaceData3={visitorFaceData3}
                                    start={start} 
                                    setStart={setStart}
                                    visitorFaceData={visitorFaceData} 
                                    setVisitorFaceData={setVisitorFaceData} 
                                    setVisitorFaceData2={setVisitorFaceData2} 
                                    setVisitorFaceData3={setVisitorFaceData3} 
                                    setScreenshot={setScreenshot} 
                                    /> 
                                )
                            }
                        </div>
                    )
                }

                <div className='w-1/3 h-fit flex flex-col gap-4'>
                    {
                        visitorFaceData3 && screenshot && (
                            <div className="flex items-center gap-2 w-full justify-start my-2">
                                <img className="w-[90%] rounded object-cover self-center" src={URL.createObjectURL(screenshot)} alt="" />
                            </div>
                        )
                    }
                    <h2 className='my-4 font-medium'>Visitor Details</h2>
                    <h2 className={`${visitorFaceData ? "text-red-500" : "text-gray-400"} flex gap-2`}>
                        <span className="font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"/></g></svg>    
                        </span>
                        First Image Captured
                    </h2>
                    <h2 className={`${visitorFaceData2 ? "text-red-500" : "text-gray-400"} flex gap-2`}>
                        <span className="font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"/></g></svg>    
                        </span>
                        Second Image Captured
                    </h2>
                    <h2 className={`${visitorFaceData3 ? "text-red-500" : "text-gray-400"} flex gap-2`}>
                        <span className="font-bold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"/></g></svg>    
                        </span>
                        Third Image Captured
                    </h2>
                </div>
                {
                    visitorFaceData3 && (
                        <div className='w-2/3 h-fit flex flex-col gap-4'>
                            <label>Name:</label>
                            <input type="text" name="name" onChange={handleDetailsChange} className="border border-gray-300 rounded p-2" placeholder="Name"/>

                            <label>Address:</label>
                            <input type="text" name="address" onChange={handleDetailsChange} className="border border-gray-300 rounded p-2" placeholder="Address"/>

                            <label>Contact Number:</label>
                            <input type="text" name="contactNumber" onChange={handleDetailsChange} className="border border-gray-300 rounded p-2" placeholder="Contact Number"/>

                            <label>Email:</label>
                            <input type="text" name="email" onChange={handleDetailsChange} className="border border-gray-300 rounded p-2" placeholder="Email"/>

                            <label>Date of Birth:</label>
                            <input type="date" name="dateOfBirth" onChange={handleDetailsChange} className="border border-gray-300 rounded p-2" placeholder="Date of Birth"/>

                            <label>Organization:</label>
                            <input type="text" name="organization" onChange={handleDetailsChange} className="border border-gray-300 rounded p-2" placeholder="Organization"/>

                            <button onClick={handleSubmit} className="p-2 w-full bg-red-500 text-white rounded">Create Visitor</button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default VisitorCreate
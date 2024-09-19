import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import API_URL from "../constants/api";

const UploadCOR = ({next, setStudentNumber, studentNumber, handleSubmit}) => {
    const handleNext = async () => {
        handleSubmit();
    }
    return(
        <div className="flex flex-1 bg-slate-100 items-center flex-col w-full h-fit overflow-y-scroll">
            <div className="flex flex-col w-screen p-8 xl:w-[50vw]">
                <div className="flex justify-center flex-col">
                    <h2 className="text-2xl text-gray-700 mb-4">
                        Reset Your <span className="text-red-800 font-semibold">Password</span>
                    </h2>
                    <p>Enter your student number</p>
                </div>
                
                <div className="flex justify-center flex-col mt-8">
                    <label className="text-sm mb-2">Student Number</label>
                    <input type="text" className="border border-gray-300 bg-gray-100 rounded-md p-2 mb-4" value={studentNumber} onChange={e=>setStudentNumber(e.target.value)}/>
                </div>
                
                <div className="w-full mt-12 flex gap-4">
                    <button onClick={handleNext} className="border-red-800 transition-all ease-in-out border bg-red-800 w-full hover:bg-red-950 text-white rounded-md px-4 py-2 text-lg">Next</button>
                </div>
            </div>
        </div>
    )
}


const DonePage = () => {
    return (
        <div className="flex flex-1 bg-slate-100 items-center flex-col w-full h-fit overflow-y-scroll">
            <div className="flex flex-col w-screen p-8 items-center">
                <div className="flex items-center justify-center w-fit h-fit rounded-full p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="185" height="185" viewBox="0 0 24 24"><path fill="#38ad55" d="M19 8q-1.25 0-2.125-.875T16 5t.875-2.125T19 2t2.125.875T22 5t-.875 2.125T19 8M2 20V4h12.1q-.1.5-.1 1t.1 1q.175.8.575 1.488T15.65 8.7L12 11L4 6v2l8 5l5.275-3.3q.425.15.85.225T19 10q.8 0 1.575-.25T22 9v11z"/></svg>
                </div>
                <div className="flex text-center justify-center items-center mt-4 flex-col mb-8">
                    <h2 className="text-2xl text-gray-700 mb-4">You've got a <span className="text-red-800 font-semibold">Mail!</span></h2>
                    <p>Please check your email to reset your password.</p>
                </div>
            </div>
        </div>
    )
}

const RegistrationPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [studentNumber, setStudentNumber] = useState('');
  
    const nextTab = () => {
      if (!animating) {
        setAnimating(true);
        setActiveTab((prev) => Math.min(prev + 1, 4));
      }
    };

    const handleAnimationEnd = () => {
      setAnimating(false);
    };

    const handleSubmit = async () => {
        toast.loading('Sending email...');
        await axios.post(`${API_URL}reset-password/create`, {studentNumber}).then(res => {
            console.log(res);
            toast.dismiss()
            toast.success('Email sent!');
            nextTab();
        }).catch(err => {
            console.log(err);
            toast.dismiss();
            toast.error(err.response.data.message);
        });

    }

  
    const tabs = [ 
      <UploadCOR key="upload" next={nextTab} setStudentNumber={setStudentNumber} studentNumber={studentNumber} handleSubmit={handleSubmit}/>,
      <DonePage key="done" />
    ];
  
    return (
      <div className="flex flex-1 bg-slate-100 items-center flex-col w-full h-[80vh] overflow-y-scroll relative">
        <div className="tabs-container relative w-full h-full">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`tab-content ${index === activeTab ? 'active' : 'inactive'} ${animating ? 'animating' : ''}`}
              onAnimationEnd={handleAnimationEnd}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
    );
};

const ResetPassword = () => {
    const navigate = useNavigate();
    const tempSignin = (e) => {
        e.preventDefault();
        console.log('Signing in...');
        navigate('/');
    }
    return (
        <main className="flex flex-col h-[100vh]">
            <Navbar/>
            <RegistrationPage/>
            <div className="flex-1 max-h-20 flex items-center justify-center bg-red-950 shadow-lg">
                <p className="text-white text-xs">© ScholarPass Team | 2024</p>
            </div>
        </main>
    );
}
export default ResetPassword;
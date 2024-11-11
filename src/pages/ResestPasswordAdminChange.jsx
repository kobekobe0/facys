import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import API_URL from "../constants/api";

const UploadCOR = ({next, setPassword, password, setConfirmPassword, confirmPassword, handleSubmit}) => {
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
                    <p>Input your desired password</p>
                </div>
                
                <div className="flex justify-center flex-col mt-8">
                    <label className="text-sm mb-2">Password</label>
                    <input type="password" className="border border-gray-300 bg-gray-100 rounded-md p-2 mb-4" value={password} onChange={e=>setPassword(e.target.value)}/>
                </div>
                <div className="flex justify-center flex-col mt-8">
                    <label className="text-sm mb-2">Confirm Password</label>
                    <input type="password" className="border border-gray-300 bg-gray-100 rounded-md p-2 mb-4" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/>
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
            <div className="flex items-center justify-center w-fit h-fit rounded-full p-6 bg-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="white" d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"/></g></svg>
                </div>
                <div className="flex text-center justify-center items-center mt-4 flex-col mb-8">
                    <h2 className="text-2xl text-gray-700 mb-4">All <span className="text-red-800 font-semibold">Done!</span></h2>
                    <p>Your password has been reset. Navigate to Login page to access your account.</p>
                </div>
            </div>
        </div>
    )
}

const ChangePasswordBody = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {id} = useParams();
  
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
        if(password.length < 8)return toast.error('Password must be at least 8 characters long');
        if(password !== confirmPassword)return toast.error('Passwords do not match');

        const data = {
            password: password,
        }

        try {
            const response = await axios.post(`${API_URL}reset-password/renew-admin/${id}`, data);

            nextTab();
        } catch (error) {
            console.log(error);
            toast.error('An error occured');
        }
    }

  
    const tabs = [ 
      <UploadCOR key="upload" next={nextTab} password={password} setConfirmPassword={setConfirmPassword} setPassword={setPassword} confirmPassword={confirmPassword} handleSubmit={handleSubmit}/>,
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

const ChangePasswordAdmin = () => {
    const navigate = useNavigate();
    return (
        <main className="flex flex-col h-[100vh]">
            <Navbar/>
            <ChangePasswordBody/>
            <div className="flex-1 max-h-20 flex items-center justify-center bg-red-950 shadow-lg">
                <p className="text-white text-xs">© Facys Team | 2024</p>
            </div>
        </main>
    );
}
export default ChangePasswordAdmin;
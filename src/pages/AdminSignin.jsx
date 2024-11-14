import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import API_URL from "../constants/api";
import useAuth from "../helper/useAuth";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const {isLoading} = useAuth(); // Protect the page based on user role


    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if(loading) return;
        if(!email || !password) {
            toast.error('Please fill in all fields.');
            return;
        }
        setLoading(true);
        toast.loading('Logging in...');
        try {
            const response = await axios.post(`${API_URL}admin/login`, {
                email,
                password
            });
            setLoading(false);
            toast.dismiss();
            toast.success('Login successful.');
            //set token to local storage
            localStorage.setItem('authToken', response.data.token);
            navigate('/student');
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.dismiss();
            toast.error('Invalid credentials. Please try again.');
        }
    }

    if(isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
                    <g stroke="black">
                        <circle cx="12" cy="12" r="9.5" fill="none" stroke-linecap="round" stroke-width="3">
                            <animate attributeName="stroke-dasharray" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0 150;42 150;42 150;42 150"/>
                            <animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.5s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0;-16;-59;-59"/>
                        </circle>
                        <animateTransform attributeName="transform" dur="2s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
                    </g>
                </svg>
            </div>
        );
    }

    return (
<div className="flex justify-center items-center min-h-[75vh] bg-gradient-to-r from-rose-400 to-red-500">
    <div className="flex flex-col w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
            <h2 className="text-2xl text-gray-700">
                Login to your <span className="text-red-800 font-semibold">Account</span>
            </h2>
            <p className="text-gray-600 mt-2">Enter your credentials below.</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
            <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                    type="text"
                    className="border border-gray-300 bg-gray-100 rounded-md p-2 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                    type="password"
                    className="border border-gray-300 bg-gray-100 rounded-md p-2 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
        </div>

        {/* Links */}
        <div className="flex flex-col space-y-4 mt-6 text-center">
            <Link to="/admin/forgot-password" className="text-red-800">
                <span className="text-gray-700">Forgot your password?</span> Reset here
            </Link>
        </div>

        {/* Button */}
        <div className="mt-8">
            <button 
                onClick={handleLogin} 
                className="w-full bg-red-800 hover:bg-red-900 transition-all text-white rounded-md py-2 text-lg"
            >
                Next
            </button>
        </div>
    </div>
</div>

    )
}

const AdminSignin = () => {
    const navigate = useNavigate();
    const tempSignin = (e) => {
        e.preventDefault();
        console.log('Signing in...');
        navigate('/');
    }
    return (
        <main className="flex flex-col h-[100vh]">
            <Navbar/>
            <LoginPage/>
        </main>
    );
}
export default AdminSignin;
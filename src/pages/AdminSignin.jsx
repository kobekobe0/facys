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
        <div className="flex flex-1 bg-slate-100 items-center flex-col w-full h-fit overflow-y-scroll">
            <div className="flex flex-col w-screen p-8 xl:w-[50vw]">
                <div className="flex justify-center flex-col">
                    <h2 className="text-2xl text-gray-700">
                    Login to your <span className="text-red-800 font-semibold">Account</span>
                    </h2>
                    <p>Enter your creadentials below.</p>
                </div>

                <div className="flex justify-center flex-col mt-12">
                    <label className="text-sm mb-2">Email</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="text-sm mb-2">Password</label>
                    <input
                        type="password"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex flex-col space-y-4">
                    <Link to="/admin/forgot-password" className="text-red-800"><span className="text-black">Forgot your password?</span> Reset here</Link>
                </div>

                <div className="w-full mt-8">
                    <button onClick={handleLogin} className="hover:bg-red-900 transition-all ease-in-out border  bg-red-800 w-full text-white rounded-md  px-4 py-2 text-lg">Next</button>
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
            <div className="flex-1 max-h-20 flex items-center justify-center bg-red-950 shadow-lg">
                <p className="text-white text-xs">© Facys Team | 2024</p>
            </div>
        </main>
    );
}
export default AdminSignin;
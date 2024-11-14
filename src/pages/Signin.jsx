import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import API_URL from "../constants/api";
import useAuth from "../helper/useAuth";

const LoginPage = () => {
    const [studentNumber, setStudentNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const {user} = useAuth();


    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if(loading) return;
        if(!studentNumber || !password) {
            toast.error('Please fill in all fields.');
            return;
        }
        setLoading(true);
        toast.loading('Logging in...');
        try {
            const response = await axios.post(`${API_URL}student/login`, {
                studentNumber,
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
                        <label className="block text-sm mb-1">Student Number</label>
                        <input
                            type="text"
                            className="border border-gray-300 bg-gray-100 rounded-md p-2 w-full"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
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
                    <Link to="/register" className="text-red-800">
                        <span className="text-gray-700">Don't have an account?</span> Register here
                    </Link>
                    <Link to="/forgot-password" className="text-red-800">
                        <span className="text-gray-700">Forgot your password?</span> Reset here
                    </Link>
                    <Link to="/admin-signin" className="text-red-800">
                        <span className="text-gray-700">Access admin dashboard</span> Click here
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

const Signin = () => {
    const navigate = useNavigate();
    return (
        <main className="flex flex-col h-[100vh]">
            <Navbar/>
            <LoginPage/>
        </main>
    );
}
export default Signin;
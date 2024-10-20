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
        <div className="flex flex-1 bg-slate-100 items-center flex-col w-full h-fit overflow-y-scroll">
            <div className="flex flex-col w-screen p-8 xl:w-[50vw]">
                <div className="flex justify-center flex-col">
                    <h2 className="text-2xl text-gray-700">
                    Login to your <span className="text-red-800 font-semibold">Account</span>
                    </h2>
                    <p>Enter your creadentials below.</p>
                </div>

                <div className="flex justify-center flex-col mt-12">
                    <label className="text-sm mb-2">Student Number</label>
                    <input
                        type="text"
                        className="border border-gray-300 bg-gray-100 rounded-md p-2 mb-4"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
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
                    <Link to="/register" className="text-red-800"><span className="text-black">Don't have an account?</span> Register here</Link>
                    <Link to="/forgot-password" className="text-red-800"><span className="text-black">Forgot your password?</span> Reset here</Link>
                    <Link to="/admin-signin" className="text-red-800"><span className="text-black">Access admin dashboard</span> Click here</Link>
                </div>

                <div className="w-full mt-8">
                    <button onClick={handleLogin} className="hover:bg-red-900 transition-all ease-in-out border  bg-red-800 w-full text-white rounded-md  px-4 py-2 text-lg">Next</button>
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
            <div className="flex-1 max-h-20 flex items-center justify-center bg-red-950 shadow-lg">
                <p className="text-white text-xs">© Facys Team | 2024</p>
            </div>
        </main>
    );
}
export default Signin;
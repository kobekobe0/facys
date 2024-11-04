import React, { useEffect, useState } from 'react';
import StudentNavbar from '../components/student/StudentNavbar';
import axios from 'axios';
import API_URL from '../constants/api';
import useUserStore from '../store/user.store';
import useAuth from '../helper/useAuth';

const StudentDashboard = () => {
    const {isLoading} = useAuth();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [limit, setLimit] = useState(50); // Set initial limit value

    const [logs, setLogs] = useState([]);
    const [logNumber, setLogNumber] = useState(0);

    const { user, fetchUser, loading, error, logout } = useUserStore();

    useEffect(()=> {
        fetchUser();
    },[fetchUser])

    const fetchGateLogs = async () => {
        try{
            const query = `?startDate=${startDate}&endDate=${endDate}&limit=${limit}`;
            const res = await axios.get(`${API_URL}log/student/${user._id}${query}`);
            console.log(res.data    )
            setLogs(res.data.docs)
        } catch (err){
            console.log(err);
        }
    }
    const fetchNumber = async () => {
        try{
            const res = await axios.get(`${API_URL}log/number/${user._id}`);
            console.log(res.data    )
            setLogNumber(res.data.logs)
        } catch (err){
            console.log(err);
        }
    }

    useEffect(()=> {
        fetchNumber()
    },[])

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            {/* Navbar */}
            <StudentNavbar />

            {/* Main Content */}
            <div className="w-full max-w-[600px] justify-center mt-8 space-y-6">
                {/* Entry Count Card */}
                <div className="bg-gradient-to-r from-red-50 via-white to-red-100 p-6 rounded-lg shadow-md flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-red-700">{logNumber}</h2>
                        <p className="text-gray-500">Total Gate Entries</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" className="text-red-600">
                        <path fill="currentColor" d="M17 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2"/>
                        <path fill="currentColor" fillRule="evenodd" d="M7 1.75a.75.75 0 0 1 .75.75v.763c.662-.013 1.391-.013 2.193-.013h4.113c.803 0 1.532 0 2.194.013V2.5a.75.75 0 0 1 1.5 0v.827q.39.03.739.076c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433v2.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.945c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-2.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238q.35-.046.739-.076V2.5A.75.75 0 0 1 7 1.75M5.71 4.89c-1.005.135-1.585.389-2.008.812S3.025 6.705 2.89 7.71q-.034.255-.058.539h18.336q-.024-.284-.058-.54c-.135-1.005-.389-1.585-.812-2.008s-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14M2.75 12c0-.854 0-1.597.013-2.25h18.474c.013.653.013 1.396.013 2.25v2c0 1.907-.002 3.262-.14 4.29c-.135 1.005-.389 1.585-.812 2.008s-1.003.677-2.009.812c-1.027.138-2.382.14-4.289.14h-4c-1.907 0-3.261-.002-4.29-.14c-1.005-.135-1.585-.389-2.008-.812s-.677-1.003-.812-2.009c-.138-1.027-.14-2.382-.14-4.289z" clipRule="evenodd"/>
                    </svg>
                </div>

                {/* Date Filter & Limit Selection */}
                {
                    logs.length < 1 && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter Gate Logs</h2>
                            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                <div className="flex items-center space-x-2 w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M16 2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V2h-2zM5 9h14V6H5v3zm0 11V11h14v9H5z" />
                                    </svg>
                                    <div className="w-full">
                                        <p className="text-xs text-gray-400">From Date</p>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full bg-transparent focus:outline-none text-sm text-gray-700 font-semibold"
                                            placeholder="dd/mm/yyyy"
                                        />
                                    </div>
                                </div>
        
                                <div className="flex items-center space-x-2 w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M16 2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V2h-2zM5 9h14V6H5v3zm0 11V11h14v9H5z" />
                                    </svg>
                                    <div className="w-full">
                                        <p className="text-xs text-gray-400">To Date</p>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full bg-transparent focus:outline-none text-sm text-gray-700 font-semibold"
                                            placeholder="dd/mm/yyyy"
                                        />
                                    </div>
                                </div>
                            </div>
        
                            {/* Limit Selection */}
                            <div className="flex items-center mt-4">
                                <label className="text-gray-700 font-semibold mr-2">Limit:</label>
                                <select
                                    value={limit}
                                    onChange={(e) => setLimit(Number(e.target.value))}
                                    className="p-2 bg-gray-50 border w-full border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-red-500 text-sm"
                                >
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                    <option value={250}>250</option>
                                </select>
                            </div>
        
                            <button onClick={fetchGateLogs} className="mt-4 w-full hover:bg-red-500 transition bg-red-600 text-white py-2 rounded-full shadow-md font-semibold">Go</button>
                        </div>
                    )
                }

                {
                    logs.length > 0 && (
                        <div>
                            <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-700">Showing {logs.length} logs</h2>
                                <button onClick={() => setLogs([])} className="text-sm text-red-600 font-semibold">Clear Logs</button>
                            </div>
                        </div>
                    )
                }

{
    logs.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Gate Logs</h2>
            <div className="flex flex-col space-y-6">
                {logs.map((log) => (
                    <div key={log._id} className="flex gap-4 items-center justify-start p-4 bg-gray-50 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-4">
                            <img
                                src={user?.pfp || 'https://via.placeholder.com/40'}
                                alt="Student Profile"
                                className="w-10 h-10 rounded-full"
                            />
                        </div>
                        
                        {/* Right Side: Time In and Time Out */}
                        <div className="text-left">
                            <p className="text-xs font-medium text-gray-700">Time In</p>
                            <p className="text-xs text-gray-500">
                                {log.timeIn ? new Date(log.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'short', day: '2-digit', hour12: true }) : "N/A"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}


            </div>
        </div>
    );
};

export default StudentDashboard;

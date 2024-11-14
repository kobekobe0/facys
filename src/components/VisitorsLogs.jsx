import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import React from 'react'
import API_URL from "../constants/api";
import debounce from "../helper/debounce";
import printVisitorLogs from "../helper/printVisitorLog";

function VisitorLogs() {
    const [logs, setLogs] = useState([]);
    const [name, setName] = useState('');
    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const fetchLogs = async () => {
        try {
            const params = {};
    
            if (name) params.name = name; 
            if (limit) params.limit = limit;
            if (page) params.page = page;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
    
            const res = await axios.get(`${API_URL}visitor/logs`, { params });
    
            console.log(res.data.docs);
            setLogs(res.data.docs);
        } catch (err) {
            console.error(err);
        }
    }

    const debouncedSetQuery = useCallback(
        debounce((newQuery) => {
            setName(newQuery); 
        }, 300),
        []
    );

    const handleChange = (e) => {
        const value = e.target.value;
        debouncedSetQuery(value);
    };

    useEffect(() => {
        fetchLogs();
    }, [name, limit, page, startDate, endDate])

    useEffect(() => {
        fetchLogs();
    }, [])  

    const handlePrint = () => {
        console.log(logs)
        printVisitorLogs(logs, startDate, endDate);
    }

    return (
        <div className='flex p-8 flex-col h-full'>
            <div className='w-full justify-between flex items-center'>
                <h1 className='text-xl font-semibold'>Visitor Logs</h1>
            </div>
            <div className="flex items-center text-gray-700 shadow-md rounded p-4 my-4 bg-white justify-between">
                <div className="flex flex-wrap gap-4 items-center bg-gray-50 rounded-lg shadow-sm">
                    <div className="flex flex-col">
                        <label htmlFor="start-date" className="text-xs font-medium text-gray-700">Start Date</label>
                        <input 
                        type="date" 
                        id="start-date" 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="end-date" className="text-xs font-medium text-gray-700">End Date</label>
                        <input 
                        type="date" 
                        id="end-date" 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="limit" className="text-xs font-medium text-gray-700">Limit</label>
                        <select 
                        id="limit" 
                        onChange={(e) => setLimit(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="500">500</option>
                        <option value="1000">1000</option>
                        </select>
                    </div>

                    <div className="flex flex-col items-start">
                        <label htmlFor="" className="text-xs font-medium my-1 text-gray-700">Print</label>
                        <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-1 rounded">Print</button>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="" className="text-xs my-2">Visitor Name</label>
                    <input type="text" name="" id="" onChange={handleChange} className="border border-gray-300 rounded px-2 py-1" placeholder="Visitor Name"/>
                </div>
            </div>
            <div className="p-4 bg-white rounded shadow-md flex-grow">
                <div className="overflow-x-auto h-[70vh] overflow-y-auto"> {/* Set max-height and enable vertical scroll */}
                    <table className="min-w-full border-collapse border font-normal border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Name</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">address</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Contact No</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Email</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Purpose</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Time In</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs?.map(log => (
                                <tr key={log?._id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 p-2">{log?.visitorID?.name || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{log?.visitorID?.address || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{log?.visitorID?.contactNumber || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{log?.visitorID?.email || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{log?.purpose || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{new Date(log?.timeIn).toLocaleString('en-us', {month: 'long', day:'2-digit', hour:'2-digit', minute:'2-digit'})}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default VisitorLogs
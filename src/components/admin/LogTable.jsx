import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import React from 'react'
import API_URL from "../../constants/api";
import debounce from "../../helper/debounce";

function LogsTable() {
    const [logs, setLogs] = useState([]);
    const [name, setName] = useState('');
    const [limit, setLimit] = useState(10);
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
    
            const res = await axios.get(`${API_URL}log`, { params });
    
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

    return (
        <div className='flex flex-col'>
            <div className="p-4 bg-white rounded shadow-md flex-grow">
                <div className="overflow-x-auto h-fit overflow-y-auto"> {/* Set max-height and enable vertical scroll */}
                    <table className="min-w-full border-collapse border font-normal border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Student Name</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Student Number</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Department</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Section</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Time In</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs?.map(log => (
                                <tr key={log?._id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 p-2">{log?.studentID?.name || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{log?.studentID?.studentNumber || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{log?.studentID?.department || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{log?.studentID?.section || 'N/A'}</td>
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

export default LogsTable
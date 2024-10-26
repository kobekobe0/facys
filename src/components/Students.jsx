import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import React from 'react'
import API_URL from "../constants/api";
import debounce from "../helper/debounce";
import abbreviate from "../helper/abbreviate";

const colleges = [
    'College of Science',
    'College of Engineering',
    'College of Information and Communications Technology',
    'College of Industrial Technology',
]

const yearLevels = [
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
]
function Students() {
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
        <div className='flex p-8 flex-col h-full'>
            <div className='w-full justify-between flex items-center'>
                <h1 className='text-xl font-semibold'>Students</h1>
            </div>
            <div className="flex items-center text-gray-700 shadow-md rounded p-4 my-4 bg-white justify-between">
                <div className="flex flex-wrap gap-4 items-center bg-gray-50 rounded-lg shadow-sm">
                    <div className="flex flex-col min-w-[200px]">
                        <label htmlFor="Department" className="text-xs font-medium text-gray-700">Department</label>
                        <select 
                        id="Department" 
                        onChange={(e) => setLimit(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {
                                colleges.map(college => (
                                    <option value={college}>{abbreviate(college)}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex flex-col min-w-[200px]">
                        <label htmlFor="limit" className="text-xs font-medium text-gray-700">Year Level</label>
                        <select 
                        id="level" 
                        onChange={(e) => setLimit(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {
                                yearLevels.map(level => (
                                    <option value={level}>{level} year</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="" className="text-xs my-2">Student Name</label>
                    <input type="text" name="" id="" onChange={handleChange} className="border border-gray-300 rounded px-2 py-1" placeholder="Student Name"/>
                </div>
            </div>
            <div className="p-4 bg-white rounded shadow-md flex-grow">
                <div className="overflow-x-auto h-[70vh] overflow-y-auto"> {/* Set max-height and enable vertical scroll */}
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
                            {logs.map(log => (
                                <tr key={log._id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 p-2">{log.studentID.name}</td>
                                    <td className="border border-gray-300 p-2">{log.studentID.studentNumber}</td>
                                    <td className="border border-gray-300 p-2">{log.studentID.department}</td>
                                    <td className="border border-gray-300 p-2">{log.studentID.section}</td>
                                    <td className="border border-gray-300 p-2">{new Date(log.timeIn).toLocaleString('en-us', {month: 'long', day:'2-digit', hour:'2-digit', minute:'2-digit'})}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default Students
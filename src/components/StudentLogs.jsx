import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import React from 'react'
import API_URL from "../constants/api";
import debounce from "../helper/debounce";
import printStudentLogs from "../helper/printStudentLogs";

function StudentLogs() {
    const [logs, setLogs] = useState([]);
    const [name, setName] = useState('');
    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [sections, setSections] = useState([])
    const [section, setSection] = useState(null)
    const [sex, setSex] = useState(null)
    const [reportedBy, setReportedBy] = useState('')

    const fetchLogs = async () => {
        if(section === 'null') setSection(null);
        if(sex === 'null') setSex(null);
        try {
            const params = {};
    
            if (name) params.name = name; 
            if (limit) params.limit = limit;
            if (page) params.page = page;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            if (section) params.section = section;
            if (sex) params.sex = sex;
    
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
    }, [name, limit, page, startDate, endDate, section, sex])

    
    const fetchColleges = async () => {
        const res = await axios.get(`${API_URL}config/department`);
        console.log(res.data.UniqueDepartmentsFromStudents)
        setSections(res.data.UniqueSectionFromStudents);
    }

    useEffect(() => {
        fetchLogs();
        fetchColleges()
    }, [])  

    const handlePrint = () => {
        printStudentLogs(logs, startDate, endDate, prompt('Please enter your name:'));
    }
    return (
        <div className='flex p-8 flex-col h-full'>
            <div className='w-full justify-between flex items-center'>
                <h1 className='text-xl font-semibold'>Student Logs</h1>
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
                    <div className="flex flex-col min-w-[200px]">
                        <label htmlFor="Section" className="text-xs font-medium text-gray-700">Section</label>
                        <select 
                        id="Section" 
                        onChange={(e) => setSection(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value='null'>Set Section</option>
                            {
                                sections.map(college => (
                                    <option value={college}>{college}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex flex-col min-w-[200px]">
                        <label htmlFor="Section" className="text-xs font-medium text-gray-700">Sex</label>
                        <select 
                        id="Section" 
                        onChange={(e) => setSex(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value='null'>Set Sex</option>
                            <option value='M'>Male</option>
                            <option value='F'>Female</option>
                        </select>
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

                    <div className="flex flex-col justify-start items-start">
                        <label htmlFor="" className="text-xs font-medium my-1">Print</label>
                        <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-1 rounded">Print</button>
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

export default StudentLogs
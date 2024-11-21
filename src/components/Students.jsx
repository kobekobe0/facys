import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import React from 'react'
import API_URL from "../constants/api";
import debounce from "../helper/debounce";
import abbreviate from "../helper/abbreviate";
import { Link } from "react-router-dom";

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
    const [department, setDepartment] = useState(null);
    const [yearLevel, setYearLevel] = useState(null);
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [colleges, setColleges] = useState([]);
    const [section, setSection] = useState([])
    const [selectedSection, setSelectedSection] = useState(null)

    const fetchLogs = async () => {
        if(department === 'null') setDepartment(null);
        if(yearLevel === 'null') setYearLevel(null);
        if(selectedSection === 'null') setSelectedSection(null);
        try {
            const params = {};
    
            if (name) params.name = name; 
            if (limit) params.limit = limit;
            if (page) params.page = page;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            if (department) params.department = department;
            if (yearLevel) params.yearLevel = yearLevel;
            if (selectedSection) params.section = selectedSection;

            console.log(params)
    
            const res = await axios.get(`${API_URL}student/all`, { params });
    
            console.log(res.data.docs);
            setLogs(res.data.docs);
        } catch (err) {
            console.error(err);
        }
    }

    const fetchColleges = async () => {
        const res = await axios.get(`${API_URL}config/department`);
        console.log(res.data.UniqueDepartmentsFromStudents)
        setColleges(res.data.UniqueDepartmentsFromStudents);
        setSection(res.data.UniqueSectionFromStudents);
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
        console.log(department, yearLevel)
        fetchLogs();
    }, [name, limit, page, startDate, endDate, department, yearLevel, selectedSection])

    useEffect(() => {
        fetchLogs();
        fetchColleges()
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
                        onChange={(e) => setDepartment(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value='null'>Set department</option>
                            {
                                colleges.map(college => (
                                    <option value={college}>{abbreviate(college)}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex flex-col min-w-[200px]">
                        <label htmlFor="Section" className="text-xs font-medium text-gray-700">Section</label>
                        <select 
                        id="Section" 
                        onChange={(e) => setSelectedSection(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value='null'>Set Section</option>
                            {
                                section.map(college => (
                                    <option value={college}>{college}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex flex-col min-w-[200px]">
                        <label htmlFor="limit" className="text-xs font-medium text-gray-700">Year Level</label>
                        <select 
                        id="level" 
                        onChange={(e) => setYearLevel(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value='null'>Set year</option>
                            {
                                yearLevels.map(level => (
                                    <option value={level}>{level} year</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="flex flex-col min-w-[200px]">
                        <label htmlFor="limit" className="text-xs font-medium text-gray-700">Limit</label>
                        <select 
                        id="level" 
                        onChange={(e) => setLimit(e.target.value)} 
                        className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="500">500</option>
                            <option value="1000">1000</option>
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
                    <table className="min-w-full border-none font-normal border-gray-300/0">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Image</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Student Name</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Student Number</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Department</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Year Level</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Section</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log._id} className="hover:bg-gray-100">
                                    <td>
                                        <div className="flex items-center gap-2 w-full justify-center my-2">
                                            <img className="w-20 self-center h-20 rounded-full" src={log?.pfp ? log.pfp : ''} alt="" />
                                        </div>
                                    </td>
                                    <td className="p-2">{log?.name}</td>
                                    <td className="p-2">{log?.studentNumber}</td>
                                    <td className="p-2">{log?.department}</td>
                                    <td className="p-2">{log?.yearLevel}</td>
                                    <td className="p-2">{log?.section}</td>
                                    <td className="p-2 flex item-center h-full justify-center font-bold gap-2">
                                        <Link to={`/admin/students/${log._id}`} className=' text-blue-500 border-blue-500  text-xs px-2 rounded py-1'>View</Link>
                                    </td>
                                </tr>
                            ))}

                            {
                                logs.length === 0 && (
                                    <tr className="border-none">
                                        <td colSpan="6" rowSpan="6" className="text-center border-none"><p className="my-4 font-medium text-gray-600">No data available</p></td>
                                    </tr>
                                )
                            }

                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}

export default Students
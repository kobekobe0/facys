import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import React from 'react'
import API_URL from "../constants/api";
import debounce from "../helper/debounce";
import abbreviate from "../helper/abbreviate";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const yearLevels = [
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
]
function Visitors() {
    const navigate = useNavigate()
    const [logs, setLogs] = useState([]);
    const [name, setName] = useState('');
    const [limit, setLimit] = useState(100);
    const [department, setDepartment] = useState(null);
    const [yearLevel, setYearLevel] = useState(null);
    const [page, setPage] = useState(1);
    const [password, setPassword] = useState('')
    const [selectedItem, setSelectedItem] = useState(null);
    const fetchLogs = async () => {
        if(department === 'null') setDepartment(null);
        if(yearLevel === 'null') setYearLevel(null);
        try {
            const params = {};
    
            if (name) params.name = name; 
            if (limit) params.limit = limit;
            if (page) params.page = page;
    
            const res = await axios.get(`${API_URL}visitor/visitors`, { params });
    
            console.log(res.data.docs);
            setLogs(res.data.docs);
        } catch (err) {
            console.error(err);
        }
    }

    const handleDelete = async () => {
        console.log('asdasd')
        if(!password) {
            alert('Please enter password');
            return;
        }
        console.log(selectedItem)
        toast.loading('Deleting visitor');
        try {
            const res = await axios.delete(`${API_URL}visitor/delete/${selectedItem}?password=${password}`, {
                headers: {
                    Authorization: `${localStorage.getItem('authToken')}`
                }
            });
            console.log(res.data);
            setPassword('');
            setSelectedItem(null);
            toast.dismiss()
            toast.success('Visitor deleted successfully');
            fetchLogs();
        } catch (err) {
            toast.dismiss()
            setPassword('');
            toast.error('Error deleting visitor');
            console.error(err);
        }
    }

    const fetchColleges = async () => {
        const res = await axios.get(`${API_URL}config/department`);
        console.log(res.data.UniqueDepartmentsFromStudents)
        setColleges(res.data.UniqueDepartmentsFromStudents);
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
    }, [name, limit, page])

    useEffect(() => {
        fetchLogs();
        fetchColleges()
    }, [])  

    return (
        <div className='flex p-8 flex-col h-full'>
            <div className='w-full justify-between flex items-center'>
                <h1 className='text-xl font-semibold'>Visitors</h1>
                <button onClick={()=> navigate('/admin/visitors/create')} className="px-4 py-1 bg-red-500 text-white rounded">
                    Register
                </button>
            </div>
            <div className="flex items-center text-gray-700 shadow-md rounded p-4 my-4 bg-white justify-end">
                <div className="flex items-center gap-4">
                    <label htmlFor="" className="text-xs my-2">Visitor Name</label>
                    <input type="text" name="" id="" onChange={handleChange} className="border border-gray-300 rounded px-2 py-1" placeholder="Visitor Name"/>
                </div>
            </div>
            <div className="p-4 bg-white rounded shadow-md flex-grow">
                <div className="overflow-x-auto h-[70vh] overflow-y-auto"> {/* Set max-height and enable vertical scroll */}
                    <table className="min-w-full border-none font-normal border-gray-300/0">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Image</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Name</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Address</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Contact No</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Email</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Date of Birth</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Organization</th>
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
                                    <td className="p-2">{log?.address}</td>
                                    <td className="p-2">{log?.contactNumber}</td>
                                    <td className="p-2">{log?.email}</td>
                                    <td className="p-2">{log?.dateOfBirth.split('T')[0]}</td>
                                    <td className="p-2">{log?.organization}</td>
                                    <td className="p-2 flex item-center h-[75px] justify-center font-bold gap-2">
                                        <button onClick={()=>setSelectedItem(log._id)} className=' text-red-500 border-red-500  text-xs px-2 rounded py-1'>Delete</button>
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
            
            {
                selectedItem && (
                    <div className="bg-white/95 border border-black/50 rounded w-[20vw] top-0 right-[35vw] h-[30vh] absolute">
                        <div className="flex flex-col justify-center p-8 h-full w-full">
                            <h1 className="text-lg font-semibold">Admin Password</h1>
                            <p>
                                Enter admin password to delete visitor. This is irreversible.
                            </p>
                            <div className="flex flex-col gap-4 items-center mt-4 w-full">
                                <div className="flex flex-col gap-2 w-full">
                                    <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-end">
                                <button onClick={()=>setSelectedItem(null)} className="mt-4 text-red-500 px-4 py-2 rounded">Cancel</button>
                                <button onClick={()=>handleDelete()} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Submit</button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default Visitors
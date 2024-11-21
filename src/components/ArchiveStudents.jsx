import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import API_URL from "../constants/api";
import debounce from "../helper/debounce";
import toast from "react-hot-toast";

function ArchiveStudents() {
    const [logs, setLogs] = useState([]);
    const [selectedLogs, setSelectedLogs] = useState([]);
    const [name, setName] = useState('');
    const [limit, setLimit] = useState(100);
    const [department, setDepartment] = useState(null);
    const [yearLevel, setYearLevel] = useState(null);
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
            if (department) params.department = department;
            if (yearLevel) params.yearLevel = yearLevel;

            const res = await axios.get(`${API_URL}student/deleted`, { params });
            setLogs(res.data.docs);
        } catch (err) {
            console.error(err);
        }
    };

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

    const toggleSelect = (id) => {
        setSelectedLogs((prev) =>
            prev.includes(id) ? prev.filter((logId) => logId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedLogs.length === logs.length) {
            setSelectedLogs([]);
        } else {
            setSelectedLogs(logs.map((log) => log._id));
        }
    };

    const [confirmModal, setConfirmModal] = useState({
        open: false,
        message: "",
        title: "",
        submit: null,
        cancel: () => {
            setConfirmModal({
                open: false,
                message: "",
                title: "",
                submit: null
            })
        }
    });

    const [adminPassword, setAdminPassword] = useState("")

    const deleteSelected = async (password) => {
        console.log("Password being sent to deleteSelected:", password);
        try {
            console.log("Admin Password received:", password);
            console.log("Selected Logs:", selectedLogs);
    
            const body = {
                idss: JSON.stringify(selectedLogs),
                password: password, // Use the passed password
            };
    
            console.log("Payload being sent:", body);
    
            const res = await axios.post(
                `${API_URL}student/delete-permanently`,
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem('authToken'),
                    }
                }
            );
    
            toast.success(res.data.message || 'Old accounts deleted successfully');
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete old accounts');
        }
    };
    
    

    const restoreSelected = async (password) => {
        try {
            const body = {
                idss: JSON.stringify(selectedLogs),
                password: password, // Use the passed password
            };
            const res = await axios.post(
                `${API_URL}student/restore-account`, // Replace with the correct endpoint
                body,
                {
                    headers: {
                        "Authorization": localStorage.getItem('authToken')
                    }
                }
            );

            toast.success(res.data.message || 'Old accounts deleted successfully');
            window.location.reload();
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to delete old accounts');
        }
    }

    const openDelete = () => {
        setConfirmModal({
            open: true,
            title: "Delete Selected",
            message: "Are you sure you want to delete the selected logs? This action is irreversible.",
            submit: () => deleteSelected(document.querySelector('input[type="password"]').value),
            cancel: () => {
                setConfirmModal({
                    open: false,
                    message: "",
                    title: "",
                    submit: null
                });
            },
        });
    };

    const openRestore = () => {
        setConfirmModal({
            open: true,
            title: "Restore Selected",
            message: "Are you sure you want to restore the selected logs?",
            submit: () => restoreSelected(document.querySelector('input[type="password"]').value),
            cancel: () => {
                setConfirmModal({
                    open: false,
                    message: "",
                    title: "",
                    submit: null
                })
            }
        });
    }

    useEffect(() => {
        fetchLogs();
    }, [name, limit, page, startDate, endDate, department, yearLevel]);

    return (
        <div className="flex p-8 flex-col h-full">
            <div className="w-full justify-between flex items-center">
                <h1 className="text-xl font-semibold">Archived Accounts</h1>
            </div>
            <div className="flex items-center text-gray-700 shadow-md rounded p-4 my-4 bg-white justify-between">
                <div className="flex flex-wrap gap-4 items-center bg-gray-50 rounded-lg shadow-sm">
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
                    {selectedLogs.length > 0 && (
                        <div className="self-end mb-1 flex gap-4">
                            <button
                                onClick={openDelete}
                                className="bg-red-500 text-white rounded text-xs px-4 py-2"
                            >
                                Delete Permanently
                            </button>
                            <button
                                onClick={openRestore}
                                className="bg-blue-500 text-white rounded text-xs px-4 py-2"
                            >
                                Restore Selected
                            </button>
                            <button
                                onClick={()=> {
                                    setSelectedLogs([])
                                }}
                                className="bg-yellow-500 text-white rounded text-xs px-4 py-2"
                            >
                                Unselect
                            </button>
                        </div>
                    )}
                </div>



                <div className="flex flex-col">
                    <label htmlFor="" className="text-xs my-2">Student Name</label>
                    <input type="text" name="" id="" onChange={handleChange} className="border border-gray-300 rounded px-2 py-1" placeholder="Student Name"/>
                </div>
            </div>
            {
    confirmModal.open && (
        <div className="flex p-4 w-full shadow-md flex-col">
            <div className="bg-white p-6 rounded-md shadow-lg w-full">
                <h3 className="text-lg font-semibold">{confirmModal.title}</h3>
                <p className="text-sm text-gray-600 mt-2">
                    {confirmModal.message}
                </p>

                <input
    type="password"
    value={adminPassword}
    onChange={(e) => {
        setAdminPassword(e.target.value);
        console.log("Admin Password updated:", e.target.value);
    }}
    className="mt-4 w-full p-2 border border-gray-300 rounded-md"
    placeholder="Admin Password"
/>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded-md"
                        onClick={confirmModal.cancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                        onClick={confirmModal.submit} // Uses updated logic to call deleteSelected(adminPassword)
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

  
            <div className="p-4 bg-white rounded shadow-md flex-grow">
                <div className="overflow-x-auto h-[70vh] overflow-y-auto">
                    <table className="min-w-full border-none font-normal border-gray-300/0">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">
                                    <input
                                        type="checkbox"
                                        onChange={toggleSelectAll}
                                        checked={selectedLogs.length === logs.length}
                                    />
                                </th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Image</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Student Name</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Student Number</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Department</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Year Level</th>
                                <th className="border font-medium text-sm border-gray-300 p-2 text-left">Section</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-100">
                                    <td className="p-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedLogs.includes(log._id)}
                                            onChange={() => toggleSelect(log._id)}
                                        />
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 w-full justify-center my-2">
                                            <img className="w-20 self-center h-20 rounded-full" src={log?.pfp || ''} alt="" />
                                        </div>
                                    </td>
                                    <td className="p-2">{log?.name}</td>
                                    <td className="p-2">{log?.studentNumber}</td>
                                    <td className="p-2">{log?.department}</td>
                                    <td className="p-2">{log?.yearLevel}</td>
                                    <td className="p-2">{log?.section}</td>
                                </tr>
                            ))}

                            {logs.length === 0 && (
                                <tr className="border-none">
                                    <td colSpan="8" className="text-center border-none">
                                        <p className="my-4 font-medium text-gray-600">No data available</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ArchiveStudents;

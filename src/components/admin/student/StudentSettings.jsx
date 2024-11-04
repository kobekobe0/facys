import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../../constants/api';
// import ProfilePicture from './settings/ProfilePicture';
import toast from 'react-hot-toast';
import WebcamCapture from '../../WebcamCaptureTest';
import WebcamCaptureTest from '../../WebcamCaptureTest';

function StudentSettings({ student, handlePfpUpdate, handlePasswordUpdate }) {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [details, setDetails] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [activeSection, setActiveSection] = useState('account'); // State to control active section

    const [confirmBlock, setConfirmBlock] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            toast.error('Please upload a valid PDF file.');
        } else {
            setFile(selectedFile);
            console.log('PDF file selected:', selectedFile);
        }
    };

    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    const passwordUpdate = async () => {
        if(password !== confirmPassword) return toast.error('Passwords do not match');
        if(password.length < 8) return toast.error('Password must be at least 8 characters long');

        try {
            const res = await axios.put(`${API_URL}student/password-by-admin/${student._id}`, { password }, {
                headers: {
                    'Authorization': localStorage.getItem('authToken')
                }
            });
            toast.success('Password Updated');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const corUpdate = async () => {
        if(!file) return toast.error('Please upload a valid PDF file.');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${API_URL}student/cor`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(res.data.details.studentNumber !== student.studentNumber) return toast.error("Please upload student's COR");
            console.log(res.data)
            setDetails(res.data.details);
            setSchedule(res.data.schedules);
            toast.success('COR Uploaded');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleConfirmBlock = async () => {
        try {
            const res = await axios.put(`${API_URL}student/block/${student._id}`, {}, {
                headers: {
                    'Authorization': localStorage.getItem('authToken')
                }
            });
            toast.success('Account Blocked');
            window.location.reload();
        } catch (error) {
            toast.error(error.data.message);
        }
    }
    const handleConfirmDelete = async () => {
        if(!adminPassword) return toast.error('Please enter the admin password');
        toast.loading('Deleting Account');
        try {
            const res = await axios.delete(`${API_URL}student/delete/${student._id}?password=${adminPassword}`, {
                headers: {
                    'Authorization': localStorage.getItem('authToken')
                }
            });
            toast.dismiss()
            toast.success('Account Deleted');
            window.location.replace('/admin/students');
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message);
        }
    }
    const handleConfirmUnblock = async () => {
        try {
            const res = await axios.put(`${API_URL}student/unblock/${student._id}`, {}, {
                headers: {
                    'Authorization': localStorage.getItem('authToken')
                }
            });
            toast.success('Account Unblocked');
            window.location.reload();
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleSubmitDetails = async () => {

            console.log('clicked')
            console.log(schedule)
            if(!details) return toast.error('Please upload a COR file first.');
            try {
                const res = await axios.put(`${API_URL}student/update/${student._id}`, {
                    ...details,
                    schedule: JSON.stringify(schedule)
                }, {
                    headers: {
                        'Authorization': localStorage.getItem('authToken')
                    }
                });
                toast.success('Details Updated');
                window.location.reload()
            } catch (error) {
                console.log(error)
                toast.error(error.message);
            }
    };

    useEffect(()=> {console.log(student)},[student]);

    return (
        <div className="flex w-full h-full">
            {/* Sidebar Navigation */}
            <div className="w-1/4 bg-gray-100 p-4 border-r">
                <ul className="space-y-4">
                    <li>
                        <button
                            className={`w-full text-left px-4 py-2 rounded ${activeSection === 'account' ? 'bg-red-700 text-white' : 'text-gray-700 hover:bg-red-100'}`}
                            onClick={() => setActiveSection('account')}
                        >
                            <i className="fas fa-lock mr-2"></i> Account
                        </button>
                    </li>
                    <li>
                        <button
                            className={`w-full text-left px-4 py-2 rounded ${activeSection === 'password' ? 'bg-red-700 text-white' : 'text-gray-700 hover:bg-red-100'}`}
                            onClick={() => setActiveSection('password')}
                        >
                            <i className="fas fa-lock mr-2"></i> Password
                        </button>
                    </li>
                    <li>
                        <button
                            className={`w-full text-left px-4 py-2 rounded ${activeSection === 'cor' ? 'bg-red-700 text-white' : 'text-gray-700 hover:bg-red-100'}`}
                            onClick={() => setActiveSection('cor')}
                        >
                            <i className="fas fa-file-pdf mr-2"></i> COR Update
                        </button>
                    </li>
                    <li>
                        <button
                            className={`w-full text-left px-4 py-2 rounded ${activeSection === 'profile' ? 'bg-red-700 text-white' : 'text-gray-700 hover:bg-red-100'}`}
                            onClick={() => setActiveSection('profile')}
                        >
                            <i className="fas fa-user-circle mr-2"></i> Face Data
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-6">
                {activeSection === 'account' && (
                    <div className="flex flex-col w-full">
                        <div className="space-y-6">
                            
                            {
                                student?.isBlocked && (
                                    <div className="p-4 bg-gray-100 rounded shadow-sm">
                                        <p className="text-gray-700 font-semibold">Block Student Account</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Blocking the account will prevent the system from recognizing the student's face.
                                        </p>
                                        {
                                            !confirmBlock && (
                                                <button onClick={()=>setConfirmBlock(true)} className="mt-3 px-4 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-500 transition">
                                                    Unblock Account
                                                </button>                                        
                                            )
                                        }
        
                                        {confirmBlock && (
                                            <div>
                                                <p className="text-lg text-gray-800 mt-4">Confirmation</p>
                                                <p>
                                                    Are you sure you want to unblock this account?
                                                </p>
                                                <div className='flex gap-4 items-center'>
                                                    <button onClick={()=>setConfirmBlock(false)} className="mt-3 px-4 py-2 text-xs hover:bg-red-600 hover:text-white text-red-600 border rounded border-red-600 transition">
                                                        Cancel
                                                    </button>
                                                    <button onClick={handleConfirmUnblock} className="mt-3 px-4 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-500 transition">
                                                        Unblock Account
                                                    </button>
                                                </div>
                                                
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                            {
                                !student?.isBlocked && (
                                    <div className="p-4 rounded shadow-sm">
                                        <p className="text-gray-700 font-semibold">Block Student Account</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Blocking the account will prevent the system from recognizing the student's face.
                                        </p>
                                        {
                                            !confirmBlock && (
                                                <button onClick={()=>setConfirmBlock(true)} className="mt-3 px-4 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-500 transition">
                                                    Block Account
                                                </button>                                        
                                            )
                                        }
        
                                        {confirmBlock && (
                                            <div className='bg-gray-200/75 p-4 rounded mt-4'>
                                                <p className="text-lg text-gray-800">Confirmation</p>
                                                <p>
                                                    Are you sure you want to block this account?
                                                </p>
                                                <div className='flex gap-4 items-center'>
                                                    <button onClick={()=>setConfirmBlock(false)} className="mt-3 px-4 py-2 text-xs hover:bg-red-600 hover:text-white text-red-600 border rounded border-red-600 transition">
                                                        Cancel
                                                    </button>
                                                    <button onClick={handleConfirmBlock} className="mt-3 px-4 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-500 transition">
                                                        Block Account
                                                    </button>
                                                </div>
                                                
                                            </div>
                                        )}
                                    </div>
                                )
                            }


                            
                            {/* Delete Account Section */}
                            <div className="p-4 rounded shadow-sm">
                                <p className="text-gray-700 font-semibold">Delete Student Account</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Deleting the account will remove all data associated with the student including logs.
                                </p>
                                {
                                    !confirmDelete && (
                                        <button onClick={()=>setConfirmDelete(true)} className="mt-3 bg-red-600 text-white px-4 py-2 text-xs rounded hover:bg-red-500 transition">
                                            Delete Account
                                        </button>
                                    )
                                }
                                

                                {confirmDelete && (
                                            <div className='bg-gray-200/75 p-4 rounded mt-4'>
                                                <p className="text-lg text-gray-800">Confirmation</p>
                                                <p>
                                                    Are you sure you want to <span className='text-red-600 font-medium'>DELETE</span> this account? This action is irreversible.
                                                </p>
                                                <input value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} type="password" placeholder='Enter admin password' className='px-2 w-full py-2 rounded my-4 border border-gray-300'/>
                                                <div className='flex gap-4 items-center'>
                                                    <button onClick={()=>setConfirmDelete(false)} className="mt-3 px-4 py-2 text-xs hover:bg-red-600 hover:text-white text-red-600 border rounded border-red-600 transition">
                                                        Cancel
                                                    </button>
                                                    <button onClick={handleConfirmDelete} className="mt-3 px-4 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-500 transition">
                                                        Delete Account
                                                    </button>
                                                </div>
                                                
                                            </div>
                                        )}
                            </div>
                            
                        </div>
                    </div>
                )}


                {activeSection === 'password' && (
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">Update Password</h3>
                        <div className="w-full flex flex-col items-start gap-4">
                            <div className="flex w-full flex-col gap-2">
                                <label className="text-sm">New Password</label>
                                <input type="password" className="p-2 mb-2 border rounded border-gray-300" onChange={e => setPassword(e.target.value)} />
                                <label className="text-sm">Confirm Password</label>
                                <input type="password" className="p-2 border rounded border-gray-300" onChange={e => setConfirmPassword(e.target.value)} />
                            </div>
                            <button onClick={passwordUpdate} className="bg-red-700 text-white px-4 py-2 rounded">Update Password</button>
                        </div>
                    </div>
                )}

                {activeSection === 'cor' && (
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold">Update COR</h3>
                        <p className="mb-4">Upload the latest student's COR to update details.</p>
                        <div className="w-full flex flex-col items-start gap-4">
                            <input 
                                type="file" 
                                id="fileInput" 
                                className="hidden" 
                                onChange={handleFileChange} 
                            />
                            <button
                                className="bg-gray-200 text-gray-700 flex items-center justify-center gap-2 px-4 py-2 rounded border border-gray-100 cursor-pointer w-full h-24 hover:bg-gray-300 transition duration-200 ease-in-out"
                                onClick={handleButtonClick}
                            >
                                {file ? <p>{file.name}</p> : <><i className="fas fa-upload mr-2"></i> Select PDF File</>}
                            </button>

                            {
                                details && (
                                    <p className='text-green-600/80 font-medium'>
                                        Details are valid. Proceed to update.
                                    </p>
                                )
                            }
                            {!details ? (
                                <button
                                    className="border border-red-700 text-red-700 hover:text-white px-4 w-full py-2 mt-4 rounded hover:bg-red-500 transition duration-200"
                                    onClick={corUpdate}
                                >
                                    Upload COR
                                </button>
                            ) : (
                                <button
                                    className="bg-red-700 text-white px-4 py-2 rounded w-full hover:bg-red-500 transition duration-200"
                                    onClick={handleSubmitDetails}
                                >
                                    Update Details
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'profile' && (
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold">Profile Picture</h3>
                        <p className='mb-8'>Update Student's Face data in the system.</p>
                        <WebcamCaptureTest id={student._id}/>
                    </div>
                )}

            </div>
        </div>
    );
}

export default StudentSettings;

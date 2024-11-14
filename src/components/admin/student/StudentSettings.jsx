import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../../constants/api';
// import ProfilePicture from './settings/ProfilePicture';
import toast from 'react-hot-toast';
import WebcamCapture from '../../WebcamCaptureTest';
import WebcamCaptureTest from '../../WebcamCaptureTest';
import VisitorFaceCapture from '../scan/VisitorFaceCapture';

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



    const [start, setStart] = useState(false);
    const [faceData, setFaceData] = useState(null);
    const [faceData2, setFaceData2] = useState(null);
    const [faceData3, setFaceData3] = useState(null);
    const [screenshot, setScreenshot] = useState(null);

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
        if(!adminPassword) return toast.error('Please enter the admin password');
        toast.loading('Blocking Account');
        try {
            const res = await axios.put(`${API_URL}student/block/${student._id}`, {password: adminPassword}, {
                headers: {
                    'Authorization': localStorage.getItem('authToken')
                }
            });
            toast.dismiss()
            toast.success('Account Blocked');
            window.location.reload();
        } catch (error) {
            setAdminPassword("")
            toast.dismiss()
            console.log(error)
            toast.error(error.response.data.message);
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
        if(!adminPassword) return toast.error('Please enter the admin password');
        toast.loading('Deleting Account');
        try {
            const res = await axios.put(`${API_URL}student/unblock/${student._id}`, {
                password: adminPassword
            }, {
                headers: {
                    'Authorization': localStorage.getItem('authToken')
                }
            });
            toast.dismiss()
            toast.success('Account Unblocked');
            window.location.reload();
        } catch (error) {
            setAdminPassword('')
            toast.dismiss()
            toast.error(error.response.data.message);
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

    const handleReset = () => {
        setScreenshot(null);
        setFaceData(null);
        setFaceData2(null);
        setFaceData3(null);
        setStart(false);
    }

    const [updatePfp, setUpdatePfp] = useState(false)
    const [confirmUpdate, setConfirmUpdate] = useState(false)

    const handleUpdateFaceData = async () => {
        if(!adminPassword) return toast.error('Please enter the admin password');
        if(!faceData3) return toast.error('Please capture face data first');
        toast.loading('Updating Face Data');
        try {
            const formData = new FormData();
            const faceDataPayload = {
                mainDescriptor: Array.from(faceData),            // Main descriptor as array
                supportDescriptor1: Array.from(faceData2),       // First support descriptor as array
                supportDescriptor2: Array.from(faceData3),       // Second support descriptor as array
            };
            
            formData.append("faceData", JSON.stringify(faceDataPayload));
            formData.append("image", screenshot);
            formData.append("updatePfp", updatePfp)
            formData.append("password", adminPassword)

            const res = await axios.post(`${API_URL}student/update-face/${student._id}`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('authToken'),
                    'Content-Type': 'multipart/form-data'
                },
            })
            toast.dismiss()
            toast.success('Face Data Updated');
            console.log(res)
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message);
        }
    }

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
                                                <input value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} type="password" placeholder='Enter admin password' className='px-2 w-full py-2 rounded my-4 border border-gray-300'/>

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
                                                <input value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} type="password" placeholder='Enter admin password' className='px-2 w-full py-2 rounded my-4 border border-gray-300'/>
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
                        <div className='flex items-center'>
                            <div className='flex flex-col'>
                                <h3 className="text-lg font-semibold">Profile Picture</h3>
                                <p className='mb-8'>Update Student's Face data in the system.</p>                            
                            </div>                       
                            <button onClick={handleReset} className='ml-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition duration-200'>
                                Restart
                            </button>
                        </div>


                        {/*<WebcamCaptureTest id={student._id}/>*/}
                        <div className='w-full flex items-start'>
                            {
                                !faceData3 && (
                                    <div className='w-2/3 p-4 h-full rounded'>
                                        {
                                            !start && (
                                            <button onClick={() => setStart(!start)} className='p-2 w-full flex items-center flex-col gap-4 justify-center h-full text-red-500 transition rounded-md border border-dashed border-red-400 hover:bg-red-500/65 hover:text-white'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="8em" height="8em" viewBox="0 0 24 24"><path fill="currentColor" d="M9 11.75A1.25 1.25 0 0 0 7.75 13A1.25 1.25 0 0 0 9 14.25A1.25 1.25 0 0 0 10.25 13A1.25 1.25 0 0 0 9 11.75m6 0A1.25 1.25 0 0 0 13.75 13A1.25 1.25 0 0 0 15 14.25A1.25 1.25 0 0 0 16.25 13A1.25 1.25 0 0 0 15 11.75M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a4 4 0 0 1 0-.86a10.05 10.05 0 0 0 5.26-5.37A9.99 9.99 0 0 0 17.42 10c.76 0 1.51-.09 2.25-.26c1.25 4.26-1.17 8.69-5.41 9.93c-.76.22-1.5.33-2.26.33M0 2a2 2 0 0 1 2-2h4v2H2v4H0zm24 20a2 2 0 0 1-2 2h-4v-2h4v-4h2zM2 24a2 2 0 0 1-2-2v-4h2v4h4v2zM22 0a2 2 0 0 1 2 2v4h-2V2h-4V0z"/></svg>
                                                <h2 className='text-xl font-medium'>Start Face Recognition</h2>
                                            </button>
                                            )
                                        }
                                        {
                                            start && (
                                                <VisitorFaceCapture
                                                visitorFaceData2={faceData2}
                                                visitorFaceData3={faceData3}
                                                start={start} 
                                                setStart={setStart}
                                                visitorFaceData={faceData} 
                                                setVisitorFaceData={setFaceData} 
                                                setVisitorFaceData2={setFaceData2} 
                                                setVisitorFaceData3={setFaceData3} 
                                                setScreenshot={setScreenshot} 
                                                /> 
                                            )
                                        }
                                    </div>
                                )
                            }
                            {
                                faceData3 && (
                                    <div className='mr-8'>
                                        <img src={URL.createObjectURL(screenshot)} alt="Face Data" className='w-64 h-64 object-cover rounded'/>
                                    </div>
                                    
                                )
                            }
                            <div className='flex flex-col justify-start mt-4 gap-4'>
   
                                <div className={`flex items-center ${faceData && 'text-red-500 font-semibold'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"/></g></svg>
                                    <p>Face 1 Captured</p>
                                </div>
                                <div className={`flex items-center ${faceData2 && 'text-red-500 font-medium'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"/></g></svg>
                                    <p>Face 2 Captured</p>
                                </div>
                                <div className={`flex items-center ${faceData3 && 'text-red-500 font-medium'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"/></g></svg>
                                    <p>Face 3 Captured</p>
                                </div>
                                {
                                    faceData3 && !confirmUpdate && (
                                        <div className='flex flex-col w-full gap-4'>
                                            <button onClick={()=>setConfirmUpdate(true)} className='bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500 transition duration-200'>
                                                Update Face Data
                                            </button>
                                            <button onClick={()=> {
                                                setUpdatePfp(true)
                                                setConfirmUpdate(true)
                                            }} className='bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500 transition duration-200'>
                                                Update Face Data & Profile Image
                                            </button>
                                        </div>  
                                    )
                                }
                                {
                                    confirmUpdate && (
                                        <div className='flex flex-col'>
                                            <p className='text-gray-700 font-medium'>Are you sure you want to update face data {updatePfp ? "and Profile image" : ""}?</p>
                                            <p className='text-xs mt-4'>Admin Password</p>
                                            <input value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} type="password" placeholder='Enter admin password' className='px-2 w-full py-1 rounded my-2 border border-gray-300'/>
                                            <div className='flex gap-4 items-center'>
                                                <button onClick={()=>{
                                                    setConfirmUpdate(false)
                                                    setUpdatePfp(false)
                                                }} className="mt-3 px-4 py-1 text-xs hover:bg-red-600 hover:text-white text-red-600 border rounded border-red-600 transition">
                                                    Cancel
                                                </button>
                                                <button onClick={handleUpdateFaceData} className="mt-3 px-4 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500 transition">
                                                    Update Face Data
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default StudentSettings;

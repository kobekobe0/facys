import React, { useEffect, useState } from 'react';
import useUserStore from '../store/user.store';
import AccountSettings from '../components/student/AccountSettings';
import CORUpdate from '../components/student/CORUpdate';
import toast from 'react-hot-toast';
import axios from 'axios';
import API_URL from '../constants/api';
import { useNavigate } from 'react-router-dom';
import WebcamCapture from '../components/register/WebcamCapture';
import CaptureUpdate from '../components/admin/student/CaptureUpdate';
import VisitorFaceCapture from '../components/admin/scan/VisitorFaceCapture';

const StudentProfile = () => {
    const [activeTab, setActiveTab] = useState('details');
    const [student, setStudent] = useState(null);
    const {user, fetchUser, logout} = useUserStore()

    useEffect(()=> {
        fetchUser()
    },[])

    useEffect(()=> {
        setStudent(user)
    },[user])

    const handleUpdateEmail = async (email, password) => {
        toast.loading('Updating email...')
        try { 
            const res = await axios.put(`${API_URL}student/email`, {
                email,
                password
            }, {
                headers: {
                    Authorization: `${localStorage.getItem('authToken')}`
                }
            })
            console.log(email)
            toast.dismiss()
            toast.success('Email updated successfully')
            await fetchUser()
        } catch (error) {
            console.log(error)
            toast.dismiss()
            toast.error(error?.response?.data?.message  || 'Failed to update email')

        }
    }

    const handleUpdateGuardianEmail = async (email, password) => {
        toast.loading('Updating guardian email...')
        try { 
            const res = await axios.put(`${API_URL}student/guardian-email`, {
                guardianEmail: email,
                password
            }, {
                headers: {
                    Authorization: `${localStorage.getItem('authToken')}`
                }
            })
            console.log(email)
            toast.dismiss()
            toast.success('Guardian Email updated successfully')
            await fetchUser()
        } catch (error) {
            console.log(error)
            toast.dismiss()
            toast.error(error?.response?.data?.message  || 'Failed to update email')

        }
    }

    const handlePasswordUpdate = async (oldPassword, newPassword) => {
        toast.loading('Updating password...')
        try {
            const res = await axios.put(`${API_URL}student/password`, {
                oldPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `${localStorage.getItem('authToken')}`
                }
            })
            toast.dismiss()
            toast.success('Password updated successfully')
            await fetchUser()
        } catch (error) {
            console.log(error)
            toast.dismiss()
            toast.error(error?.response?.data?.message || 'Failed to update password')
        }
    }

    const navigate = useNavigate()

    const [faceData, setFaceData] = useState(null)
    const [faceData2, setFaceData2] = useState(null)
    const [faceData3, setFaceData3] = useState(null)
    const [start, setStart] = useState(false)
    const [screenshot, setScreenshot] = useState(null)

    const updateFaceData = async (withPfp) => {
        if(!faceData3) return toast.error('Please capture face data first');
        toast.loading('Updating face data...')
        try {
            const formData = new FormData();
            const faceDataPayload = {
                mainDescriptor: Array.from(faceData),            // Main descriptor as array
                supportDescriptor1: Array.from(faceData2),       // First support descriptor as array
                supportDescriptor2: Array.from(faceData3),       // Second support descriptor as array
            };

            formData.append("faceData", JSON.stringify(faceDataPayload));
            formData.append("image", screenshot);
            formData.append("updatePfp", withPfp)

            const res = await axios.post(`${API_URL}student/update-face-by-student/${student._id}`, formData, {
                headers: {
                    'Authorization': localStorage.getItem('authToken'),
                    'Content-Type': 'multipart/form-data'
                },
            })

            toast.dismiss()
            toast.success('Face data updated successfully')
        } catch (error) {
            toast.dismiss()
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
            {/* Header */}
            <div className="flex items-center justify-start gap-4 mb-6">
                <button onClick={()=>navigate('/student')} className="text-red-600 font-bold text-2xl">←</button> {/* Back button */}
                <h1 className="text-xl font-medium text-red-700">Profile</h1>
            </div>

            {/* Profile Picture and Name */}
            <div className="text-center mb-6">
                <img
                    src={student?.pfp || 'https://via.placeholder.com/100'}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto border-2 border-red-500"
                />
                <h1 className="text-lg font-semibold mt-3 text-gray-800">{student?.name}</h1>
                <p className="text-sm text-gray-500">{student?.degree}</p>
            </div>
            {/* Tabs */}
            <div className="flex justify-center mb-6 text-xs">
                <button 
                    className={`py-2 px-4  ${activeTab === 'details' ? 'border-b border-red-500 text-red font-medium' : 'text-gray-800'}`} 
                    onClick={() => setActiveTab('details')}
                >
                    Details
                </button>
                <button 
                    className={`py-2 px-4  ${activeTab === 'account' ? 'border-b border-red-500 text-red font-medium' : 'text-gray-800'}`} 
                    onClick={() => setActiveTab('account')}
                >
                    Account
                </button>
                <button 
                    className={`py-2 px-4  ${activeTab === 'cor-update' ? 'border-b border-red-500 text-red font-medium' : 'text-gray-800'}`} 
                    onClick={() => setActiveTab('cor-update')}
                >
                    COR Update
                </button>
                <button 
                    className={`py-2 px-4  ${activeTab === 'face-data' ? 'border-b border-red-500 text-red font-medium' : 'text-gray-800'}`} 
                    onClick={() => setActiveTab('face-data')}
                >
                    Face Data
                </button>
            </div>






            {/* Content based on selected tab */}
            <div>
                {activeTab === 'details' && (
                <>
                    <div className="space-y-3 mb-4">
                        <div className="bg-red-50 p-4 rounded-lg shadow-md text-center">
                            <p className="text-xs text-red-700 font-semibold">Year Level</p>
                            <p className="text-red-800 font-bold">{student?.yearLevel}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg shadow-md text-center">
                            <p className="text-xs text-red-700 font-semibold">Department</p>
                            <p className="text-red-800 font-bold">{student?.department}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg shadow-md text-center">
                            <p className="text-xs text-red-700 font-semibold">Student #</p>
                            <p className="text-red-800 font-bold">{student?.studentNumber}</p>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <h2 className="text-lg font-bold text-gray-800">About</h2>
                        <p className="text-gray-600 mt-2 text-sm">
                            Registered AY {student?.SY}.
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Academic Year</h2>
                        <p className="text-gray-600 mt-2 text-sm">
                            Registered AY {student?.SY}.
                        </p>
                    </div>
                    <div className="mt-6">
                        <button onClick={logout} className="bg-red-600 text-white w-full py-3 rounded-lg font-semibold shadow-md hover:bg-red-700 transition">
                            Logout
                        </button>
                    </div>
                </>
                )}
                {activeTab === 'account' && (
                    <AccountSettings student={student} onEmailUpdate={handleUpdateEmail} onGuardianEmailUpdate={handleUpdateGuardianEmail} onPasswordUpdate={handlePasswordUpdate}/>

                )}
                {activeTab === 'cor-update' && (
                    <CORUpdate student={student} />
                )}
                {activeTab === 'face-data' && (
                    <div className='flex items-center w-full flex-col'>
                        <div>
                            {
                                !faceData3 && (
                                    <>
                                    
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
                                    </>
                                )
                            }
                        </div>
                        
                        <div className='flex flex-col mt-4 items-start'>
                               
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
                        </div>

                        {
                            faceData3 && (
                                <div className='flex flex-col gap-4 mt-4'>
                                    <div className='flex flex-col gap-4'>
                                        <img src={URL.createObjectURL(screenshot)} alt='Face 1' className='w-[300px] h-[300px] object-cover rounded-lg'/>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex flex-col gap-4'>
                                            <button onClick={()=>updateFaceData(false)} className='bg-red-600 text-white w-full py-3 rounded-lg font-semibold shadow-md hover:bg-red-700 transition'>
                                                Update Face Data
                                            </button>
                                            <button onClick={()=>updateFaceData(true)} className='bg-red-600 text-white w-full py-3 rounded-lg font-semibold shadow-md hover:bg-red-700 transition'>
                                                Update Face Data & Profile Image
                                            </button>
                                            <button onClick={() =>{
                                                setFaceData(null)
                                                setFaceData2(null)
                                                setFaceData3(null)
                                                setStart(false)
                                                setScreenshot(null)
                                            }} className='border-red-600 text-red-600 hover:text-white w-full py-3 rounded-lg font-semibold shadow-md hover:bg-red-700 transition'>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )}
            </div>

            {/* Contact Button */}

        </div>
    );
};

export default StudentProfile;

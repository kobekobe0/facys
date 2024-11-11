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
                    <AccountSettings student={student} onEmailUpdate={handleUpdateEmail} onPasswordUpdate={handlePasswordUpdate}/>

                )}
                {activeTab === 'cor-update' && (
                    <CORUpdate student={student} />
                )}
                {activeTab === 'face-data' && <CaptureUpdate/>}
            </div>

            {/* Contact Button */}

        </div>
    );
};

export default StudentProfile;

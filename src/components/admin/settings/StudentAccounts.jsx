// ./src/components/admin/settings/StudentAccounts.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../../../constants/api';

const StudentAccounts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [accounts, setAccounts] = useState([]);

    const handleDeleteAccounts = () => {
        setIsModalOpen(true); // Open the modal
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Close the modal
        setAdminPassword(''); // Clear the password input
    };

    const handlePasswordChange = (e) => {
        setAdminPassword(e.target.value); // Update the password input
    };

    const handleConfirmDeletion = async () => {
        
        try {
            if (adminPassword.length < 8) {
                return toast.error('Password must be at least 8 characters long');
            }  

            const body = {
                ids: accounts.map(account => account._id),
                password: adminPassword
            }
            
            console.log(body)

            const res = await axios.put(
                `${API_URL}student/delete-outdated`, // Replace with the correct endpoint
                body,
                {
                    headers: {
                        "Authorization": localStorage.getItem('authToken')
                    }
                }
            );

            toast.success(res.data.message || 'Old accounts deleted successfully');
            handleModalClose(); // Close modal on success
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete old accounts');
        }
    };

    const fetchOutdatedAccounts = async () => {
        try {
            const res = await axios.get(`${API_URL}student/outdated`, {
                headers: {
                    Authorization: localStorage.getItem('authToken')
                }
            });

            setAccounts(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=> {
        fetchOutdatedAccounts();
    },[])

    return (
        <div>
             <p className='bg-yellow-200 rounded text-yellow-700 my-4 p-2'>
                This action is irreversible, proceed with caution.
            </p>
            <h2 className="text-xl font-semibold mb-4">Student Accounts</h2>

            <p className="mb-4">
                Delete <span className='font-bold text-lg'>{accounts.length}</span> outdated/old accounts and associated logs with it.
            </p>
            
            {
                !isModalOpen && (
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded"
                        onClick={handleDeleteAccounts}
                    >
                        Delete Old Accounts
                    </button>
                )
            }


            {/* Confirmation Modal */}
            {isModalOpen && (
                <div >
                    <div className="bg-white p-6 rounded-md shadow-lg w-full">
                        <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Please enter the admin password to confirm deletion.
                        </p>

                        <input
                            type="password"
                            value={adminPassword}
                            onChange={handlePasswordChange}
                            className="mt-4 w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Admin Password"
                        />

                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded-md"
                                onClick={handleModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-md"
                                onClick={handleConfirmDeletion}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAccounts;

// ./src/components/admin/settings/AdminAccount.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API_URL from '../../../constants/api';

const AdminAccount = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOldPasswordChange = (e) => setOldPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleAdminPasswordChange = (e) => setAdminPassword(e.target.value);

  const handleEmailUpdate = () => {
    // Show the modal to confirm the email update
    setIsEmailModalOpen(true);
  };

  const handleConfirmEmailUpdate = async () => {
    toast.loading('Updating email...');
    //check email format via regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        toast.dismiss()
        return toast.error('Invalid email format');
    }

    try {
        const res = await axios.put(`${API_URL}admin/email`, {
            email,
            password: adminPassword
        }, {
            headers: {
                "Authorization": `${localStorage.getItem('authToken')}`
            }
        })
        toast.dismiss()
        toast.success(res.data.message);
    } catch (error) {
        toast.dismiss()
        toast.error(error.response.data.message || 'An error occurred');
    }
  };

  const handlePasswordUpdate = async () => {
    toast.loading('Updating password...');
    try{
        if(newPassword !== confirmPassword){
            return toast.error('Passwords do not match');
        }
        if(newPassword.length < 8){
            return toast.error('Password must be at least 8 characters long');
        }
        const res = await axios.put(`${API_URL}admin/password`, {
            oldPassword,
            newPassword
        },{
            headers: {
            "Authorization": `${localStorage.getItem('authToken')}`
            }
        });
        toast.dismiss();
        toast.success(res.data.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }catch(err){

        toast.error(err.response.data.message || 'An error occurred');
      console.error(err);
    }
  };

  const fetchAdmin = async () => {
    try {
      const res = await axios.get(`${API_URL}admin/me`, {
        headers: {
          "Authorization": `${localStorage.getItem('authToken')}`
        }
      });
      setEmail(res.data.email);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    fetchAdmin();
  },[])

  const handleCancelEmailUpdate = () => {
    setIsEmailModalOpen(false);
    setAdminPassword('');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin Account</h2>
      
      {/* Email Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <div className="flex flex-col items-start gap-2">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter email"
          />
          {!isEmailModalOpen && (
            <button
              onClick={handleEmailUpdate}
              className="px-4 py-2 text-sm mt-4 bg-red-600 text-white rounded"
            >
              Update Email
            </button>
          )}
        </div>

        {/* Email Confirmation Modal - positioned directly below email field */}
        {isEmailModalOpen && (
          <div className="bg-white p-4 mt-4 rounded-md shadow-md w-full">
            <h3 className="text-lg font-semibold">Confirm Email Update</h3>
            <p className="text-sm text-gray-600 mt-2">
              Please enter the admin password to confirm email update.
            </p>
            
            <input
              type="password"
              value={adminPassword}
              onChange={handleAdminPasswordChange}
              className="mt-4 w-full p-2 border border-gray-300 rounded-md"
              placeholder="Admin Password"
            />

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={handleCancelEmailUpdate}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={handleConfirmEmailUpdate}
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Old Password Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={handleOldPasswordChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter old password"
        />
      </div>

      {/* New Password Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter new password"
        />
      </div>

      {/* Confirm Password Field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Confirm new password"
        />
      </div>

      {/* Update Password Button */}
      <button
        onClick={handlePasswordUpdate}
        className="px-4 py-2 text-sm bg-red-600 text-white rounded"
      >
        Update Password
      </button>
    </div>
  );
};

export default AdminAccount;

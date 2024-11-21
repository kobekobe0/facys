import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AccountSettings = ({ student, onEmailUpdate, onGuardianEmailUpdate, onPasswordUpdate }) => {
    const [email, setEmail] = useState(student.email);
    const [guardianEmail, setGuardianEmail] = useState(student.guardianEmail);
    const [password, setPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEmailUpdate = () => {
        //check email is valid using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Invalid email format.");
            return;
        }
        if (email === student.email) {
            toast.success("Email is already up-to-date.");
            return;
        }
        if (!password) {
            toast.error("Password is required.");
            return;
        }
        onEmailUpdate(email, password);
        setPassword('');
    };
    const handleGuardianEmailUpdate = () => {
        //check email is valid using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guardianEmail)) {
            toast.error("Invalid email format.");
            return;
        }
        if (guardianEmail === student.guardianEmail) {
            toast.success("Email is already up-to-date.");
            return;
        }
        if (!password) {
            toast.error("Password is required.");
            return;
        }
        onGuardianEmailUpdate(guardianEmail, password);
        setPassword('');
    };

    const handlePasswordUpdate = () => {
        if(newPassword.length < 8){
            toast.error("Password must be at least 8 characters long.");
            return;
        }
        if (!oldPassword) {
            toast.error("Old password is required.");
            return;
        }
        if (!newPassword) {
            toast.error("New password is required.");
            return;
        }
        if (!confirmPassword) {
            toast.error("Confirm password is required.");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }
        onPasswordUpdate(oldPassword, newPassword);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h2 className=" font-semibold text-gray-800 mb-4">Account Settings</h2>
            {/* Update Email Section */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Update Email</h3>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Current Password"
                />
                <button
                    onClick={handleEmailUpdate}
                    className="mt-2 bg-red-600 text-white py-2 rounded w-full hover:bg-red-700 transition"
                >
                    Update Email
                </button>
            </div>
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Update Guardian Email</h3>
                <input
                    type="email"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Current Password"
                />
                <button
                    onClick={handleGuardianEmailUpdate}
                    className="mt-2 bg-red-600 text-white py-2 rounded w-full hover:bg-red-700 transition"
                >
                    Update Guardian Email
                </button>
            </div>

            {/* Update Password Section */}
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Update Password</h3>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Old Password"
                />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="New Password"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Confirm New Password"
                />
                <button
                    onClick={handlePasswordUpdate}
                    className="mt-2 bg-red-600 text-white py-2 rounded w-full hover:bg-red-700 transition"
                >
                    Update Password
                </button>
            </div>
        </div>
    );
};

export default AccountSettings;

// ./src/components/admin/settings/AcademicYear.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import API_URL from '../../../constants/api';
import toast from 'react-hot-toast';

const AcademicYear = () => {
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [semester, setSemester] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const years = Array.from({ length: 10 }, (_, i) => 2024 + i);
  const semesters = [
    { label: '1st Semester', value: '1st' },
    { label: '2nd Semester', value: '2nd' },
    { label: '3rd Semester', value: '3rd' },
    { label: '4th Semester', value: '4th' },
    { label: '5th Semester', value: '5th' },
  ];

  const fetchConfig = async () => {
    const res = await axios.get(`${API_URL}config`)
    const SY = res.data.config.SY;
    const startYear = SY.split(' ')[1];
    const endYear = SY.split(' ')[3];
    const semester = SY.split(' ')[4];

    setStartYear(startYear);
    setEndYear(endYear);
    setSemester(semester);
  }

  useEffect(()=>{
    fetchConfig()
  },[])

  const handleUpdate = async () => {
    try {
        if(adminPassword < 8) return toast.error('Password must be at least 8 characters long');
      const res = await axios.post(`${API_URL}config/update-sy`, {
        SY: `AY ${startYear} - ${endYear} ${semester} Semester`,
        password: adminPassword,
      }, {
        headers: {
            "Authorization": `${localStorage.getItem('authToken')}`
        }
      });
      toast.success(res.data.message);
      setAdminPassword('');
      setIsModalOpen(false);
    } catch (err) {
        toast.error(err.response.data.message || 'An error occurred');
      console.error(err);
    }
  }

  const handleStartYearChange = (e) => {
    const selectedYear = e.target.value;
    setStartYear(selectedYear);
    setEndYear(parseInt(selectedYear) + 1);
  };

  const handleEndYearChange = (e) => {
    const selectedYear = e.target.value;
    setEndYear(selectedYear);
    setStartYear(parseInt(selectedYear) - 1);
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setAdminPassword('');
  };

  const handlePasswordChange = (e) => {
    setAdminPassword(e.target.value);
  };

  const handleConfirm = () => {
    // Handle password confirmation logic here
    console.log("Admin password:", adminPassword);
    handleModalClose();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Academic Year</h2>
      <p className="text-sm text-red-500 mt-2">
        Changing school year will invalidate all student accounts. Proceed with caution.
      </p>
      
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Year</label>
          <select
            value={startYear}
            onChange={handleStartYearChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Start Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">End Year</label>
          <select
            value={endYear}
            onChange={handleEndYearChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select End Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Semester</label>
          <select
            value={semester}
            onChange={handleSemesterChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem.value} value={sem.value}>{sem.label}</option>
            ))}
          </select>
        </div>
      </div>
       {
        !isModalOpen && (
            <button
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={handleButtonClick}
            >
                Change Academic Year
            </button>
        )
       }


      {/* Modal */}
      {isModalOpen && (
        
          <div className="bg-white p-6 rounded-md shadow-lg w-full mt-8">
            <h3 className="text-lg font-semibold">Confirm Action</h3>
            <p className="text-sm text-gray-600 mt-2">Please enter the admin password to proceed.</p>
            
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
                onClick={handleUpdate}
              >
                Confirm
              </button>
            </div>
          </div>
        
      )}
    </div>
  );
};

export default AcademicYear;

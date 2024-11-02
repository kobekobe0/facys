import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_URL from '../constants/api';
import StudentProfile from '../components/admin/student/StudentProfile';
import LogsTab from '../components/admin/student/LogsTab';
import ScheduleTab from '../components/admin/student/ScheduleTab';
import StudentSettings from '../components/admin/student/StudentSettings';

function StudentId() {
  const [student, setStudent] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('logs');
  const { id } = useParams();

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`${API_URL}student/student/${id}`);
      setStudent(res.data);
    } catch (err) {
      setNotFound(true);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (notFound) {
    return (
      <div className="flex items-center justify-center h-full w-full text-gray-500">
        No Student Found
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-8">
      <div className="flex justify-between items-center my-6">
        <h2 className="text-lg text-gray-700 font-semibold">Student Profile</h2>
      </div>
      <div className="flex gap-6">
        <StudentProfile student={student} />
        <div className="flex flex-col w-full rounded-lg p-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 mb-4">
            {['logs', 'schedule', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 transition-all duration-150 ease-in-out text-sm font-medium rounded-t ${
                  activeTab === tab
                    ? 'border-b-2 border-red-500 text-red-600'
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-grow w-full overflow-y-auto text-gray-600">
            {activeTab === 'logs' && <LogsTab studentId={id} />}
            {activeTab === 'schedule' && <ScheduleTab schedule={student?.schedule || []} />}
            {activeTab === 'settings' && <StudentSettings student={student} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentId;

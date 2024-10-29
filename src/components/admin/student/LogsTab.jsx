import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../../constants/api';

function LogsTab({ studentId }) {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    totalDocs: 0,
    totalPages: 0,
    page: 1,
    limit: 50,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit: limit || 50,
        startDate: dateRange.start || '',
        endDate: dateRange.end || '',
      });
      const res = await axios.get(`${API_URL}log/student/${studentId}?${query}`);
      const { docs, totalDocs, totalPages, hasNextPage, hasPrevPage } = res.data;
      setLogs(docs);
      setPagination({
        totalDocs,
        totalPages,
        page,
        limit,
        hasNextPage,
        hasPrevPage,
      });
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [studentId, limit, dateRange]);

  const handlePageChange = (newPage) => {
    fetchLogs(newPage);
  };

  return (
    <div className="flex flex-col w-full bg-white shadow-lg rounded-lg p-6 space-y-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Logs</h3>
      
      {/* Filter Controls */}
      <div className="flex space-x-6 items-center mb-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Records per page</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Start Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">End Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table Container with Fixed Height */}
      <div className="overflow-y-auto h-96 border rounded-lg">
      <table className="w-full text-left">
  <thead>
    <tr className="bg-gray-100">
      <th className="p-3 font-medium text-gray-700">Student Number</th>
      <th className="p-3 font-medium text-gray-700">Department</th>
      <th className="p-3 font-medium text-gray-700">Section</th>
      <th className="p-3 font-medium text-gray-700">Date</th>
      <th className="p-3 font-medium text-gray-700">Time In</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      <tr>
        <td colSpan="5" className="p-3 text-center text-gray-500">
          Loading logs...
        </td>
      </tr>
    ) : logs.length > 0 ? (
      logs.map((log) => {
        const date = new Date(log.timeIn);
        
        // Format for date as a string
        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', optionsDate); // e.g., "October 29, 2024"

        // Format for time
        const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true }; // 12-hour format
        const formattedTime = date.toLocaleTimeString([], optionsTime); // e.g., "10:30 AM"

        return (
          <tr key={log._id} className="hover:bg-gray-50 border-b">
            <td className="p-3">{log.studentID.studentNumber}</td>
            <td className="p-3">{log.studentID.department}</td>
            <td className="p-3">{log.studentID.section}</td>
            <td className="p-3">{formattedDate}</td>
            <td className="p-3">{formattedTime}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="5" className="p-3 text-center text-gray-500">
          No logs available
        </td>
      </tr>
    )}
  </tbody>
</table>

      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={!pagination.hasPrevPage}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            pagination.hasPrevPage ? 'text-indigo-500' : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-500">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={!pagination.hasNextPage}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            pagination.hasNextPage ? 'text-indigo-500' : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default LogsTab;

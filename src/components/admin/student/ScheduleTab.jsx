import React from 'react';

function ScheduleTab({ schedule }) {
  return (
    <div className="flex flex-col w-full bg-white shadow-lg rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Schedule</h3>

      {/* Table Container */}
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-medium text-gray-700">Schedule</th>
              <th className="p-3 font-medium text-gray-700">Subject</th>
              <th className="p-3 font-medium text-gray-700">Code</th>
              <th className="p-3 font-medium text-gray-700">Professor</th>
              <th className="p-3 font-medium text-gray-700">Section</th>
              <th className="p-3 font-medium text-gray-700">Second Schedule</th>
            </tr>
          </thead>
          <tbody>
            {schedule.length > 0 ? (
              schedule.map((entry, index) => (
                <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                  <td className="p-3">{entry[0]}</td>
                  <td className="p-3">{entry[1]}</td>
                  <td className="p-3">{entry[2]}</td>
                  <td className="p-3">{entry[3]}</td>
                  <td className="p-3">{entry[4]}</td>
                  <td className="p-3">{entry[5] || 'N/A'}</td> {/* Handle optional second schedule */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  No schedule available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScheduleTab;

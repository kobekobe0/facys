import React from 'react';
import abbreviate from '../../../helper/abbreviate';

function StudentProfile({ student }) {
  return (
    <div className="flex flex-col bg-white my-4 mx-2 w-fit px-12 shadow-md p-6 rounded-lg items-start transition duration-200 ease-in-out transform hover:shadow-xl">
      <div className="flex flex-col gap-4">
        <h1 className="text-lg text-gray-700 mb-2">Student Profile</h1>
        <div className='flex items-center w-full justify-start my-4 '>
            <img src="https://placehold.co/150" alt="Profile Picture" className='w-56 h-56 object-cover self-center rounded-md shadow-md' />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {student?.name || 'N/A'}
        </h2>
        <div className="text-sm text-gray-500 flex items-center gap-3">
          <span className="font-medium">{student?.studentNumber || 'N/A'}</span>
          <span className={`${student?.updated ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} px-3 py-0.5 rounded-full text-xs`}>
            {student?.updated ? 'Up-to-date' : 'Out-of-date'}
          </span>
        </div>

        <div className="text-sm text-gray-700 mt-4">
          <h3 className="text-xs text-gray-500 uppercase">COR Academic Year</h3>
          <p>{student?.SY || 'unavailable'}</p>
        </div>

        <div className="text-sm text-gray-700 mt-4">
          <h3 className="text-xs text-gray-500 uppercase">Section</h3>
          <p>{student?.section || 'No Section'}</p>
        </div>

        <div className="text-sm text-gray-700">
          <h3 className="text-xs text-gray-500 uppercase">Department</h3>
          <p>{student?.department ? abbreviate(student.department) : 'No Department'}</p>
        </div>

        <div className="text-sm text-gray-700">
          <h3 className="text-xs text-gray-500 uppercase">Email</h3>
          <p>{student?.email || 'No Email'}</p>
        </div>

        <div className="text-sm text-gray-700">
          <h3 className="text-xs text-gray-500 uppercase">Cellphone</h3>
          <p>{student?.cellphone || 'No Cellphone'}</p>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;

import React, { useState } from 'react'
import FaceCapture from '../components/admin/scan/FaceCapture';
import axios from 'axios';
import API_URL from '../constants/api';
import toast from 'react-hot-toast';

function FaceRecognition() {
    const [start, setStart] = useState(false);
    const [student, setStudent] = useState(null);

    const handleSend = async (faceData) => {
        const res = await axios.post(`${API_URL}face/scan`, {
            faceData
        }).then(res => {
            setStudent(res.data.student);
            toast.success('Student found');
        }).catch(err => {
            toast.error(err.response.data.message);
        });
    }
    return (
        <div className='flex p-8 flex-col h-full'>
            <div className='w-full justify-between flex items-center'>
                <h1 className='text-xl font-semibold'>Face Recognition</h1>
                {
                    start && (
                        <div className='text-sm'>
                            <button onClick={() => setStart(!start)} className='p-2 bg-red-500 rounded text-white text-xs'>Stop Recognition</button>
                            
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between items-start mt-8 gap-4 w-full h-full'>
                <div className='w-2/3 p-4 h-full rounded'>
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
                            <FaceCapture start={start} handleSend={handleSend} /> 
                        )
                    }
                </div>
                <div className='w-1/3'>
                    <h2 className='my-4 font-medium'>Student Details</h2>
                    <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <tbody className="text-gray-600 text-sm font-light">
                        
                            <tr className="border-b border-gray-200">
                            <td className="py-3 px-6 bg-gray-200 font-semibold text-left">Student Number</td>
                            <td className="py-3 px-6 text-left">{student?.studentNumber || 'N/A'}</td>
                            </tr>
                        
                        
                            <tr className="border-b border-gray-200">
                            <td className="py-3 px-6 bg-gray-200 font-semibold text-left">Name</td>
                            <td className="py-3 px-6 text-left">{student?.name || 'N/A'}</td>
                            </tr>
    
                            <tr className="border-b border-gray-200">
                            <td className="py-3 px-6 bg-gray-200 font-semibold text-left">Date of Birth</td>
                            <td className="py-3 px-6 text-left">{student?.dateOfBirth || 'N/A'}</td>
                            </tr>
 
       
                            <tr className="border-b border-gray-200">
                            <td className="py-3 px-6 bg-gray-200 font-semibold text-left">Degree</td>
                            <td className="py-3 px-6 text-left">{student?.degree || 'N/A'}</td>
                            </tr>
       
                            <tr className="border-b border-gray-200">
                            <td className="py-3 px-6 bg-gray-200 font-semibold text-left">Department</td>
                            <td className="py-3 px-6 text-left">{student?.department || 'N/A'}</td>
                            </tr>

                            <tr className="border-b border-gray-200">
                            <td className="py-3 px-6 bg-gray-200 font-semibold text-left">Section</td>
                            <td className="py-3 px-6 text-left">{student?.section || 'N/A'}</td>
                            </tr>

                            <tr className="border-b border-gray-200">
                            <td className="py-3 px-6 bg-gray-200 font-semibold text-left">School Year</td>
                            <td className="py-3 px-6 text-left">{student?.SY || 'N/A'}</td>
                            </tr>
      
                            <tr className="border-b border-gray-200">
                            <td className="py-3 px-6 bg-gray-200 font-semibold text-left">Year Level</td>
                            <td className="py-3 px-6 text-left">{student?.yearLevel || 'N/A'}</td>
                            </tr>
           
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FaceRecognition
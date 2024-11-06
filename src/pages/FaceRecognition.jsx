import React, { useEffect, useState } from 'react'
import FaceCapture from '../components/admin/scan/FaceCapture';
import axios from 'axios';
import API_URL from '../constants/api';
import toast from 'react-hot-toast';

function FaceRecognition() {
    const [start, setStart] = useState(false);
    const [student, setStudent] = useState(null);
    const [automatic, setAutomatic] = useState(false);

    const handleSend = async (faceData) => {
        const res = await axios.post(`${API_URL}face/scan`, {
            faceData
        }).then(res => {
            console.log(res.data);
            setStudent(res.data.student);
            toast.success('Student found');
        }).catch(err => {
            toast.error(err.response.data.message);
            setStudent(null)
        });
    }

    useEffect(()=> {
        if(!student) return
        if(automatic) {
            handleCreateLog();
        }
    },[student])

    const handleCreateLog = async () => {
        if(!student) return;

        const res = await axios.post(`${API_URL}log/`, {
            studentID: student._id
        }).then(res => {
            toast.success('Student log created');
            if(automatic) return 
            setStudent(null);
        }).catch(err => {
            if(automatic) return
            setStudent(null);
            toast.error(err.response.data.message);
        });
    }
    return (
        <div className='flex p-8 flex-col h-full'>
            <div className='w-full justify-between flex items-center'>
                <h1 className='text-xl font-semibold'>Face Recognition</h1>
                {
                    start && (
                        <div className='text-sm flex items-center gap-4'>
                            <label className="inline-flex gap-2 items-center cursor-pointer">
                                <span className="ms-3 text-xs text-gray-900 dark:text-gray-300">Automatic Logging</span>
                                <input type="checkbox" checked={automatic} onChange={() => setAutomatic(!automatic)} value="" className="sr-only peer"/>
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                            </label>
                            <button onClick={() => setStart(false)} className='p-2 bg-red-500 rounded text-white text-xs'>Stop Recognition</button>
                            
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
                            <FaceCapture start={start} handleSend={handleSend} setStudent={setStudent} /> 
                        )
                    }
                </div>
                <div className='w-1/3 h-fit'>
                    <h2 className='my-4 font-medium'>Student Details</h2>
                    <div className="overflow-x-auto h-full">
                        <table className="min-w-full bg-white border border-gray-300 h-full">
                            <tbody className="text-gray-600 text-sm font-light">
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-6 bg-gray-200 font-semibold text-left w-1/4">Student Number</td>
                                    <td className="py-3 px-6 text-left w-3/4 font-medium">{student?.studentNumber || 'N/A'}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-6 bg-gray-200 font-semibold text-left w-1/4">Name</td>
                                    <td className="py-3 px-6 text-left w-3/4 font-medium">{student?.name || 'N/A'}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-6 bg-gray-200 font-semibold text-left w-1/4">Date of Birth</td>
                                    <td className="py-3 px-6 text-left w-3/4 font-medium">{student?.dateOfBirth || 'N/A'}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-6 bg-gray-200 font-semibold text-left w-1/4">Degree</td>
                                    <td className="py-3 px-6 text-left w-3/4 font-medium">{student?.degree || 'N/A'}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-6 bg-gray-200 font-semibold text-left w-1/4">Department</td>
                                    <td className="py-3 px-6 text-left w-3/4 font-medium">{student?.department || 'N/A'}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-6 bg-gray-200 font-semibold text-left w-1/4">Section</td>
                                    <td className="py-3 px-6 text-left w-3/4 font-medium">{student?.section || 'N/A'}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-6 bg-gray-200 font-semibold text-left w-1/4">School Year</td>
                                    <td className="py-3 px-6 text-left w-3/4 font-medium">{student?.SY || 'N/A'}</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-6 bg-gray-200 font-semibold text-left w-1/4">Year Level</td>
                                    <td className="py-3 px-6 text-left w-3/4 font-medium">{student?.yearLevel || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='w-full flex mt-8 items-center justify-center'>
                        <button onClick={handleCreateLog} className={`p-2 w-full  text-white rounded text-sm ${!student || automatic ? 'bg-gray-500/30' : 'bg-red-600 hover:bg-red-700'} transition`} disabled={!student || automatic}>Create Student Log</button>
                    </div>
                    {
                        student && (
                            <img src={student?.pfp} alt="Student" className='w-[200px] h-[200px] object-cover mt-4' />
                        )
                    }
                    
                </div>


            </div>
        </div>
    )
}

export default FaceRecognition
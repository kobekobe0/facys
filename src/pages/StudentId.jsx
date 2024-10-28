import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Router } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import API_URL from '../constants/api';

function StudentId() {
    const [student, setStudent] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const id = useParams().id;
    const fetchStudent = async () => {
        const res = await axios.get(`${API_URL}student/student/${id}`).catch(err => setNotFound(true));
        setStudent(res.data);
    }

    useEffect(()=>{
        fetchStudent()
    },[id])
    if(notFound) return (
        <div className='w-full h-full flex items-center justify-center'>
            No Student Found
        </div>
    )
    return (
        <div className='flex items-start flex-col justify-between w-full'>
            <div className='w-1/3 flex items-center flex-col'>
                <div>
                    
                </div>

            </div>
        </div>
    )
}

export default StudentId
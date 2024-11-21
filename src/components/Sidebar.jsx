import React from 'react'
import swoosh from '../assets/logo.png'
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_URL from '../constants/api';

function Sidebar() {
    const navigate = useNavigate();

    const {id} = useParams();
    const links = [
        {
            name: 'Dashboard',
            path: '/admin',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 16a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 16a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/></svg>
        },
        {
            name: 'Face Recognition',
            path: '/admin/scan',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M9 11.75A1.25 1.25 0 0 0 7.75 13A1.25 1.25 0 0 0 9 14.25A1.25 1.25 0 0 0 10.25 13A1.25 1.25 0 0 0 9 11.75m6 0A1.25 1.25 0 0 0 13.75 13A1.25 1.25 0 0 0 15 14.25A1.25 1.25 0 0 0 16.25 13A1.25 1.25 0 0 0 15 11.75M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a4 4 0 0 1 0-.86a10.05 10.05 0 0 0 5.26-5.37A9.99 9.99 0 0 0 17.42 10c.76 0 1.51-.09 2.25-.26c1.25 4.26-1.17 8.69-5.41 9.93c-.76.22-1.5.33-2.26.33M0 2a2 2 0 0 1 2-2h4v2H2v4H0zm24 20a2 2 0 0 1-2 2h-4v-2h4v-4h2zM2 24a2 2 0 0 1-2-2v-4h2v4h4v2zM22 0a2 2 0 0 1 2 2v4h-2V2h-4V0z"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M9 11.75A1.25 1.25 0 0 0 7.75 13A1.25 1.25 0 0 0 9 14.25A1.25 1.25 0 0 0 10.25 13A1.25 1.25 0 0 0 9 11.75m6 0A1.25 1.25 0 0 0 13.75 13A1.25 1.25 0 0 0 15 14.25A1.25 1.25 0 0 0 16.25 13A1.25 1.25 0 0 0 15 11.75M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a4 4 0 0 1 0-.86a10.05 10.05 0 0 0 5.26-5.37A9.99 9.99 0 0 0 17.42 10c.76 0 1.51-.09 2.25-.26c1.25 4.26-1.17 8.69-5.41 9.93c-.76.22-1.5.33-2.26.33M0 2a2 2 0 0 1 2-2h4v2H2v4H0zm24 20a2 2 0 0 1-2 2h-4v-2h4v-4h2zM2 24a2 2 0 0 1-2-2v-4h2v4h4v2zM22 0a2 2 0 0 1 2 2v4h-2V2h-4V0z"/></svg>
        },
        {
            name: 'Student Logs',
            path: '/admin/logs',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="black" fillRule="evenodd" d="M3.586 2.586C3 3.172 3 4.114 3 6v10c0 2.828 0 4.243.879 5.121c.641.642 1.568.815 3.121.862V19a1 1 0 1 1 2 0v3h6v-3a1 1 0 1 1 2 0v2.983c1.553-.047 2.48-.22 3.121-.862C21 20.243 21 18.828 21 16V6c0-1.886 0-2.828-.586-3.414C19.828 2 18.886 2 17 2H7c-1.886 0-2.828 0-3.414.586M8 8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2zm0 6h8a1 1 0 1 0 0-2H8a1 1 0 1 0 0 2" clipRule="evenodd"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" fillRule="evenodd" d="M3.586 2.586C3 3.172 3 4.114 3 6v10c0 2.828 0 4.243.879 5.121c.641.642 1.568.815 3.121.862V19a1 1 0 1 1 2 0v3h6v-3a1 1 0 1 1 2 0v2.983c1.553-.047 2.48-.22 3.121-.862C21 20.243 21 18.828 21 16V6c0-1.886 0-2.828-.586-3.414C19.828 2 18.886 2 17 2H7c-1.886 0-2.828 0-3.414.586M8 8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2zm0 6h8a1 1 0 1 0 0-2H8a1 1 0 1 0 0 2" clipRule="evenodd"/></svg>
        },
        {
            name: 'Students',
            path: '/admin/students',
            icon:<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 256 256"><path fill="black" d="m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120m-48-32.43L57.3 64L128 40.43L198.7 64Z"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 256 256"><path fill="white" d="m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120m-48-32.43L57.3 64L128 40.43L198.7 64Z"/></svg>
        },
        {
            name: 'Visitor Logs',
            path: '/admin/visitor-logs',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 12h8m-8 6h8M13 6h8M3 12h1m-1 6h1M3 6h1m4 6h1m-1 6h1M8 6h1"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 12h8m-8 6h8M13 6h8M3 12h1m-1 6h1M3 6h1m4 6h1m-1 6h1M8 6h1"/></svg>
        },
        {
            name: 'Visitors',
            path: '/admin/visitors',
            icon:<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path fill="currentColor" d="M4 5.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0M5.5 3a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5m5 3a1 1 0 1 1 2 0a1 1 0 0 1-2 0m1-2a2 2 0 1 0 0 4a2 2 0 0 0 0-4m-10 6.5A1.5 1.5 0 0 1 3 9h5a1.5 1.5 0 0 1 1.5 1.5v.112a1 1 0 0 1-.01.137a2.85 2.85 0 0 1-.524 1.342C8.419 12.846 7.379 13.5 5.5 13.5s-2.918-.654-3.467-1.409a2.85 2.85 0 0 1-.523-1.342a2 2 0 0 1-.01-.137zm1 .09v.007l.004.049a1.85 1.85 0 0 0 .338.857c.326.448 1.036.997 2.658.997s2.332-.549 2.658-.997a1.85 1.85 0 0 0 .338-.857l.004-.05V10.5A.5.5 0 0 0 8 10H3a.5.5 0 0 0-.5.5zm9 1.91c-.588 0-1.07-.09-1.46-.238a4 4 0 0 0 .361-.932c.268.101.624.17 1.099.17c1.119 0 1.578-.382 1.78-.666a1.2 1.2 0 0 0 .218-.56l.002-.028a.25.25 0 0 0-.25-.246h-2.8A2.5 2.5 0 0 0 10 9h3.25c.69 0 1.25.56 1.25 1.25v.017a1 1 0 0 1-.008.109a2.2 2.2 0 0 1-.398 1.04c-.422.591-1.213 1.084-2.594 1.084"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path fill="currentColor" d="M4 5.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0M5.5 3a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5m5 3a1 1 0 1 1 2 0a1 1 0 0 1-2 0m1-2a2 2 0 1 0 0 4a2 2 0 0 0 0-4m-10 6.5A1.5 1.5 0 0 1 3 9h5a1.5 1.5 0 0 1 1.5 1.5v.112a1 1 0 0 1-.01.137a2.85 2.85 0 0 1-.524 1.342C8.419 12.846 7.379 13.5 5.5 13.5s-2.918-.654-3.467-1.409a2.85 2.85 0 0 1-.523-1.342a2 2 0 0 1-.01-.137zm1 .09v.007l.004.049a1.85 1.85 0 0 0 .338.857c.326.448 1.036.997 2.658.997s2.332-.549 2.658-.997a1.85 1.85 0 0 0 .338-.857l.004-.05V10.5A.5.5 0 0 0 8 10H3a.5.5 0 0 0-.5.5zm9 1.91c-.588 0-1.07-.09-1.46-.238a4 4 0 0 0 .361-.932c.268.101.624.17 1.099.17c1.119 0 1.578-.382 1.78-.666a1.2 1.2 0 0 0 .218-.56l.002-.028a.25.25 0 0 0-.25-.246h-2.8A2.5 2.5 0 0 0 10 9h3.25c.69 0 1.25.56 1.25 1.25v.017a1 1 0 0 1-.008.109a2.2 2.2 0 0 1-.398 1.04c-.422.591-1.213 1.084-2.594 1.084"/></svg>
        },
        {
            name: 'Blocked Students',
            path: '/admin/blocklist',
            icon:<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="black" strokeWidth="2"><rect width="14" height="17" x="5" y="4" rx="2"/><path strokeLinecap="round" d="M9 9h6m-6 4h6m-6 4h4"/></g></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" fillRule="evenodd" d="M16.5 15.75a2.75 2.75 0 0 0-2.383 4.123l3.756-3.756a2.735 2.735 0 0 0-1.373-.367m2.42 1.442l-3.728 3.728a2.75 2.75 0 0 0 3.728-3.728M12.25 18.5a4.25 4.25 0 1 1 8.5 0a4.25 4.25 0 0 1-8.5 0" clipRule="evenodd"/><path fill="white" d="M16 6a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-1.705 7.188A5.752 5.752 0 0 0 11.938 22C4 21.99 4 19.979 4 17.5c0-2.485 3.582-4.5 8-4.5c.798 0 1.568.066 2.295.188"/></svg>
        },
        {
            name: 'Outdated Students',
            path: '/admin/outdated',
            icon:<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="black" strokeWidth="2"><rect width="14" height="17" x="5" y="4" rx="2"/><path strokeLinecap="round" d="M9 9h6m-6 4h6m-6 4h4"/></g></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" fillRule="evenodd" d="M16.5 15.75a2.75 2.75 0 0 0-2.383 4.123l3.756-3.756a2.735 2.735 0 0 0-1.373-.367m2.42 1.442l-3.728 3.728a2.75 2.75 0 0 0 3.728-3.728M12.25 18.5a4.25 4.25 0 1 1 8.5 0a4.25 4.25 0 0 1-8.5 0" clipRule="evenodd"/><path fill="white" d="M16 6a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-1.705 7.188A5.752 5.752 0 0 0 11.938 22C4 21.99 4 19.979 4 17.5c0-2.485 3.582-4.5 8-4.5c.798 0 1.568.066 2.295.188"/></svg>
        },
        {
            name: 'Archived Accounts',
            path: '/admin/archived',
            icon:<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M0 4.6A2.6 2.6 0 0 1 2.6 2h18.8A2.6 2.6 0 0 1 24 4.6v.8A2.6 2.6 0 0 1 21.4 8h-.486L20 18.6c0 1.33-1.07 2.4-2.4 2.4H6.4C5.07 21 4 19.93 4 18.6L3.086 8H2.6A2.6 2.6 0 0 1 0 5.4zM2.6 4a.6.6 0 0 0-.6.6v.8a.6.6 0 0 0 .6.6h18.8a.6.6 0 0 0 .6-.6v-.8a.6.6 0 0 0-.6-.6zM15 9H9V7H7v2.2A1.8 1.8 0 0 0 8.8 11h6.4A1.8 1.8 0 0 0 17 9.2V7h-2z" clip-rule="evenodd"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M0 4.6A2.6 2.6 0 0 1 2.6 2h18.8A2.6 2.6 0 0 1 24 4.6v.8A2.6 2.6 0 0 1 21.4 8h-.486L20 18.6c0 1.33-1.07 2.4-2.4 2.4H6.4C5.07 21 4 19.93 4 18.6L3.086 8H2.6A2.6 2.6 0 0 1 0 5.4zM2.6 4a.6.6 0 0 0-.6.6v.8a.6.6 0 0 0 .6.6h18.8a.6.6 0 0 0 .6-.6v-.8a.6.6 0 0 0-.6-.6zM15 9H9V7H7v2.2A1.8 1.8 0 0 0 8.8 11h6.4A1.8 1.8 0 0 0 17 9.2V7h-2z" clip-rule="evenodd"/></svg>
        },
        {
            name: 'Settings',
            path: '/admin/settings',
            icon:<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 12c0-.568-.061-1.122-.174-1.656l1.834-1.612l-2-3.464l-2.322.786a8 8 0 0 0-2.859-1.657L14 2h-4l-.479 2.396a8 8 0 0 0-2.859 1.657L4.34 5.268l-2 3.464l1.834 1.612a8 8 0 0 0 0 3.312L2.34 15.268l2 3.464l2.322-.786a8 8 0 0 0 2.859 1.657L10 22h4l.479-2.396a8 8 0 0 0 2.859-1.657l2.322.786l2-3.464l-1.834-1.612A8 8 0 0 0 20 12m-8 4a4 4 0 1 1 0-8a4 4 0 0 1 0 8"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M20 12c0-.568-.061-1.122-.174-1.656l1.834-1.612l-2-3.464l-2.322.786a8 8 0 0 0-2.859-1.657L14 2h-4l-.479 2.396a8 8 0 0 0-2.859 1.657L4.34 5.268l-2 3.464l1.834 1.612a8 8 0 0 0 0 3.312L2.34 15.268l2 3.464l2.322-.786a8 8 0 0 0 2.859 1.657L10 22h4l.479-2.396a8 8 0 0 0 2.859-1.657l2.322.786l2-3.464l-1.834-1.612A8 8 0 0 0 20 12m-8 4a4 4 0 1 1 0-8a4 4 0 0 1 0 8"/></svg>
        },
    ]

    const handleLogout = async () => {
        const token = localStorage.getItem('authToken');
        //delete token
        localStorage.removeItem('authToken');
        navigate('/signin');

    }

  return (
<div className='p-4 flex flex-col h-screen bg-red-950'>
    <div>
        <div className='flex items-center mb-8 p-2'>
            <img src={swoosh} alt="logo" width={50} />
            <div className='flex items-start ml-4 flex-col'>
                <h2 className='font-bold text-white text-lg m-0'>BulSU Bustos Facys</h2>
                <p className='font-normal text-white text-sm m-0'>Face Recognition System</p>
            </div>
        </div>
        <ul className='gap-2 flex flex-col'>
            {links.map((link, index) => (
                <Link to={link.path} key={index} className={`ease-in-out duration-150 px-3 py-2 gap-2 rounded-md flex items-center ${location.pathname === link.path ? 'bg-white shadow-md text-black' : 'text-white hover:bg-white hover:shadow-md hover:text-black'}`}>
                    {
                        location.pathname === link.path ? link.icon : link.iconWhite
                    }
                    <p >{link.name}</p>
                </Link>
            ))}
        </ul>
    </div>  
    <div className='text-center flex justify-end h-full flex-col text-white'>
        <button onClick={handleLogout} className='bg-red-900 mb-4 px-1 p-2 hover:bg-red-700 duration-105 rounded-sm text-sm transition-all flex items-center justify-center gap-2'><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="m16.56 5.44l-1.45 1.45A5.97 5.97 0 0 1 18 12a6 6 0 0 1-6 6a6 6 0 0 1-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 5.44A7.96 7.96 0 0 0 4 12a8 8 0 0 0 8 8a8 8 0 0 0 8-8c0-2.72-1.36-5.12-3.44-6.56M13 3h-2v10h2"/></svg>Logout</button>
        <h2 className='text-xs font-medium'>© 2024 | BulSU Bustos Facys Team</h2>
    </div>
</div>
  )
}

export default Sidebar
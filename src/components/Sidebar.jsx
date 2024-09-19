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
            name: 'Census',
            path: '/census',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="black" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7"/></svg>
        },
        {
            name: 'Barangay Forms',
            path: '/forms',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path fill="black" d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5L8 5.961L14.154 3.5zm3.25 1.7l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" fillRule="evenodd" d="M3.586 2.586C3 3.172 3 4.114 3 6v10c0 2.828 0 4.243.879 5.121c.641.642 1.568.815 3.121.862V19a1 1 0 1 1 2 0v3h6v-3a1 1 0 1 1 2 0v2.983c1.553-.047 2.48-.22 3.121-.862C21 20.243 21 18.828 21 16V6c0-1.886 0-2.828-.586-3.414C19.828 2 18.886 2 17 2H7c-1.886 0-2.828 0-3.414.586M8 8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2zm0 6h8a1 1 0 1 0 0-2H8a1 1 0 1 0 0 2" clipRule="evenodd"/></svg>
        },
        {
            name: 'Residents',
            path: '/residents',
            icon:<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="black" strokeWidth="2"><rect width="14" height="17" x="5" y="4" rx="2"/><path strokeLinecap="round" d="M9 9h6m-6 4h6m-6 4h4"/></g></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 15 15"><path fill="white" fillRule="evenodd" d="M0 3.5A1.5 1.5 0 0 1 1.5 2h12A1.5 1.5 0 0 1 15 3.5v8a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 0 11.5zM3 6a2 2 0 1 1 4 0a2 2 0 0 1-4 0m9 0H9V5h3zm0 3H9V8h3zM5 9a2.927 2.927 0 0 0-2.618 1.618l-.33.658A.5.5 0 0 0 2.5 12h5a.5.5 0 0 0 .447-.724l-.329-.658A2.927 2.927 0 0 0 5 9" clipRule="evenodd"/></svg>
        },
        {
            name: 'Block List',
            path: '/blocklist',
            icon:<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="black" strokeWidth="2"><rect width="14" height="17" x="5" y="4" rx="2"/><path strokeLinecap="round" d="M9 9h6m-6 4h6m-6 4h4"/></g></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" fillRule="evenodd" d="M16.5 15.75a2.75 2.75 0 0 0-2.383 4.123l3.756-3.756a2.735 2.735 0 0 0-1.373-.367m2.42 1.442l-3.728 3.728a2.75 2.75 0 0 0 3.728-3.728M12.25 18.5a4.25 4.25 0 1 1 8.5 0a4.25 4.25 0 0 1-8.5 0" clipRule="evenodd"/><path fill="white" d="M16 6a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-1.705 7.188A5.752 5.752 0 0 0 11.938 22C4 21.99 4 19.979 4 17.5c0-2.485 3.582-4.5 8-4.5c.798 0 1.568.066 2.295.188"/></svg>
        },
        {
            name: 'Indigent',
            path: '/indigent',
            icon:<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="black" strokeWidth="2"><rect width="14" height="17" x="5" y="4" rx="2"/><path strokeLinecap="round" d="M9 9h6m-6 4h6m-6 4h4"/></g></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 14 14"><path fill="white" fillRule="evenodd" d="M9.03.22a.75.75 0 1 0-1.06 1.06l.72.72H6.5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h2.875V3.5a.625.625 0 1 1 1.25 0V8H13.5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-2.19l.72-.72A.75.75 0 0 0 10.97.22l-.97.97zM1.843 7H0v4l1.828 1.828A4 4 0 0 0 4.657 14H10.5a1.5 1.5 0 0 0 0-3H7.723a2.11 2.11 0 0 1-3.515.892l-1.45-1.45a.625.625 0 1 1 .884-.884l1.45 1.45a.86.86 0 0 0 1.306-1.11L4.672 8.172A4 4 0 0 0 1.843 7" clipRule="evenodd"/></svg>
        },
        {
            name: 'Business',
            path: '/business',
            icon:<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="black" strokeWidth="2"><rect width="14" height="17" x="5" y="4" rx="2"/><path strokeLinecap="round" d="M9 9h6m-6 4h6m-6 4h4"/></g></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="M5 6h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1m15.16 1.8c-.09-.46-.5-.8-.98-.8H4.82c-.48 0-.89.34-.98.8l-1 5c-.12.62.35 1.2.98 1.2H4v5c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-5h4v5c0 .55.45 1 1 1s1-.45 1-1v-5h.18c.63 0 1.1-.58.98-1.2zM12 18H6v-4h6z"/></svg>
        },
        {
            name: 'Receipts',
            path: '/receipts',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="black" d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="M19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11z" opacity="0.3"/><path fill="white" d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2L7.5 3.5L6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2zM19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11z"/><path fill="white" d="M9 7h6v2H9zm7 0h2v2h-2zm-7 3h6v2H9zm7 0h2v2h-2z"/></svg>
        },
        {
            name: 'Cedula',
            path: '/cedula',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="black" d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M8.487 21h7.026a4 4 0 0 0 3.808-5.224l-1.706-5.306A5 5 0 0 0 12.855 7h-1.71a5 5 0 0 0-4.76 3.47l-1.706 5.306A4 4 0 0 0 8.487 21M15 3q-1 4-3 4T9 3z"/><path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H10m2-7v1m0 6v1"/></g></svg>
        },
        {
            name: 'Patrol',
            path: '/borrow',
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="black" d="m9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75l-2.575 1.95q.025.175.025.338v.674q0 .163-.05.338l2.575 1.95l-2.75 4.75l-2.95-1.25q-.275.2-.575.375t-.6.3l-.4 3.2zm2.8-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"/></svg>,
            iconWhite: <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 256 256"><path fill="white" d="M240 104h-10.8l-27.78-62.5A16 16 0 0 0 186.8 32H69.2a16 16 0 0 0-14.62 9.5L26.8 104H16a8 8 0 0 0 0 16h8v80a16 16 0 0 0 16 16h24a16 16 0 0 0 16-16v-8h96v8a16 16 0 0 0 16 16h24a16 16 0 0 0 16-16v-80h8a8 8 0 0 0 0-16M80 152H56a8 8 0 0 1 0-16h24a8 8 0 0 1 0 16m120 0h-24a8 8 0 0 1 0-16h24a8 8 0 0 1 0 16M44.31 104L69.2 48h117.6l24.89 56Z"/></svg>
        },
    ]

    const onShutdown = async () => {
        const isConfirmed = window.confirm('Are you sure you want to shutdown?')
        if (!isConfirmed) return
        try{
            const reponse = await axios.post(`${API_URL}shutdown`)
            toast.success(reponse.data.message)
        } catch (error) {
            toast.error('Failed to shutdown')
        }
    }

    const onBackup = async () => {
        const isConfirmed = window.confirm('Are you sure you want to backup? This will take some time to finish.')
        if (!isConfirmed) return
        toast.loading('Backing up...')
        try{
            const reponse = await axios.post(`${API_URL}backup`)
            toast.dismiss()
            toast.success(reponse.data.message)
        } catch (error) {
            toast.dismiss()
            toast.error('Failed to backup')
        }
    }

  return (
<div className='p-4 flex flex-col h-screen bg-red-950'>
    <div>
        <div className='flex items-center mb-8 p-2'>
            <img src={swoosh} alt="logo" width={50} />
            <div className='flex items-start ml-4 flex-col'>
                <h2 className='font-bold text-white text-xl m-0'>Cacarong Matanda</h2>
                <p className='font-normal text-white text-sm m-0'>Monitoring System</p>
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
    <div className='text-center flex justify-end h-full flex-col'>
        <button onClick={onBackup} className='bg-red-900 mb-4 px-1 p-2 hover:bg-blue-700 duration-105 rounded-sm text-sm transition-all flex items-center justify-center gap-2'><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="m19.21 12.04l-1.53-.11l-.3-1.5A5.484 5.484 0 0 0 12 6C9.94 6 8.08 7.14 7.12 8.96l-.5.95l-1.07.11A3.99 3.99 0 0 0 2 14c0 2.21 1.79 4 4 4h13c1.65 0 3-1.35 3-3c0-1.55-1.22-2.86-2.79-2.96m-5.76.96v3h-2.91v-3H8l4-4l4 4z" opacity="0.3"/><path fill="white" d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96M19 18H6c-2.21 0-4-1.79-4-4c0-2.05 1.53-3.76 3.56-3.97l1.07-.11l.5-.95A5.469 5.469 0 0 1 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5l1.53.11A2.98 2.98 0 0 1 22 15c0 1.65-1.35 3-3 3M8 13h2.55v3h2.9v-3H16l-4-4z"/></svg>Backup</button>
        <button onClick={onShutdown} className='bg-red-900 mb-4 px-1 p-2 hover:bg-red-700 duration-105 rounded-sm text-sm transition-all flex items-center justify-center gap-2'><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="m16.56 5.44l-1.45 1.45A5.97 5.97 0 0 1 18 12a6 6 0 0 1-6 6a6 6 0 0 1-6-6c0-2.17 1.16-4.06 2.88-5.12L7.44 5.44A7.96 7.96 0 0 0 4 12a8 8 0 0 0 8 8a8 8 0 0 0 8-8c0-2.72-1.36-5.12-3.44-6.56M13 3h-2v10h2"/></svg>Shutdown</button>
        <h2 className='text-xs font-medium'>© 2024 | Cacarong Matanda</h2>
    </div>
</div>
  )
}

export default Sidebar
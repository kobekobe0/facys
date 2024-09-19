import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import API_URL from '../../constants/api'
import { Link } from 'react-router-dom'
import NonResidentOwner from './NonResidentOwner'


const ResidentSelector = ({ setOpen, setSelectedResident, manualOption }) => {
    const [searchResults, setSearchResults] = useState([])
    const [nonResident, setNonResident] = useState(false)
    const [searchQuery, setSearchQuery] = useState({
        searchFirst: '',
        searchLast: '',
        searchMiddle: ''
    })

    const latestSearch = useRef(searchQuery);

    useEffect(() => {
        latestSearch.current = searchQuery;
    }, [searchQuery]);

    const handleQueryChange = (e) => {
        setSearchQuery({
            ...searchQuery,
            [e.target.name]: e.target.value
        })
    }

    const fetchResidents = useCallback(async () => {
        try {
            //setSearched(true);
            const params = new URLSearchParams(latestSearch.current).toString();

            if (Object.values(latestSearch.current).every(value => value === '')) {
                setSearchResults([]);
                return;
            }
            console.log(params)
            const response = await axios.get(`${API_URL}resident?${params}`);
            console.log(response.data.data)
            setSearchResults(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const debounceFetch = useCallback(debounce(fetchResidents, 500), []);

    useEffect(() => {
        debounceFetch();
    }, [searchQuery, debounceFetch]);

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start justify-between">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Select Resident
                                </h3>
                                <div className="mt-2 flex justify-between items-center w-full">
                                    <p className="text-sm text-gray-500">
                                        Select a resident to add a business
                                    </p>
                                    {
                                        manualOption !== undefined && 
                                            manualOption && (
                                                <button onClick={()=>setNonResident(true)} className='bg-blue-500 text-white px-2 py-1 text-xs rounded-md'>
                                                    Non-resident owner
                                                </button>
                                            )
                                        
                                    }
                                    
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#db0000" d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"/></g></svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 px-4 ">
                            <input type="text" className="w-full p-2 border border-gray-600 rounded-md" name="searchLast" onChange={handleQueryChange} placeholder="Last name" />
                            <input type="text" className="w-full p-2 border border-gray-600 rounded-md" name="searchFirst" onChange={handleQueryChange} placeholder="First name"/>
                            <input type="text" className="w-full p-2 border border-gray-600 rounded-md" name="searchMiddle" onChange={handleQueryChange} placeholder="Middle name"/>
                        </div>
                        <div className="mt-8 px-4 h-[45vh] overflow-y-scroll">
                            {
                                searchResults?.map(resident => (
                                    <div key={resident._id} className="flex border gap-4 p-4 w-full mb-4 rounded-lg hover:bg-gray-200 cursor-pointer" onClick={() => {
                                        setSelectedResident({
                                            ...resident,
                                            isResident: true
                                        })
                                        setOpen(false)
                                        }}
                                    >
                                        <div className="flex w-full justify-between items-center">
                                            <p className="font-medium text-gray-800 text-xl">{resident?.name?.last}, {resident?.name?.first} {resident?.name?.middle} {resident?.name?.suffix}</p>
                                            <p className=" text-gray-500 text-md">{resident?.address.streetName ? `${resident.address.streetName}` : null} {resident?.address.apartment ? `, ${resident?.address.apartment}` : null} {resident?.address.householdNumber ? `, ${resident?.address.householdNumber}` : null} {resident?.address.sitio ? `, ${resident?.address.sitio}` : null}</p>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                searchResults.length === 0 && (
                                    <div className="flex justify-center items-center h-32 flex-col">
                                        <p className="text-gray-500">No results found</p>
                                        <p>Resident not registered? <Link className='text-blue-800' to='/residents' target='_blank'>Add here</Link></p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            {
                nonResident && (
                    <NonResidentOwner setOpen={setOpen} setSelectedResident={setSelectedResident} setModal={setNonResident} />
                )
            }
        </div>
    )
}


export default ResidentSelector
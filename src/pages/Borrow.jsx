import { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../constants/api";
import ResidentSelector from "../components/business/ResidentSelector";
import AddForm from "../components/borrow/AddForm";
import ResidentFormModal from "../components/residents/ResidentFormModal";

const BusinessItem = ({ business, setOpenForm }) => {
    return (
        <div onClick={setOpenForm} className="border flex gap-4 p-4 w-full justify-between items-center mb-4 rounded-lg hover:bg-gray-200 cursor-pointer">
            <div className="flex flex-col justify-center">
                <p className="font-medium text-gray-800 text-xl flex items-center gap-4">{business?.vehicle || ''}</p>
                {
                    business?.isResident ? (
                        <p className=" text-gray-500 text-md flex items-center gap-2">{business?.residentID?.name?.last}, {business?.residentID?.name?.first} {business?.residentID?.name?.middle} {business?.residentID?.name?.suffix} <span className="text-sm font-normal"> - {business?.placeWent}</span></p>

                    ) : (
                        <p className=" text-gray-500 text-md flex items-center gap-2">{business?.nonResident?.name?.last}, {business?.nonResident?.name?.first} {business?.nonResident?.name?.middle} {business?.nonResident?.name?.suffix} <span className="text-sm font-normal"> - {business?.placeWent}</span></p>
                    )
                }
            </div>
            <div className="flex items-center gap-2">
                <p>{business?.dateBorrowed ? new Date(business?.dateBorrowed).toLocaleDateString('en-us', {year:'numeric', month: 'long', day:'2-digit', hour: '2-digit', minute: '2-digit'}) : ''}</p>
            </div>
        </div>
    )
}


const Borrow = () => {
    const [openModal, setOpenModal] = useState(false)
    const [businesses, setBusinesses] = useState([])
    const [openForm, setOpenForm] = useState(null)
    const [searchQuery, setSearchQuery] = useState({
        first: '',
        middle: '',
        last: '',
        vehicle: '',
    })
    const [statistics, setStatistics] = useState({
        activeBusinesses: 0,
        expiredBusinesses: 0,
        closedBusinesses: 0,
        totalBusinesses: 0
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

    const fetchForms = useCallback(async () => {
        try {
            const copy = { ...latestSearch.current };
            const params = new URLSearchParams(copy).toString();
            const response = await axios.get(`${API_URL}borrow?${params}`);
            //console.log(response.data.data)
            setBusinesses(response.data.borrows);
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

    const debounceFetch = useCallback(debounce(fetchForms, 500), []);

    useEffect(() => {
        debounceFetch();
    }, [searchQuery, debounceFetch]);

    return (
        <div className="flex gap-4 ml-64 p-8 w-full">
            <div className="flex flex-col w-2/5 h-fit">
                <AddForm />
            </div>
            <div className="shadow-lg flex w-3/5">
                <div className="flex flex-col p-8 w-full">
                    <h2 className="text-lg font-medium my-4">Vehicle Usage History</h2>
                    <hr className="mb-4"/>
                    <div className="flex gap-4 items-center justify-between w-full">
                        
                        <select name="vehicle" id="filter" className="p-2 border w-1/4" value={searchQuery?.vehicle} onChange={handleQueryChange}>
                            <option value="RescuePatrol">Barangay Rescue Patrol</option>
                            <option value="Ambulance">Barangay Ambulance</option>
                            <option value="">All</option>
                        </select> 
                        <div className="flex items-center gap-4 w-3/4">
                            <input type="text" placeholder="first name" className="p-2 border w-1/4" name="first" onChange={handleQueryChange} value={searchQuery.first}/>
                            <input type="text" placeholder="middle name" className="p-2 border w-1/4" name="middle" onChange={handleQueryChange} value={searchQuery.middle}/>
                            <input type="text" placeholder="last name" className="p-2 border w-1/4" name="last" onChange={handleQueryChange} value={searchQuery.last}/>
                        </div>
                    </div>
                    
                    <div className="overflow-y-auto h-[80vh] mt-4">
                        {
                            businesses.map(business => (
                                <BusinessItem key={business._id} business={business} setOpenForm={()=>setOpenForm(business)}/>
                            ))
                        }

                        {
                            businesses.length === 0 && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">No form found</p>
                                </div>
                            )
                        }
                        {
                            openForm !== null && (
                                <ResidentFormModal print={false} onClose={() => setOpenForm(null)} form={openForm}/>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Borrow
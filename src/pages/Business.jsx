import { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../constants/api";
import ResidentSelector from "../components/business/ResidentSelector";

const BusinessItem = ({ business }) => {
    return (
        <Link to={`${business._id}`} className="border flex gap-4 p-4 w-full justify-between items-center mb-4 rounded-lg hover:bg-gray-200 cursor-pointer">
            <div className="flex flex-col justify-center">
                <p className="font-medium text-gray-800 text-xl">{business?.businessName}</p>
                {
                    business?.isResident ? (
                        <p className=" text-gray-500 text-md">{business?.residentID?.name?.last}, {business?.residentID?.name?.first} {business?.residentID?.name?.middle} {business?.residentID?.name?.suffix}</p>

                    ) : (
                        <p className=" text-gray-500 text-md">{business?.nonResident?.name?.last}, {business?.nonResident?.name?.first} {business?.nonResident?.name?.middle} {business?.nonResident?.name?.suffix}</p>
                    )
                }
            </div>
            <div className="flex items-center gap-2">
                <p>{business?.natureOfBusiness}</p>
                <div className={`${business.isClosed ? 'bg-red-500' : business.isExpired ? 'bg-orange-500' : 'bg-green-500'} w-2 h-2 rounded-full`}></div>
            </div>
        </Link>
    )
}



const AddBusiness = () => {
    const [selectedResident, setSelectedResident] = useState(null)
    const [businessDetails, setBusinessDetails] = useState({
        businessName: '',
        natureOfBusiness: '',
        location: '',
        plateNumber: '',
        cellphoneNumber: '',
        isNew: false,
        amount: 0,
    })
    const navigate = useNavigate()
    const [openResidentSelector, setOpenResidentSelector] = useState(false)

    useEffect(() => {
        console.log(selectedResident)
    },[selectedResident])

    const handleQueryChange = (e) => {
        let value

        //check if true or false
        if (e.target.name === 'isNew') {
            value = e.target.value === 'true' ? true : false
        } else {
            value = e.target.value
        }

        setBusinessDetails({
            ...businessDetails,
            [e.target.name]: value
        })
    }

    const handleSave = async () => {
        //check if all fields are filled
        const { plateNumber, ...otherDetails } = businessDetails;

        if (Object.values(otherDetails).some(value => value === '')) {
            toast.error('Please fill fields with *')
            return
        }

        let body = {
            businessName: businessDetails.businessName,
            natureOfBusiness: businessDetails.natureOfBusiness,
            location: businessDetails.location,
            plateNumber: businessDetails.plateNumber,
            cellphoneNumber: businessDetails.cellphoneNumber,
            isNew: businessDetails.isNew,  
            amount: businessDetails.amount,
        }

        if (selectedResident) {
            //check first if isResident exists in selectedResident
            if(selectedResident?.isResident) {
                body = {
                    ...body,
                    residentID: selectedResident._id,
                    isResident: true
                }
            } else if(!selectedResident?.isResident) {
                body = {
                    ...body,
                    nonResident: {
                        name: selectedResident.name,
                        address: selectedResident.address,
                        dateOfBirth: selectedResident.dateOfBirth,
                        placeOfBirth: selectedResident.placeOfBirth
                    },
                    isResident: false
                }
            }
        }

        try{    
            const {data} = await axios.post(`${API_URL}business/create`, body)
            console.log(data)
            navigate(`/business/${data.data._id}`)
            toast.success(data.message)
            //TODO: reroute to business page
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex shadow-lg flex-col p-8 w-full">
            <div className="w-full mb-4">
                <h3 className="font-semibold text-2xl text-gray-700">Add Business</h3>
            </div>
            {
                selectedResident && (
                    <div className="mb-4">
                        <p className="text-gray-600">Selected Resident: </p>
                        <div className="p-2">
                            <h4 className="font-medium text-lg">{selectedResident?.name?.last}, {selectedResident?.name?.first} {selectedResident?.name?.middle} {selectedResident?.name?.suffix}</h4>
                            
                            {
                                selectedResident?.isResident ? (
                                    <p className="text-sm">{selectedResident?.address.streetName ? `${selectedResident.address.streetName}` : null} {selectedResident?.address.apartment ? `, ${selectedResident?.address.apartment}` : null} {selectedResident?.address.householdNumber ? `, ${selectedResident?.address.householdNumber}` : null} {selectedResident?.address.sitio ? `, ${selectedResident?.address.sitio}` : null}</p>
                                ) : (
                                    <p className="text-sm">{selectedResident?.address}</p>
                                )
                            }
                            {
                                selectedResident?.isBlocked && <p className="text-red-500">This resident is blocked</p>
                            }
                        </div>
                    </div>
                )
            }

            {
                selectedResident && (
                    <div className="flex gap-4 mb-4">
                        <div className="flex flex-col w-full gap-4">
                            <input type="text" placeholder="Business Name" className="p-2 border" name='businessName' value={businessDetails?.businessName} onChange={handleQueryChange}/>
                            <input type="text" placeholder="Nature of Business" className="p-2 border" name='natureOfBusiness' value={businessDetails?.natureOfBusiness} onChange={handleQueryChange}/>
                            <input type="text" placeholder="Location" className="p-2 border" name='location' value={businessDetails?.location} onChange={handleQueryChange}/>
                            <input type="number" placeholder="Amount" className="p-2 border" name='amount' value={businessDetails?.amount} onChange={handleQueryChange}/>
                            <select type="text" placeholder="New Or Renew" className="p-2 border" name='isNew' value={businessDetails?.isNew?.toString() || ''} onChange={handleQueryChange}>
                                <option value="false">Renewal</option>
                                <option value="true">New</option>
                            </select>
                            <input type="text" placeholder="Plate Number" className="p-2 border" name='plateNumber' value={businessDetails?.plateNumber} onChange={handleQueryChange}/>
                            <input type="text" placeholder="Cellphone Number" className="p-2 border" name='cellphoneNumber' value={businessDetails?.cellphoneNumber} onChange={handleQueryChange}/>
                        </div>
                    </div>
                )
            }

            <div className="flex flex-col w-full gap-2">
                <button className="w-full bg-blue-500 text-white p-2 rounded-md" onClick={() => setOpenResidentSelector(true)}>Select Resident</button>
                {
                    selectedResident && <button className={`bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-all w-full`} onClick={handleSave}>Add Business</button>
                }
                
            </div>
            {
                openResidentSelector && <ResidentSelector manualOption={true} setOpen={setOpenResidentSelector} setSelectedResident={setSelectedResident}/>
            }
        </div>
    )
}

const Business = () => {
    const [openModal, setOpenModal] = useState(false)
    const [businesses, setBusinesses] = useState([])
    const [searchQuery, setSearchQuery] = useState({
        name: '',
        status: '',
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

    const fetchBusinesses = useCallback(async () => {
        try {
            const params = new URLSearchParams(latestSearch.current).toString();

            if (Object.values(latestSearch.current).every(value => value === '')) {
                setBusinesses([]);
                return;
            }

            const response = await axios.get(`${API_URL}business?${params}`);
            console.log(response.data.data)
            setBusinesses(response.data.data);
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

    const debounceFetch = useCallback(debounce(fetchBusinesses, 500), []);

    useEffect(() => {
        debounceFetch();
    }, [searchQuery, debounceFetch]);

    const fetchBusinessNumbers = async () => {
        try {
            const response = await axios.get(`${API_URL}business/statistics`);
            console.log(response.data.data)
            setStatistics(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBusinessNumbers()
    }, [])
    
    //TODO: Handle if business owner is not from the barangay, add option for manually adding business owner

    return (
        <div className="flex gap-4 ml-64 p-8 w-full">
            <div className="flex flex-col w-1/4 h-fit">
                <div className="flex shadow-lg mb-4 flex-col p-8 w-full">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-700">Number of Businesses Registered</p>
                        <h2 className="text-4xl font-semibold">{statistics.totalBusinesses.toLocaleString()}</h2>
                    </div>
                    <div className="mt-8 flex justify-between w-full">
                        <p className="text-gray-700">Active Businesses: </p>
                        <h2 className="font-semibold text-lg">{statistics.activeBusinesses.toLocaleString()}</h2>
                    </div>
                    <div className="mt-4 flex justify-between w-full">
                        <p className="text-gray-700">Expired Businesses:</p>
                        <h2 className=" text-lg">{statistics.expiredBusinesses.toLocaleString()}</h2>
                    </div>
                    <div className="mt-4 flex justify-between w-full">
                        <p className="text-gray-700">Closed Businesses: </p>
                        <h2 className=" text-lg">{statistics.closedBusinesses.toLocaleString()}</h2>
                    </div>
                </div>
                <AddBusiness />
            </div>
            <div className="shadow-lg flex w-3/4">
                <div className="flex flex-col p-8 w-full">
                    <div className="flex gap-4 items-center justify-between">
                        <h3 className="font-semibold text-2xl text-gray-700">List Of Business</h3>  
                        <div className="flex items-center gap-4">
                            <select name="status" id="filter" className="p-2 border" value={searchQuery?.status} onChange={handleQueryChange}>
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="closed">Closed</option>
                            </select>
                            <input type="text" placeholder="serch for business name" className="p-2 border" name="name" onChange={handleQueryChange} value={searchQuery.name}/>
                        </div>
                    </div>
                    <div className="overflow-y-auto h-[80vh] mt-4">
                        {
                            businesses.map(business => (
                                <BusinessItem key={business._id} business={business} />
                            ))
                        }

                        {
                            businesses.length === 0 && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500">No businesses found, start typing in the search field to get results</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Business
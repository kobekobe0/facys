import { useNavigate, useParams } from 'react-router-dom';
import HouseholdDetails from '../components/HouseholdDetails';
//import HouseholdNew from '../components/HouseholdNew';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import API_URL from '../constants/api';
import CensusForm from '../components/CensusForm';
import CensusFormOne from '../components/CensusFormOne';
import validateDate from '../helper/validateDate';
import prepareData from '../helper/prepareData';


const censusReport = {
    id: 1,
    date: '2021-09-01',
    household: 3452,
    families: 5321,
    population: 12543,
    gender: {
        male: 2564,
        female: 2679
    },
    // ///////
    ageGroup: {
        children: 1436,
        adult: 4520,
        senior: 943
    },
    sector: {
        pwd: 10,
        soloParent: 20,
        ofw: 30,
        ip: 0
    }
}

const AddModal = ({onClose}) => {
    const navigate = useNavigate()
    const {id} = useParams();
    const handleCreate = async () => {
        onClose()
    }



    const [resident, setResident] = useState(
        {
            address: {
                streetName: '',
                apartment: '',
                householdNumber: '',
                sitio: ''
            },
            head: {
                name: {
                    first: '',
                    last: '',
                    middle: '',
                    suffix: ''
                },
                dateOfBirth: '',
                sex: '',
                civilStatus: '',
                employment: {
                    occupation: '',
                },
                educationalAttainment: '',
                religion: '',
                sector: '',
                voterInfo: {
                    isRegistered: false
                },
                pregnant: false,
                p4: false,
                registeredBusiness: false,
                familyPlanning: false
            }
        }
    )

    const handleChange = (path, value) => {
        setResident(prevState => {
            const newState = { ...prevState };
            let schema = newState;
            const pList = path.split('.');
            const len = pList.length;
            for(let i = 0; i < len-1; i++) {
                let elem = pList[i];
                if( !schema[elem] ) schema[elem] = {}
                schema = schema[elem];
            }
            schema[pList[len-1]] = value;
            return newState;
        });
    }

    const handleDateChange = (path, value) => {
        if (value.length === 8) {
            const formattedValue = value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
            handleChange(path, formattedValue);
        } else {
            handleChange(path, value);
        }
    };

    const handleSave = async () => {
        toast.loading('Saving...');
        const isDateValid = validateDate(resident.head.dateOfBirth);
        if (!isDateValid) {
            toast.dismiss();
            toast.error('Invalid date of birth');
            return;
        }
        try{
            let dataToSubmit = { ...resident };
            prepareData(dataToSubmit);
            toast.dismiss();
            const {data} = await axios.post(`${API_URL}census/household/create/${id}`, dataToSubmit);
            toast.success(data.message);
            window.open(`/census/${id}/${data.data._id}`, '_blank');
            onClose();
        } catch (error) {
            toast.dismiss();
            toast.error('An error occurred');
            console.error(error);
        }
    }



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-md w-[90vw] flex flex-col flex-wrap">
                <h1 className="text-2xl font-semibold">Add Household</h1>
                <p className='text-gray-600 font-semibold text-sm my-2'>Make sure to input correct address, you cannot change it after creating household</p>
                <div className="mt-4">
                    <h3 className="font-semibold text-sm bg-blue-500 text-white w-fit p-2">Address</h3>
                    <div className="flex gap-4 mt-2 flex-wrap">
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="street">Street</label>
                            <input type="text" name="street" className="border-b border px-2 py-1" value={resident?.address?.streetName || ''} onChange={e=>handleChange('address.streetName', e.target.value)}/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="houseNumber">House Number</label>
                            <input type="text" name="houseNumber" className="border-b border px-2 py-1" value={resident?.address?.householdNumber || ''} onChange={e=>handleChange('address.householdNumber', e.target.value)}/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="apartment">Apartment</label>
                            <input type="text" name="apartment" className="border-b border px-2 py-1" value={resident?.address?.apartment || ''} onChange={e=>handleChange('address.apartment', e.target.value)}/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="sitio">Sitio</label>
                            <input type="text" name="sitio" className="border-b border px-2 py-1" value={resident?.address?.sitio || ''} onChange={e=>handleChange('address.sitio', e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="font-semibold text-sm p-2 bg-green-500 text-white w-fit">Head</h3>
                    <CensusFormOne resident={resident.head} edit={true} onInputChange={handleChange} onDateChange={handleDateChange}/>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-1 rounded-sm">Cancel</button>
                    <button onClick={handleSave} className="bg-green-500 text-white px-4 py-1 rounded-sm">Create</button>
                </div>
            </div>
        </div>
    )
}

const CensusItem = () => {
    const {id} = useParams();
    const [activeHousehold, setActiveHousehold] = useState(null);
    const [addNewHousehold, setAddNewHousehold] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [households, setHouseholds] = useState([])

    const [headQuery, setHeadQuery] = useState({
        first: '',
        middle: '',
        last: '',
        streetName: '',
        sitio: '',
        householdNumber: '',
        apartment: ''
    })
    const latestSearch = useRef(headQuery)

    useEffect(() => {
        latestSearch.current = headQuery;
    }, [headQuery]);

    const handleHeadQueryChange = (e) => {
        setHeadQuery({
            ...headQuery,
            [e.target.name]: e.target.value
        })
    }

    const fetchHouseholds = useCallback(async () => {
        try {
            const params = new URLSearchParams(latestSearch.current).toString();
            console.log(params)
            const response = await axios.get(`${API_URL}census/household/census/${id}?${params}`);
            console.log(response.data.data)
            setHouseholds(response.data.data);
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

    const debounceFetch = useCallback(debounce(fetchHouseholds, 500), []);

    useEffect(() => {
        debounceFetch();
    }, [headQuery, debounceFetch]);

    return (
        <div className='ml-64 flex w-full flex-col'>
            <div className="w-full flex p-8 overflow-y-auto gap-4" >
                <div className='flex flex-col  rounded-md w-1/4 shadow-lg p-8 overflow-y-auto h-fit'>
                    <div>
                        <h2 className='font-semibold my-4'>Search for Households</h2>
                    </div>
                    <div className='flex flex-col justify-between my-2'>
                        <p className='font-medium text-sm ml-2'>Address</p>         
                        <div className='flex flex-col justify-between items-center gap-2'>
                            <input type="text" onChange={handleHeadQueryChange} value={headQuery?.streetName} name='streetName' className='border w-full border-b p-2 items-center' placeholder='Street name'/>
                            <input type="text" onChange={handleHeadQueryChange} value={headQuery?.householdNumber} name='householdNumber' className='border w-full  border-b p-2 items-center' placeholder='House Number'/>
                            <input type="text" onChange={handleHeadQueryChange} value={headQuery?.sitio} name='sitio' className='border w-full border-b p-2 items-center' placeholder='Sitio'/>
                            <input type="text" onChange={handleHeadQueryChange} value={headQuery?.apartment} name='apartment' className='border w-full border-b p-2 items-center' placeholder='Apartment'/>
                        </div>              
                    </div>
                    <div className='flex flex-col justify-between my-2'>
                        <p className='font-medium text-sm ml-2'>Head</p>       
                        <div className='flex flex-col justify-between items-center gap-2'>
                            <input type="text" onChange={handleHeadQueryChange} value={headQuery?.first} name='first' className='border w-full border-b p-2 items-center' placeholder='first'/>
                            <input type="text" onChange={handleHeadQueryChange} value={headQuery?.middle} name='middle' className='border w-full  border-b p-2 items-center' placeholder='middle'/>
                            <input type="text" onChange={handleHeadQueryChange} value={headQuery?.last} name='last' className='border w-full border-b p-2 items-center' placeholder='last'/>
                        </div>              
                    </div>

                    <button onClick={()=>setAddModal(true)} className='w-full text-center bg-green-500 text-white p-2 rounded-md mt-6 hover:bg-green-600 transition-all'>Add New Household</button>

                </div>
                <div className='flex flex-col  rounded-md w-3/4 shadow-lg p-4 h-[85vh] '>
                    <div className='flex justify-between my-2 items-center'>
                        <h2 className='font-semibold'>Households</h2>
                    </div>

                    <hr  className='my-4'/>
                    <div className='overflow-y-auto'>
                        <p className='font-medium text-sm ml-2'>Results</p>
                        {
                            households.map((household, index) => {
                                return (
                                    <Link to={`${household._id}`} target='_blank' key={index} className='flex justify-between items-center p-4 my-2 hover:bg-gray-300 border border-b cursor-pointer rounded-md'>
                                        <div className='flex gap-2'>
                                            <p className='font-medium'>
                                                {household.address.householdNumber} {household.address.streetName} {household.address.apartment} {household.address.sitio}
                                            </p>
                                        </div>
                                        <p className='text-xs'>{household.head.name.last}, {household.head.name.first}</p>
                                    </Link>
                                )
                            })
                        
                        }
                    </div>

                </div>
            </div>
            {
                addModal && <AddModal onClose={() => setAddModal(false)}/>
            }
        </div>
    )
}

export default CensusItem;
import { Link } from "react-router-dom"
import { useState, useEffect, useCallback, useRef  } from "react"
import ResidentAddModal from "../components/residents/ResidentAddModal"
import axios from "axios"
import API_URL from "../constants/api"

const ResidentCard = ({resident}) => {
    return (
        <Link to={`${resident._id}`} className="w-full hover:bg-gray-200 transition-all rounded-md border border-b my-2 p-4 flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                    {
                        resident?.picture ? (
                            <img src={resident?.picture} className="w-[3em] h-[3em] object-cover rounded-sm"/>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="#8a8a8a" fillRule="evenodd" d="M12 4a8 8 0 0 0-6.96 11.947A4.99 4.99 0 0 1 9 14h6a4.99 4.99 0 0 1 3.96 1.947A8 8 0 0 0 12 4m7.943 14.076A9.959 9.959 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.958 9.958 0 0 0 2.057 6.076l-.005.018l.355.413A9.98 9.98 0 0 0 12 22a9.947 9.947 0 0 0 5.675-1.765a10.055 10.055 0 0 0 1.918-1.728l.355-.413zM12 6a3 3 0 1 0 0 6a3 3 0 0 0 0-6" clipRule="evenodd"/></svg>
                        )
                    }
                    <p className="font-semibold text-lg">
                        {resident.name.last}, {resident.name.first} {resident.name.middle} {resident.name.suffix}
                        {
                            resident?.isBlocked && <span className="bg-red-500 text-white px-2  text-xs rounded-full">Blocked</span>
                        }
                    </p>
                </div>
            </div>
            <div>
                <span className="text-sm font-semibold text-gray-500">
                    {new Date(resident.dateOfBirth).toLocaleString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                </span>
            </div>

        </Link>
    )
}


const Residents = () => {
    const [residents, setResidents] = useState([])
    const [searched, setSearched] = useState(false)
    const [addModal, setAddModal] = useState(false)

    const [search, setSearch] = useState({
        searchFirst: '',
        searchLast: '',
        searchMiddle: ''
    });
    
    const latestSearch = useRef(search);

    useEffect(() => {
        latestSearch.current = search;
    }, [search]);

    const fetchResidents = useCallback(async () => {
        try {
            setSearched(true);
            const params = new URLSearchParams(latestSearch.current).toString();

            if (Object.values(latestSearch.current).every(value => value === '')) {
                setResidents([]);
                setSearched(false);
                return;
            }

            const response = await axios.get(`${API_URL}resident?${params}`);
            console.log(response.data.data)
            setResidents(response.data.data);
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
    }, [search, debounceFetch]);


    return (
        <div className="ml-64 p-8 w-full flex flex-col">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Residents</h1>
                <div className="flex items-center justify-end">
                    <input 
                        className="p-2 w-2/12 border border-gray-400 " 
                        type="text" 
                        placeholder="First Name" 
                        onChange={e => setSearch({ ...search, searchFirst: e.target.value })}
                    />
                    <input 
                        className="p-2 w-2/12 border border-gray-400 " 
                        type="text" 
                        placeholder="Middle Name" 
                        onChange={e => setSearch({ ...search, searchMiddle: e.target.value })}
                    />
                    <input 
                        className="p-2 w-2/12 border border-gray-400 " 
                        type="text" 
                        placeholder="Last Name" 
                        onChange={e => setSearch({ ...search, searchLast: e.target.value })}
                    />
                    <button onClick={()=> setAddModal(true)} className="bg-green-500 text-white ml-2 px-4 py-2 rounded-md">Add Resident</button>
                </div>
            </div>
            <div className="flex flex-col w-full mt-8">
                {
                    residents?.map((resident, index) => (
                        <ResidentCard key={resident._id} resident={resident}/>
                    ))
                }
                {
                    !searched && (
                        <div className="w-full h-52 flex justify-center items-center rounded-md">
                            <p className="text-gray-400 text-xl font-medium">Start typing in serch field to get results</p>
                        </div>
                    ) 
                }
                {
                    searched && residents.length === 0 && (
                        <div className="w-full h-52 flex justify-center items-center rounded-md">
                            <p className="text-gray-400 text-xl font-medium">No results found</p>
                        </div>
                    )
                }
            </div>
            {
                addModal && (
                    <ResidentAddModal onClose={()=>setAddModal(false)}/>
                )
            }
        </div>
    )
}

export default Residents;
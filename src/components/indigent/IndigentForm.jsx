import { useState, useEffect, useCallback, useRef } from "react"
import API_URL from "../../constants/api"
import axios from "axios"

const IndigentItem = ({indigent, onIndigentSelect}) => {
    return (
        <div className='flex flex-row gap-4 items-center p-4 justify-between rounded-md border my-2 hover:bg-gray-200 cursor-pointer' onClick={() => onIndigentSelect(indigent)}>
            <div className='flex flex-col gap-2'>
                <h2 className='text-lg font-medium'>{indigent?.patient?.name?.first} {indigent?.patient?.name?.middle} {indigent?.patient?.name?.last} {indigent?.patient?.name?.suffix || ''}</h2>
                <h2 className='text-sm text-gray-500'>₱ {indigent?.amount?.toLocaleString()} - {indigent?.recommendation}</h2>
            </div>
            <div className='flex flex-col gap-2'>
                <h3 className='text-md text-gray-800'>{new Date(indigent?.approvedAt)?.toLocaleString('en-us', {year:'numeric', month:'long', day:'2-digit'})}</h3>
            </div>
        </div>
    )
}

const IndigentForms = () => {
    const [indigents, setIndigents] = useState([])
    const [selectedIndigent, setSelectedIndigent] = useState(null)
    const [search, setSearch] = useState({
        first: '',
        middle: '',
        last: ''   
    })

    const handleQueryChange = (e) => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value
        })
    }

    const latestSearch = useRef(search);

    useEffect(() => {
        latestSearch.current = search;
    }, [search]);

    const fetchLatestIndigents = async () => {
        try {
            const {data} = await axios.get(`${API_URL}indigent/item`)
            setIndigents(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchLatestIndigents()
    }, [])

    const fetchIndigents = useCallback(async () => {
        try {
            const params = new URLSearchParams(latestSearch.current).toString();

            if (Object.values(latestSearch.current).every(value => value === '')) {
                fetchLatestIndigents()
                return;
            }

            const {data} = await axios.get(`${API_URL}indigent/item/search?${params}`);
            console.log(data.data)
            setIndigents(data.data);
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

    const debounceFetch = useCallback(debounce(fetchIndigents, 500), []);

    useEffect(() => {
        debounceFetch();
    }, [search, debounceFetch]);

    return (
        <div className='flex flex-col  rounded-md w-2/3 shadow-lg p-8 overflow-y-auto h-fit'>
            <div className='flex flex-col justify-center gap-4'>
                <div className="flex justify-between">
                    <h2 className="text-lg font-medium text-gray-800">Distribution History</h2>
                    <div className="flex items-center w-1/2">
                        <input type="text" className="border p-2 w-1/3" name="first" onChange={handleQueryChange} placeholder="first name" />
                        <input type="text" className="border p-2 w-1/3" name="middle" onChange={handleQueryChange} placeholder="middle name" />
                        <input type="text" className="border p-2 w-1/3" name="last" onChange={handleQueryChange} placeholder="last name" />
                    </div>
                </div>
                
                <div className="flex flex-col h-[80vh] overflow-y-scroll">
                    {
                        indigents?.map(form => (
                            <IndigentItem key={form._id} indigent={form} onIndigentSelect={setSelectedIndigent}/>
                        ))
                    }
                    {
                        indigents?.length == 0 && <h2 className="text-lg text-gray-400">No forms found</h2>
                    }
                </div>
            </div>
        </div>
    )
}

export default IndigentForms
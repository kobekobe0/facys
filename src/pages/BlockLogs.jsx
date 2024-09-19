import { Link } from "react-router-dom"
import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios";
import API_URL from "../constants/api"

const BookletCard = ({resident, log}) => {
    return (
        <Link to={`/residents/${resident._id}`} className="w-full hover:bg-gray-200 transition-all rounded-md border border-b my-2 p-4 flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 4a8 8 0 0 0-6.96 11.947A4.99 4.99 0 0 1 9 14h6a4.99 4.99 0 0 1 3.96 1.947A8 8 0 0 0 12 4m7.943 14.076A9.959 9.959 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.958 9.958 0 0 0 2.057 6.076l-.005.018l.355.413A9.98 9.98 0 0 0 12 22a9.947 9.947 0 0 0 5.675-1.765a10.055 10.055 0 0 0 1.918-1.728l.355-.413zM12 6a3 3 0 1 0 0 6a3 3 0 0 0 0-6" clip-rule="evenodd"/></svg>                
                <div>
                    <span className="text-lg font-semibold text-gray-700">
                        {resident?.name?.last}, {resident?.name?.first} {resident?.name?.middle} {resident?.name?.suffix ||''}
                    </span>
                    <p className="text-sm font-medium text-red-600">
                        {log?.reason}
                    </p>
                </div>

            </div>
            <div>
                <span className="text-sm font-semibold text-gray-500">
                        {new Date(log?.dateBlocked).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>

        </Link>
    )
}


const BlockLog = () => {
    const [search, setSearch] = useState({
        first: '',
        middle: '',
        last: ''
    })

    const [logs, setLogs] = useState([]);

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

    const fetchIndigents = useCallback(async () => {
        try {
            const params = new URLSearchParams(latestSearch.current).toString();

            const {data} = await axios.get(`${API_URL}blocklog?${params}`);
            setLogs(data.data);
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
        <div className="flex p-8 flex-col ml-64 w-full">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Blocked Residents</h1>
                <div className="flex items-center w-1/3 justify-end">
                    <input className="p-2 border w-1/4 border-gray-400" onChange={handleQueryChange} type="text" name="first" placeholder="first name" />
                    <input className="p-2 border w-1/4 border-gray-400" onChange={handleQueryChange} type="text" name="middle" placeholder="middle name" />
                    <input className="p-2 border w-1/4 border-gray-400" onChange={handleQueryChange} type="text" name="last" placeholder="last name" />
                </div>
                
            </div>
            <div className="flex flex-col w-full mt-8 h-[80vh] overflow-y-auto">
                {
                    logs?.map((log, index) => (
                        <BookletCard key={log._id} resident={log?.residentID} log={log} />
                    ))
                }
            </div>
        </div>
    );
}

export default BlockLog;
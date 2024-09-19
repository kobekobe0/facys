import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import API_URL from "../constants/api";
import censuspic from "../assets/census.jpg";
import CensusReport from "../components/CensusReport";

const CensusCard = ({census}) => {
    return (
        <Link to={`${census._id}`}>
            Census Households
        </Link>

    )
}

const AddModal = ({onClose}) => {
    const [confirm, setConfirm] = useState('')
    const navigate = useNavigate()
    const handleCreate = async () => {
        if(confirm !== 'CREATE') return toast.error('Invalid confirmation')
        try{
            const {data} = await axios.post(`${API_URL}census/create`)
            toast.success('Census created successfully')
            navigate(`/census/${data.census._id}`)
        } catch (error) {
            toast.error(error.message)
        }
    }



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-1/4 p-8 rounded-md">
                <h1 className="text-2xl font-semibold">Add Census</h1>
                <div className="mt-4">
                    <p>
                        Are you sure you want to create a new census? If so, type <b className="text-green-600">"CREATE"</b> in the input field below.
                    </p>
                    <p className="text-sm text-red-500 font-semibold my-4">
                        <span className="font-bold">WARNING: </span>Please avoid creating a new census if it is not necessary.
                    </p>
                    <input type="text" className="border border-gray-300 w-full mt-2 p-2 rounded-sm" value={confirm} onChange={e=>setConfirm(e.target.value)}/>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-1 rounded-sm">Cancel</button>
                    <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-1 rounded-sm">Create</button>
                </div>
            </div>
        </div>
    )
}

const Census = () => {
    const [data, setData] = useState([])
    const [addModal, setAddModal] = useState(false)
    const fetchCensus = async () => {
        try {
            const {data} = await axios.get(`${API_URL}census`)
            setData(data.data)
        } catch (error) {
            console.log(error.message)
        }
    }

    const updateCensus = async () => {
        try {
            await axios.post(`${API_URL}censusReport`)
            toast.success('Census updated successfully')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        fetchCensus()
    }, [])
    return (
        <div className="flex p-8 flex-col ml-64 w-full">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Census</h1>
                <div className="flex items-center gap-4">
                    <button onClick={updateCensus} className="text-sm border text-yellow-500 p-2 hover:bg-yellow-500 hover:text-white rounded-md duration-75 transition-all border-yellow-500">
                        Update Census
                    </button>
                    {
                        !data.length > 0 ? ( <button onClick={()=>setAddModal(true)} className="bg-green-500 text-white px-4 py-1 rounded-sm">Add Census</button> ) :
                            (
                                <Link to={`${data[0]._id}`} className="bg-blue-500 text-white px-2 py-2 rounded-md text-sm">
                                    Census Households
                                </Link>
                            )
                    }
                </div>

            </div>
            <div className="flex w-full mt-8 flex-wrap">
                <CensusReport />
            </div>
            {
                addModal && <AddModal onClose={() => setAddModal(false)}/>
            }
        </div>
    );
    }

export default Census;
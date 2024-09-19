import { useEffect, useState } from "react"
import ResidentSelector from "../business/ResidentSelector"
import axios from "axios"
import API_URL from "../../constants/api"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

const AddIndigent = ({setOpen, id}) => {
    const [receivedByModal, setReceivedByModal] = useState(false)
    const [lastClaimDate, setLastClaimDate] = useState(null)
    const [clientModal, setClientModal] = useState(false)
    const [dataToSend, setDataToSend] = useState({
        receivedBy: {
            name: {
                first: '',
                middle: '',
                last: '',
                suffix: ''
            },
            _id: null
        },
        patient: {
            name: {
                first: '',
                middle: '',
                last: '',
                suffix: ''
            },
            _id: null
        },
        problem: '',
        recommendation: '',
        amount: 0,
        approvedAt: new Date()
    })

    const setReceivedBy = (resident) => {
        setDataToSend({
            ...dataToSend,
            receivedBy: {
                name: {
                    first: resident.name.first,
                    middle: resident.name.middle,
                    last: resident.name.last,
                    suffix: resident.name.suffix
                },
                _id: resident._id
            }
        })
    }

    const setPatient = (resident) => {
        setDataToSend({
            ...dataToSend,
            patient: {
                name: {
                    first: resident.name.first,
                    middle: resident.name.middle,
                    last: resident.name.last,
                    suffix: resident.name.suffix
                },
                _id: resident._id
            }
        })
    }

    const handleQueryChange = (e) => {
        setDataToSend({
            ...dataToSend,
            [e.target.name]: e.target.value
        })
    }

    const getPatientLastClaimDate = async () => {
        try {
            const response = await axios.get(`${API_URL}indigent/last-claim/${dataToSend.patient._id}`);
            console.log(response.data)
            setLastClaimDate(response.data)
            //return response.data.data;
        } catch (error) {
            console.log(error);
        }
    }

    const handleSave = async () => {
        try {
            //build body
            if(dataToSend.receivedBy._id === null || dataToSend.patient._id === null || dataToSend.problem === '' || dataToSend.recommendation === '' || dataToSend.amount === 0 || dataToSend.approvedAt === '') {
                toast.error('Please fill up all fields');
                return;
            }
            const body = {
                receivedBy: dataToSend.receivedBy._id,
                patient: dataToSend.patient._id,
                problem: dataToSend.problem,
                recommendation: dataToSend.recommendation,
                amount: dataToSend.amount,
                approvedAt: dataToSend.approvedAt,
                holderID: id
            }
            console.log(body)
            const {data} = await axios.post(`${API_URL}indigent/item`, body);

            //reload
            setTimeout(() => {
                window.location.reload();
            }, 2000)
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        getPatientLastClaimDate()
    }, [dataToSend.patient._id])

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Add Indigent Entry</h3>
                        <div className="mt-4 flex justify-between items-center">
                            <label className="text-md">Client</label>
                            <button onClick={()=>setClientModal(true)} className="bg-blue-500 text-white text-xs rounded-md px-2 py-1">Select received by</button>
                        </div>
                        {
                            dataToSend.patient._id !== null && (
                                <div className="mt-4 flex justify-between items-center">
                                    <Link to={`/residents/${dataToSend.patient._id}`} target="_blank" className="text-md hover:text-blue-700 font-semibold">{`${dataToSend.patient.name.first} ${dataToSend.patient.name.middle} ${dataToSend.patient.name.last} ${dataToSend.patient.name.suffix || ''}`}
                                        {
                                            lastClaimDate?.isBlocked && (
                                                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">Blocked</span>
                                            )
                                        }
                                        
                                    </Link>
                                    {
                                        lastClaimDate && (
                                            <p className="text-sm text-gray-500">{`Last claim: ${lastClaimDate.data}`}</p>
                                        )
                                    }
                                </div>
                            )
                        }
                        <hr className="my-4"/>
                        <div className="mt-4 flex justify-between items-center">
                            <label className="text-md">Received By: </label>
                            <button onClick={()=>setReceivedByModal(true)} className="bg-blue-500 text-white text-xs rounded-md px-2 py-1">Select received by</button>
                        </div>
                        {
                            dataToSend.receivedBy._id !== null && (
                                <div className="mt-4">
                                    <h2 className="text-md font-semibold">{`${dataToSend.receivedBy.name.first} ${dataToSend.receivedBy.name.middle} ${dataToSend.receivedBy.name.last} ${dataToSend.receivedBy.name.suffix || ''}`}</h2>
                                </div>
                            )
                        }
                        <hr className="my-4"/>
                        <div className="">
                            <label className="text-md">Problem</label>
                            <input type="text" className="p-2 border border-gray-600 rounded-sm  w-full mb-4" name="problem" onChange={handleQueryChange} value={dataToSend?.problem}/>
                        </div>
                        <div className="">
                            <label className="text-md">Recommendation</label>
                            <select className="p-2 border border-gray-600 rounded-sm w-full mb-4" name="recommendation" onChange={handleQueryChange} value={dataToSend?.recommendation}>
                                <option value="Medical Assistance">Medical Assistance</option>
                                <option value="Food Assistance">Food Assistance</option>
                                <option value="Burial Assistance">Burial Assistance</option>
                                <option value="Balik Probinsya">Balik Probinsya</option>
                                <option value="Assistance to Rape Victim">Assistance to Rape Victim</option>
                                <option value="">Select One</option>
                            </select>
                        </div>
                        <div className="">
                            <label className="text-md">Amount</label>
                            <input type="number" className="p-2 border border-gray-600 rounded-sm    w-full mb-4" name="amount" onChange={handleQueryChange} value={dataToSend?.amount}/>
                        </div>
                        <div className="">
                            <label className="text-md">Date Approve</label>
                            <input type="date" className="p-2 border border-gray-600 rounded-sm  w-full mb-4" name="approvedAt" onChange={handleQueryChange} value={dataToSend?.approvedAt}/>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                        <button onClick={handleSave} type="button" className={`bg-green-500 ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-0 sm:w-auto sm:text-sm`}>
                            Confirm
                        </button>
                        <button onClick={()=>setOpen(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
            {
                receivedByModal && (
                    <ResidentSelector setOpen={setReceivedByModal} setSelectedResident={setReceivedBy}/>
                )
            }
            {
                clientModal && (
                    <ResidentSelector setOpen={setClientModal} setSelectedResident={setPatient}/>
                )
            }
        </div>
    )
}

export default AddIndigent
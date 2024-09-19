import { useEffect, useState } from "react"
import BusinessForms from "../components/business/BusinessForms"
import EditBusiness from "../components/business/EditBusiness"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import API_URL from "../constants/api"
import CloseModal from "../components/business/CloseModal"
import DeleteModal from "../components/business/DeleteModal"
import RequestClearance from "../components/business/RequestClearance"
import ClosedBusiness from "../components/business/ClosedBusiness"

const BusinessItem = () => {
    const [activeTab, setActiveTab] = useState('forms')
    const [business, setBusiness] = useState({})
    const [openClose, setOpenClose] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const [openBusinessClearance, setOpenBusinessClearance] = useState(false)
    const [openClosedClearance, setOpenClosedClearance] = useState(false)

    const {id} = useParams()

    const fetchBusiness = async () => {
        try{
            const {data} = await axios.get(`${API_URL}business/get-by-id/${id}`)
            console.log(data.data)
            setBusiness(data.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(()=>{
        fetchBusiness()
    },[id])

    const handleCloseBusiness = async() => {
        try {
            //copy without formsIDs
            const {formsIDs, ...businessData} = business
            const bodyToSend = {
                ...businessData,
                isClosed: true,
                dateClosed: new Date()
            }
            const {data} = await axios.put(`${API_URL}business/update/${id}`, bodyToSend)
            console.log(data)
            //setBusiness(data.data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteBusiness = async() => {
        try {
            const {data} = await axios.delete(`${API_URL}business/delete/${id}`)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='ml-64 flex w-full flex-col'>
            <div className="w-full flex p-8 overflow-y-auto gap-4" >
                <div className='flex flex-col  rounded-md w-1/3 shadow-lg p-8 overflow-y-auto h-fit'>
                    <div className='flex flex-col justify-center gap-4'>
                        <h2 className='text-lg font-semibold text-gray-600'>Business</h2>
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-semibold flex items-center">{business?.businessName}</h2>
                            <div className="flex items-center justify-end gap-2">
                                {
                                    business?.isExpired && <span className="bg-orange-500 px-2 rounded-full text-white text-sm">Expired</span>
                                }
                                {
                                    business?.isClosed && <span className="bg-red-500 px-2 rounded-full text-white text-sm">Closed</span>
                                }
                            </div>
                        </div>

                    </div>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-md'>{`${business?.location}`}</h2>
                    </div>
                    <hr className="my-4"/>
                    <div className="flex flex-col gap-2"> 
                        <div className='flex justify-between items-center gap-2'>
                            <h2 className='text-sm font-semibold text-gray-600'>Business Owner</h2>
                            {
                                business?.isResident ? (
                                    <Link to={`/residents/${business?.residentID?._id}`}>
                                        <h2 className='text-md font-semibold hover:scale-105 transition-all duration-75'>{`${business?.residentID?.name?.first || ''} ${business?.residentID?.name?.middle || ''} ${business?.residentID?.name?.last || ''} ${business?.residentID?.name?.suffix || ''}`}
                                            {business?.residentID?.isBlocked ? <span className="text-xs font-normal px-2 bg-red-500 text-white rounded-full">Blocked</span> : ''}
                                        </h2>
                                    </Link>
                                ) : (
                                    <h2 className='text-md font-semibold hover:scale-105 transition-all duration-75'>{`${business?.nonResident?.name?.first || ''} ${business?.nonResident?.name?.middle || ''} ${business?.nonResident?.name?.last || ''} ${business?.nonResident?.name?.suffix || ''}`}</h2>
                                )
                            }

                        </div>
                        <div className='flex justify-between items-center gap-2'>
                            <h2 className='text-sm font-semibold text-gray-600'>Owner Address</h2>
                            {
                                business?.isResident ? (
                                    <h2 className='text-md font-semibold hover:scale-105 transition-all duration-75'>{`${business?.residentID?.address?.householdNumber || ''} ${business?.residentID?.address?.streetName || ''}, ${business?.residentID?.address?.apartment || ''}, ${business?.residentID?.address?.sitio || ''}`}</h2>
                                ) : (
                                    <h2 className='text-md font-semibold text-right hover:scale-105 transition-all duration-75'>{`${business?.nonResident?.address || ''}`}</h2>
                                )
                            }

                        </div>
                        <div className='flex justify-between items-center gap-2'>
                            <h2 className='text-sm font-semibold text-gray-600'>Nature of Business</h2>
                            <h2 className='text-md font-semibold'>{`${business?.natureOfBusiness || 'N/A'}`}</h2>
                        </div>
                        <div className='flex justify-between items-center gap-2'>
                            <h2 className='text-sm font-semibold text-gray-600'>Amount</h2>
                            <h2 className='text-md font-semibold'>₱ {`${business?.amount?.toLocaleString() || 'N/A'}`}</h2>
                        </div>
                        <div className='flex justify-between items-center gap-2'>
                            <h2 className='text-sm font-semibold text-gray-600'>Cellphone Number</h2>
                            <h2 className='text-md font-semibold'>{`${business?.cellphoneNumber || 'N/A'}`}</h2>
                        </div>
                        <div className='flex justify-between items-center gap-2'>
                            <h2 className='text-sm font-semibold text-gray-600'>Date Closed</h2>
                            <h2 className='text-md font-semibold'>{`${business?.dateClosed ? new Date(business?.dateClosed).toLocaleString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}) : 'N/A'}`}</h2>
                        </div>
                    </div>
                    <hr className="my-4"/>
                    <div className="flex flex-col gap-4">
                        {
                            !business?.isClosed && (
                                <button onClick={()=> setOpenBusinessClearance(true)} disabled={business?.residentID?.isBlocked} className="bg-blue-500 text-white w-full p-2 rounded-md">Business Permit</button>
                            )
                        }
                        {
                            business?.isClosed && (
                                <button onClick={()=> setOpenClosedClearance(true)} disabled={business?.residentID?.isBlocked} className="bg-blue-500 text-white w-full p-2 rounded-md">Closed Business Permit</button>
                            )
                        }
                        <button onClick={()=>setActiveTab('forms')} className="bg-green-500 text-white w-full p-2 rounded-md">Recent Forms</button>
                        <button onClick={()=>setActiveTab('edit')} className="bg-orange-500 text-white w-full p-2 rounded-md">Edit Details</button>
                        {
                            !business?.isClosed &&  <button onClick={()=>setOpenClose(true)} className="border border-red-500 hover:text-white hover:bg-red-500 text-red-500 w-full p-2 rounded-md">Close Business</button>
                        }
                        <button onClick={()=>setOpenDelete(true)} className="border border-red-500 hover:text-white hover:bg-red-500 text-red-500 w-full p-2 rounded-md">Delete Business</button>
                    </div>
                </div>
                {
                    activeTab == 'forms' && <BusinessForms forms={business?.formsIDs}/>
                }
                {
                    activeTab == 'edit' && <EditBusiness business={business}/>
                }
                {
                    openClose && <CloseModal setOpen={setOpenClose} handleClose={handleCloseBusiness}/>
                }
                {
                    openDelete && <DeleteModal setOpen={setOpenDelete} handleDelete={handleDeleteBusiness}/>
                }
                {
                    openBusinessClearance && <RequestClearance business={business} title='Generate Business Clearance' setOpen={setOpenBusinessClearance}/>
                }

                {
                    openClosedClearance && <ClosedBusiness business={business} title='Generate Closed Business Clearance' setOpen={setOpenClosedClearance}/>
                }
            </div>
        </div>
    )
}

export default BusinessItem
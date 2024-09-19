import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ResidentFormRequest from "../components/ResidentFormRequest";
import ResidentInfo from "../components/ResidentInfo";
import ResidentAddModal from "../components/residents/ResidentAddModal";
import axios from "axios";
import API_URL from "../constants/api";
import toast from "react-hot-toast";

const BlockModal = ({resident, onClose}) => {
    const [reason, setReason] = useState('')
    const blockResident = async () => {
        try {
            const {data} = await axios.put(`${API_URL}blocklog/block/${resident._id}`, {reason: reason})
            console.log(data)
            toast.success('Resident blocked successfully')
            onClose()
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-md shadow-lg">
                <h3 className="text-xl font-semibold text-gray-700">Block Resident</h3>
                <p className="text-md my-4 text-gray-500">Are you sure you want to block <b>{resident.name.last}, {resident.name.first} {resident.name.middle} {resident.name.suffix}</b>?</p>
                <div>
                    <label htmlFor="reason" className="text-md text-gray-500 font-medium">Reason</label>
                    <input type="text" id="reason" className="w-full border border-gray-300 rounded-md p-2" onChange={e=>setReason(e.target.value)}/>
                </div>
                <div className="flex gap-4 mt-4 justify-end">
                    <button className="bg-gray-500 text-white p-2 rounded-md" onClick={() => onClose()}>Cancel</button> 
                    <button className="bg-red-500 text-white p-2 rounded-md" onClick={() => blockResident()} >Block</button>
                </div>
            </div>
        </div>
    )

}
const BarangayID = ({resident, onClose}) => {
    const [residentData, setResident] = useState(null)

    const generateID = async () => {
        toast.loading('Generating Barangay ID....')
        try {
            const response = await axios.post(`${API_URL}form/${resident._id}`, residentData, {
                responseType: 'arraybuffer' 
            })
            const file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
            const fileURL = URL.createObjectURL(file);

            const link = document.createElement('a');
            link.href = fileURL;
            link.download = `ID_${resident?.name?.first}_${resident?.name?.last}.docx`;
            link.click();
            toast.dismiss()
            toast.success('Barangay ID generated successfully')
        } catch (error) {
            toast.dismiss()
            console.error(error)
            toast.error('An error occured. Please try again later')
        }
    }

    const handleQueryChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
    
        if (keys.length > 1) {
            setResident(prevData => ({
                ...prevData,
                [keys[0]]: {
                    ...prevData[keys[0]],
                    [keys[1]]: value
                }
            }));
        } else {
            setResident({
                ...residentData,
                [name]: value
            });
        }
    }

    useEffect(()=> {
        console.log(resident)
        setResident(resident)
        if(resident?.dateOfBirth){
            setResident(prevData => ({
                ...prevData,
                dateOfBirth: new Date(resident.dateOfBirth).toISOString().split('T')[0]
            }))
        }
    },[resident])

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-300 p-8 rounded-md shadow-lg w-[50vw]">
                <h3 className="text-xl font-semibold text-gray-700">Barangay ID</h3>
                <p className="text-md my-4 text-gray-500">Generate barangay ID for <b>{resident.name.last}, {resident.name.first} {resident.name.middle} {resident.name.suffix}</b>?</p>
                <div className="flex flex-col">
                    <div className="flex mb-4">
                        <div className="flex flex-col w-4/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">First Name</label>
                            <input type="text" name="name.first" onChange={handleQueryChange} value={residentData?.name?.first || ''} placeholder="First Name" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-4/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Middle Name</label>
                            <input type="text" name="name.middle" onChange={handleQueryChange} value={residentData?.name?.middle || ''}  placeholder="First Name" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-3/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Last Name</label>
                            <input type="text" name="name.last" onChange={handleQueryChange} value={residentData?.name?.last || ''}  placeholder="First Name" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-1/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Suffix</label>
                            <select type="text" name="name.suffix" onChange={handleQueryChange} value={residentData?.name?.suffix || ''}  placeholder="First Name" className=" border border-gray-300 p-2 font-medium">
                                <option value="JR">JR</option>
                                <option value="SR">SR</option>
                                <option value="I">I</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                                <option value=''>N/A</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex mb-4 gap-2">
                        <div className="flex flex-col w-4/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Date of Birth</label>
                            <input type="date" name="dateOfBirth" onChange={handleQueryChange} value={residentData?.dateOfBirth || ''} placeholder="Date of Birth" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-4/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Blood Type</label>
                            <select type="text" name="bloodType" onChange={handleQueryChange} value={residentData?.bloodType || ''} placeholder="Blood Type" className=" border border-gray-300 p-2 font-medium">
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="O">O</option>
                                <option value=''>N/A</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="flex flex-col w-3/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">House Number</label>
                            <input type="text" name="address.householdNumber" onChange={handleQueryChange} value={residentData?.address?.householdNumber} placeholder="House Number" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-3/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Street Name</label>
                            <input type="text" name="address.streetName" onChange={handleQueryChange} value={residentData?.address?.streetName}  placeholder="Street Name" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-3/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Sitio</label>
                            <input type="text" name="address.sitio" onChange={handleQueryChange} value={residentData?.address?.sitio}  placeholder="Sitio" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-3/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Apartnemt</label>
                            <input type="text" name="address.apartment" onChange={handleQueryChange} value={residentData?.address?.apartment}  placeholder="Apartment" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="flex flex-col w-4/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Emergency Person</label>
                            <input type="text" name="emergencyContact.name" onChange={handleQueryChange} value={residentData?.emergencyContact?.name} placeholder="Name of Emergency Person" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-2/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Mobile No.</label>
                            <input type="text" name="emergencyContact.mobileNumber" onChange={handleQueryChange} value={residentData?.emergencyContact?.mobileNumber} placeholder="Emergency Mobile Number" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-6/12">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Emergency Address</label>
                            <input type="text" name="emergencyContact.address" onChange={handleQueryChange} value={residentData?.emergencyContact?.address} placeholder="Emergency Address" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="flex flex-col w-full mb-4">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">TIN Number</label>
                            <input type="text" name="IDs.TIN" onChange={handleQueryChange} value={residentData?.IDs?.TIN} placeholder="TIN Number" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-full mb-4">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">SSS Number</label>
                            <input type="text" name="IDs.SSS" onChange={handleQueryChange} value={residentData?.IDs?.SSS} placeholder="SSS Number" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="flex flex-col w-full mb-4">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">PhilHealth Number</label>
                            <input type="text" name="IDs.PhilHealth" onChange={handleQueryChange} value={residentData?.IDs?.PhilHealth} placeholder="TIN Number" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-full mb-4">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">PAGIBIG Number</label>
                            <input type="text" name="IDs.PAGIBIG" onChange={handleQueryChange} value={residentData?.IDs?.PAGIBIG} placeholder="TIN Number" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="flex flex-col w-full mb-4">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Voter's ID</label>
                            <input type="text" name="voterInfo.voterID" onChange={handleQueryChange} value={residentData?.voterInfo?.voterID} placeholder="Voter's ID Number" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                        <div className="flex flex-col w-full mb-4">
                            <label htmlFor="reason" className="text-md text-gray-500 font-medium">Precinct Number</label>
                            <input type="text" name="voterInfo.precinctNumber" onChange={handleQueryChange} value={residentData?.voterInfo?.precinctNumber} placeholder="Precinct" className=" border border-gray-300 p-2 font-medium"/>
                        </div>
                    </div>


                </div>
                <div className="flex gap-4 mt-4 justify-end">
                    <button className="bg-gray-500 text-white p-2 rounded-md" onClick={() => onClose()}>Cancel</button> 
                    <button className="bg-green-500 text-white p-2 rounded-md" onClick={() => generateID()} >Generate</button>
                </div>
            </div>
        </div>
    )

}

const UnblockModal = ({resident, onClose}) => {
    const unblockResident = async () => {
        try {
            const {data} = await axios.put(`${API_URL}blocklog/unblock/${resident._id}`)
            console.log(data)
            toast.success('Resident unblocked successfully')
            onClose()
            //refresh page
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-md shadow-lg">
                <h3 className="text-xl font-semibold text-gray-700">Unblock Resident</h3>
                <p className="text-md my-4 text-gray-500">Are you sure you want to unblock <b>{resident.name.last}, {resident.name.first} {resident.name.middle} {resident.name.suffix}</b>?</p>
                <div>
                    <label>Date</label>
                    <p>{new Date(resident.blocked.dateBlocked).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <label htmlFor="reason" className="text-md text-gray-500 font-medium">Reason</label>
                    <p>{resident?.blocked.reason}</p>
                </div>
                <div className="flex gap-4 mt-4 justify-end">
                    <button className="bg-gray-500 text-white p-2 rounded-md" onClick={() => onClose()}>Cancel</button> 
                    <button className="bg-red-500 text-white p-2 rounded-md" onClick={() => unblockResident()}>Unblock</button>
                </div>
            </div>
        </div>
    )


}

const ResidentItem = () => {
    const {id} = useParams()
    const [activeTab, setActiveTab] = useState('form')
    const [resident, setResident] = useState(null)
    const [showBlockModal, setShowBlockModal] = useState(false)
    const [showUnblockModal, setShowUnblockModal] = useState(false)
    const [showBarangayID, setShowBarangayID] = useState(false)

    const fetchResident = async () => {
        try{
            const {data} = await axios.get(`${API_URL}resident/${id}`)
            setResident(data.data)
            console.log(data.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchResident()
    }, [id])

    return (
        <div className="flex gap-4 ml-64 p-8 w-full">
            <div className="shadow-lg flex w-1/4 h-fit">
                <div className="flex flex-col p-8 w-full ">
                    <h3 className="font-semibold text-lg text-gray-700">Resident Information</h3>
                    <div className="flex flex-col mt-4 gap-2">
                        <div className="flex items-center w-full justify-center">
                            {
                                resident?.picture ? (
                                    <img src={resident?.picture} className="w-[10em] h-[10em] object-cover rounded-md"/>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10em" height="10em" viewBox="0 0 24 24"><path fill="#8a8a8a" fillRule="evenodd" d="M12 4a8 8 0 0 0-6.96 11.947A4.99 4.99 0 0 1 9 14h6a4.99 4.99 0 0 1 3.96 1.947A8 8 0 0 0 12 4m7.943 14.076A9.959 9.959 0 0 0 22 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.958 9.958 0 0 0 2.057 6.076l-.005.018l.355.413A9.98 9.98 0 0 0 12 22a9.947 9.947 0 0 0 5.675-1.765a10.055 10.055 0 0 0 1.918-1.728l.355-.413zM12 6a3 3 0 1 0 0 6a3 3 0 0 0 0-6" clipRule="evenodd"/></svg>
                                )
                            }
                        </div>
                        <div className="flex flex-col justify-between">
                            <p className="text-md text-gray-500">Name</p>
                            <p className="text-md font-semibold">{resident?.name.last}, {resident?.name.first} {resident?.name.middle} {resident?.name.suffix}
                            {resident?.isBlocked ? <span className="bg-red-500 text-white px-2  text-xs rounded-full">Blocked</span> : null}
                            </p>
                        </div>
                        <div className="flex flex-col justify-between">
                            <p className="text-md text-gray-500">Date of Birth</p>
                            <p className="text-md font-semibold">{new Date(resident?.dateOfBirth).toLocaleDateString('en-us', {year: 'numeric', month:'long', day:'numeric'})}</p>
                        </div>
                        <div className="flex flex-col justify-between">
                            <p className="text-md text-gray-500">Address</p>
                            <p className="text-md font-semibold">{resident?.address.streetName ? `${resident.address.streetName}` : null} {resident?.address.apartment ? `, ${resident?.address.apartment}` : null} {resident?.address.householdNumber ? `, ${resident?.address.householdNumber}` : null} {resident?.address.sitio ? `, ${resident?.address.sitio}` : null}</p>
                        </div>
                        <div className="flex flex-col justify-between">
                            <p className="text-md text-gray-500">Mobile Number</p>
                            <p className="text-md font-semibold">
                                {resident?.mobileNumber ? resident?.mobileNumber : 'N/A'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 mt-4">
                            <button onClick={() => setActiveTab('form')} className="border border-blue-500 text-blue-500 hover:text-white p-2 rounded-md hover:bg-blue-500 transition-all">Form Request</button>
                            <button onClick={() => setActiveTab('info')} className=" border border-green-500 text-green-500 hover:text-white p-2 rounded-md hover:bg-green-600 transition-all">Edit Info</button>
                            <button onClick={() => setShowBarangayID(true)} className="border border-orange-500 text-orange-500 p-2 rounded-md hover:bg-orange-500 hover:text-white transition-all">Barangay ID</button>
                            {
                                resident?.isBlocked ? (
                                    <button onClick={() => setShowUnblockModal(true)} className="border border-red-500 text-red-500 p-2 rounded-md hover:bg-red-500 hover:text-white transition-all">Unblock Resident</button>
                                ) : (
                                    <button onClick={() => setShowBlockModal(true)} className="border border-red-500 text-red-500 p-2 rounded-md hover:bg-red-500 hover:text-white transition-all">Block Resident</button>
                                )
                            }
                           
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-3/4 h-fit">
                {
                    activeTab === 'form' ? <ResidentFormRequest id={id} resident={resident}/> : null
                }
                {
                    activeTab === 'info' ? <ResidentInfo residentData={resident}/> : null
                }
            </div>
            {
                showBlockModal ? <BlockModal resident={resident} onClose={() => setShowBlockModal(false)}/> : null
            }
            {
                showUnblockModal ? <UnblockModal resident={resident} onClose={() => setShowUnblockModal(false)}/> : null
            }
            {
                showBarangayID ? <BarangayID resident={resident} onClose={() => setShowBarangayID(false)}/> : null
            }
        </div>
    )
}

export default ResidentItem
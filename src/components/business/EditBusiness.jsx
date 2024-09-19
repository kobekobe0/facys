import { useEffect, useState } from "react"
import ResidentSelector from "./ResidentSelector"
import toast from "react-hot-toast"
import axios from "axios"
import API_URL from "../../constants/api"

const EditBusiness = ({business}) => {
    const [openSelect, setOpenSelect] = useState(false)
    const [formData, setFormData] = useState(business)
    useEffect(()=>{
        //remove formsIDs in business object
        const {formsIDs, ...businessData} = business
        //set business data to formData
        setFormData(businessData)
    },[business])
    
    const setSelectedResident = (resident) => {
        setFormData({
            ...formData,
            residentID: resident
        })
        toast.success('Owner selection successful')
    }

    const handleQueryChange = (e) => {
        let value = e.target.value

        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const handleSaveChanges = async() => {
        //build data to be sent to server
        const bodyToSend = {
            ...formData,
            residentID: formData.residentID._id
        }

        try {
            const {data} = await axios.put(`${API_URL}business/update/${formData._id}`, bodyToSend)
            console.log(data)
            toast.success('Business details updated')
        } catch(error) {
            toast.error('Failed to update business details')
            console.log(error)
        }

    }

    return (
        <div className='flex flex-col  rounded-md w-2/3 shadow-lg p-8 overflow-y-auto h-fit'>
            <div className='flex flex-col justify-center gap-4'>
                <h2 className="text-lg font-medium text-gray-800">Edit Business Details</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-medium text-sm">Owner</h2>
                        <h4 className="text-lg">{formData?.residentID?.name?.last}, {formData?.residentID?.name?.first} {formData?.residentID?.name?.middle} {formData?.residentID?.name?.suffix}</h4>
                    </div>
                    <button onClick={()=>setOpenSelect(true)} className="bg-blue-500 text-sm text-white p-1 rounded-md">Select New Owner</button>
                </div>
                <hr className="my-4"/>
                <div>
                    <h2 className="font-medium text-sm">Business Name</h2>
                    <input type="text" name="businessName" onChange={handleQueryChange} value={formData?.businessName} className="border text-lg p-2 w-full mb-4 rounded-md"/>
                    <h2 className="font-medium text-sm">Location</h2>
                    <input type="text" name="location" onChange={handleQueryChange} value={formData?.location} className="border text-lg p-2 w-full mb-4 rounded-md"/>
                    <h2 className="font-medium text-sm">Nature of Business</h2>
                    <input type="text" name="natureOfBusiness" onChange={handleQueryChange} value={formData?.natureOfBusiness} className="border text-lg p-2 w-full mb-4 rounded-md"/>
                    <h2 className="font-medium text-sm">Cellphone Number</h2>
                    <input type="text" name="cellphoneNumber" onChange={handleQueryChange} value={formData?.cellphoneNumber} className="border text-lg p-2 w-full mb-4 rounded-md"/>
                    <h2 className="font-medium text-sm">Plate Number</h2>
                    <input type="text" name="plateNumber" onChange={handleQueryChange} value={formData?.plateNumber} className="border text-lg p-2 w-full mb-4 rounded-md"/>
                    <h2 className="font-medium text-sm">Amount</h2>
                    <input type="number" name="amount" onChange={handleQueryChange} value={formData?.amount} className="border text-lg p-2 w-full mb-4 rounded-md"/>
                </div>
                <button onClick={handleSaveChanges} className="bg-green-500 text-white p-2 rounded-md">Save Changes</button>
            </div>
            {
                openSelect && <ResidentSelector setOpen={setOpenSelect} setSelectedResident={setSelectedResident}/>
            }
        </div>
    )
}

export default EditBusiness
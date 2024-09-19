import axios from 'axios'
import {useState, useEffect} from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import WebcamCapture from '../residents/ResidentCameraModal'
import API_URL from '../../constants/api'
import ResidentSelector from '../business/ResidentSelector'

const AddForm = () => {
    const [selectedResident, setSelectedResident] = useState(null)
    const [borrowDetails, setBorrowDetails] = useState({
        vehicle: '',
        dateBorrowed: '',
        placeWent: '',
        reason: '',
        numberOfPassengers: 1,
    })
    const [openResidentSelector, setOpenResidentSelector] = useState(false)

    const handleQueryChange = (e) => {
        let value

        setBorrowDetails( prevState => {
            if(e.target.name === 'numberOfPassengers') {
                value = parseInt(e.target.value)
            } else {
                value = e.target.value
            }

            return {
                ...prevState,
                [e.target.name]: value
            }
        })
    }

    const setDateAndTimeToNow = () => {
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1
        const day = now.getDate()
        const hours = now.getHours()
        const minutes = now.getMinutes()

        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
        const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`

        setBorrowDetails(prevState => {
            return {
                ...prevState,
                dateBorrowed: `${formattedDate}T${formattedTime}`
            }
        })
    }

    const handleSave = async () => {
        if (Object.values(borrowDetails).some(value => value === '')) {
            toast.error('Please fill all fields')
            return
        }

        let body = {
            ...borrowDetails,
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
            const {data} = await axios.post(`${API_URL}borrow`, body)
            console.log(data)
            toast.success(data.message)
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex shadow-lg flex-col p-8 w-full">
            <div className="w-full mb-4">
                <h3 className="font-semibold text-2xl text-gray-700">Record Vehicle Usage</h3>
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
                        <div className="flex flex-col w-full gap-2">
                            <label className='font-semibold text-xs'>Vehicle Type</label>
                            <select type="text" className="p-2 border" name='vehicle' value={borrowDetails?.vehicle || ''} onChange={handleQueryChange}>
                                <option value="RescuePatrol">Barangay Rescue Patrol</option>
                                <option value="Ambulance">Barangay Ambulance</option>
                                <option value="">Select vehicle</option>
                            </select>

                            <label className='font-semibold text-xs mt-4'>Date & Time Borrowed</label>
                            <div className='w-full flex items-center gap-2'>
                                <input type="datetime-local" placeholder="Date and time" className="p-2 border w-3/4" name='' value={borrowDetails?.dateBorrowed} onChange={handleQueryChange}/>
                                <button className='p-2 bg-blue-500 w-1/4 text-xs text-white rounded-md' onClick={setDateAndTimeToNow} >Current date&time</button>
                            </div>
                            

                            <label className='font-semibold text-xs mt-4'>Place Went</label>
                            <input type="text" placeholder="Place went" className="p-2 border" name='placeWent' value={borrowDetails?.placeWent} onChange={handleQueryChange}/>
                        
                            <label className='font-semibold text-xs mt-4'>Reason</label>
                            <textarea type="text" placeholder="Reason" className="p-2 border" name='reason' value={borrowDetails?.reason} onChange={handleQueryChange}/>

                            <label className='font-semibold text-xs mt-4'>Number of Passengers</label>
                            <input type="number" placeholder="Number of passengers" className="p-2 border" name='numberOfPassengers' value={borrowDetails?.numberOfPassengers} onChange={handleQueryChange}/>
                        </div>
                    </div>
                )
            }

            <div className="flex flex-col w-full gap-2">
                <button className="w-full bg-blue-500 text-white p-2 rounded-md" onClick={() => setOpenResidentSelector(true)}>Select Resident</button>
                {
                    selectedResident && <button className={`bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-all w-full`} onClick={handleSave}>Add History</button>
                }
                
            </div>
            {
                openResidentSelector && <ResidentSelector manualOption={true} setOpen={setOpenResidentSelector} setSelectedResident={setSelectedResident}/>
            }
        </div>
    )
}
export default AddForm
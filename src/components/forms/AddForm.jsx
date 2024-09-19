import axios from 'axios'
import {useState, useEffect} from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import WebcamCapture from '../residents/ResidentCameraModal'
import API_URL from '../../constants/api'

const AddForm = () => {
    const [nonResident, setNonResident] = useState({
        name: {
            first: '',
            middle: '',
            last: '',
            suffix: ''
        },
        address: '',
        dateOfBirth: '',
        placeOfBirth: ''
    })

    const [formData, setFormData] = useState({
        CTCNo: '',
        ORNo: '',
        dateIssued: '',
        placeIssued: 'Pandi, Bulacan',
        location: '',
    })

    const [formType, setFormType] = useState('')
    const [formDisplay, setFormDisplay] = useState('')
    const [nonResidentForm, setNonResidentForm] = useState(false)

    const [openPicture, setOpenPicture] = useState(false);
    const [photo, setPhoto] = useState(null);

    const handleQueryChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
    
        if (keys.length > 1) {
            setNonResident(prevData => ({
                ...prevData,
                [keys[0]]: {
                    ...prevData[keys[0]],
                    [keys[1]]: value
                }
            }));
        } else {
            setNonResident({
                ...nonResident,
                [name]: value
            });
        }
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleGenerate = async () => {
        //check for values
        // if(!additionalData.dateIssued) {
        //     toast.error('Please input a date issued');
        //     return;
        // }
        if(formType === '') {
            toast.error('Please select a form type');
            return;
        }

        if(!nonResident?.name?.first || !nonResident?.name?.last) {
            toast.error('Please input a name');
            return;
        }

        if(!nonResident.address) {
            toast.error('Please input an address');
            return;
        }

        if(!nonResident.dateOfBirth) {
            toast.error('Please input a date of birth');
            return;
        }

        if(!nonResident.placeOfBirth) {
            toast.error('Please input a place of birth');
            return;
        }

        if(!photo) {
            toast.error('Please input an image');
            return;
        }

        const isConfirmed = await confirm('Are you sure you want to generate this document?');
        if (!isConfirmed) return;

        const dataToSend = new FormData();
        dataToSend.append('image', photo);
        dataToSend.append('nonResident', JSON.stringify(nonResident));
        dataToSend.append('isResident', false);
        dataToSend.append('CTCNo', formData.CTCNo);
        dataToSend.append('ORNo', formData.ORNo);
        dataToSend.append('dateIssued', formData.dateIssued);
        dataToSend.append('placeIssued', formData.placeIssued);
        dataToSend.append('formType', formType);
        dataToSend.append('formName', formDisplay);


        let formTempType = {
            location: formData.location,
        }
        
        switch (formType) {
            case 'BDC':
                dataToSend.append('building', JSON.stringify(formTempType));
                break;
            case 'ECC':
                dataToSend.append('electrical', JSON.stringify(formTempType));
                break;
            case 'EX':
                dataToSend.append('excavation', JSON.stringify(formTempType));
                break;
            case 'FC':
                dataToSend.append('fencing', JSON.stringify(formTempType));
                break;
            default:
        }


        try{
            //create form in the backend, if failed do not generate document
            const response = await axios.post(`${API_URL}form/create/non-resident`, dataToSend, {
                responseType: 'arraybuffer' 
            })
            console.log(response)
            //download the docx file
            const file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
            const fileURL = URL.createObjectURL(file);

            const link = document.createElement('a');
            link.href = fileURL;
            link.download = `${formDisplay}_${nonResident?.name?.first}_${nonResident?.name?.last}.docx`;
            link.click();

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex shadow-lg flex-col p-8 w-full">
            <div className="w-full mb-4">
                <h3 className="font-semibold flex items-center gap-2 text-2xl text-gray-700">Generate Form <span className='text-sm font-normal'>(for non residents)</span></h3>
            </div>

            {
                nonResidentForm && (
                    <div className="flex flex-col gap-4">
                        <div className='flex flex-col gap-2 w-full'>
                            <label className="text-sm text-gray-700">Select Form Type</label>
                            <select  className="border font-semibold border-gray-300 p-2 rounded-md" value={formType || ''} onChange={(e)=> {
                                setFormType(e.target.value)
                                setFormDisplay(e.target.options[e.target.selectedIndex].innerText);
                            }}>
                                <option value="BDC">Building Clearance</option>
                                <option value="ECC">Electrical Clearance</option>
                                <option value="EX">Excavation Clearance</option>
                                <option value="FC">Fencing Clearance</option>
                                <option value="">Select Form Type</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-4 mb-4">
                            <h3 className="font-medium text-sm text-gray-600">Image to Attach</h3>
                            <div className="flex items-center gap-4">
                                {photo && <img src={URL.createObjectURL(photo)} alt="preview" className='w-[100px]'/>}
                                <button className="bg-blue-500 rounded-md p-2 hover:bg-blue-600 transition-all" onClick={() => setOpenPicture(true)}><svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 512 512"><circle cx="256" cy="272" r="64" fill="white"/><path fill="white" d="M432 144h-59c-3 0-6.72-1.94-9.62-5l-25.94-40.94a15.5 15.5 0 0 0-1.37-1.85C327.11 85.76 315 80 302 80h-92c-13 0-25.11 5.76-34.07 16.21a15.5 15.5 0 0 0-1.37 1.85l-25.94 41c-2.22 2.42-5.34 5-8.62 5v-8a16 16 0 0 0-16-16h-24a16 16 0 0 0-16 16v8h-4a48.05 48.05 0 0 0-48 48V384a48.05 48.05 0 0 0 48 48h352a48.05 48.05 0 0 0 48-48V192a48.05 48.05 0 0 0-48-48M256 368a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96"/></svg></button>
                                {
                                    openPicture && (
                                        <WebcamCapture setPhoto={setPhoto} onClose={()=>setOpenPicture(false)}/>
                                    )
                                }
                            </div>
                        </div>

                        <div className='flex items-center justify-between w-full gap-2'>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="first" className="text-sm text-gray-700">First Name</label>
                                <input type="text" value={nonResident.name.first} name='name.first' className="border font-semibold border-gray-300 p-2 rounded-md" placeholder='first name' onChange={handleQueryChange}/>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="first" className="text-sm text-gray-700">Middle Name</label>
                                <input onChange={handleQueryChange} value={nonResident.name.middle} type="text" name='name.middle' className="border font-semibold border-gray-300 p-2 rounded-md" placeholder='middle name'/>
                            </div>
                        </div>
                        <div className='flex items-center justify-between w-full gap-2'>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="first" className="text-sm text-gray-700">Last Name</label>
                                <input onChange={handleQueryChange} value={nonResident.name.last} type="text"name='name.last' className="border font-semibold border-gray-300 p-2 rounded-md" placeholder='last name'/>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="first" className="text-sm text-gray-700">Suffix</label>
                                <input onChange={handleQueryChange} value={nonResident.name.suffix} type="text" name='name.suffix' className="border font-semibold border-gray-300 p-2 rounded-md" placeholder='suffix'/>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label htmlFor="address" className="text-sm text-gray-700">Address</label>
                            <input onChange={handleQueryChange} value={nonResident.address} type="text" name='address' className="border font-semibold border-gray-300 p-2 rounded-md" />
                        </div>
                        
                        <div className='flex items-center justify-between w-full gap-2'>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="dateOfBirth" className="text-sm text-gray-700">Date of Birth</label>
                                <input onChange={handleQueryChange} value={nonResident.dateOfBirth} type="date" name='dateOfBirth' className="border font-semibold  border-gray-300 p-2 rounded-md" />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="placeOfBirth" className="text-sm text-gray-700">Place of Birth</label>
                                <input onChange={handleQueryChange} value={nonResident.placeOfBirth} type="text" name='placeOfBirth' className="border font-semibold border-gray-300 p-2 rounded-md" />
                            </div>
                        </div>
                        <hr className='h-[15px]'/>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="address" className="text-sm text-gray-700">Property Location</label>
                            <input type="text" name='location' onChange={handleFormChange} value={formData.location} className="border font-semibold border-gray-300 p-2 rounded-md" />
                        </div>
                        <div className='flex items-center justify-between w-full gap-2'>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="dateOfBirth" className="text-sm text-gray-700">CTC No</label>
                                <input type="text" name='CTCNo' onChange={handleFormChange} value={formData.CTCNo} className="border font-semibold border-gray-300 p-2 rounded-md" />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="placeOfBirth" className="text-sm text-gray-700">OR No</label>
                                <input type="text" name='ORNo' onChange={handleFormChange} value={formData.ORNo} className="border font-semibold border-gray-300 p-2 rounded-md" />
                            </div>
                        </div>
                        <div className='flex items-center justify-between w-full gap-2'>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="dateOfBirth" className="text-sm text-gray-700">CTC Date</label>
                                <input type="date" name='dateIssued' onChange={handleFormChange} value={formData.dateIssued} className="border font-semibold border-gray-300 p-2 rounded-md" />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="placeOfBirth" className="text-sm text-gray-700">Place Issued</label>
                                <input type="text" name='placeIssued' onChange={handleFormChange} value={formData.placeIssued} className="border font-semibold border-gray-300 p-2 rounded-md" />
                            </div>
                        </div>
                    </div>
                )
            }

            {
                nonResidentForm ? (
                    <div className="flex flex-col w-full gap-2 mt-8">
                        <button onClick={handleGenerate} className="w-full hover:bg-green-600 duration-75 transition-all animation bg-green-500 text-center text-white p-2 rounded-md">Generate Form</button>
                        <button onClick={()=>setNonResidentForm(false)} className="w-full hover:bg-red-500 text-red-500 animation duration-75 transition-all border-red-500 border  hover:text-white p-2 rounded-md">Cancel</button>
                    </div>
                ) : (                    
                    <div className="flex flex-col w-full gap-2 mt-8">
                        <Link to='/residents' className="w-full hover:bg-blue-600 duration-75 transition-all animation bg-blue-500 text-center text-white p-2 rounded-md">Resident of Barangay</Link>
                        <button onClick={()=>setNonResidentForm(true)} className="w-full hover:bg-blue-500 text-blue-500 animation duration-75 transition-all border-blue-500 border  hover:text-white p-2 rounded-md">Non-Resident</button>
                    </div>
                )
            }

        </div>
    )
}

export default AddForm
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../../constants/api";
import validateDate from "../../helper/validateDate";
import prepareData from "../../helper/prepareData";

const ResidentAddModal = ({onClose}) => {
    const navigate = useNavigate()
    const [resident, setResident] = useState({
        name: {
            first: '',
            last: '',
            middle: '',
            suffix: ''
        },
        dateOfBirth: '',
        placeOfBirth: '',
        yrsOfResidency: 0,
        address: {
            streetName: '',
            apartment: '',
            householdNumber: '',
            sitio: ''
        },
        sex: 'M',
    })

    const handleChange = (path, value) => {
        setResident(prevState => {
            const newState = { ...prevState };
            let schema = newState; // a moving reference to internal objects within newState
            const pList = path.split('.');
            const len = pList.length;
            for(let i = 0; i < len-1; i++) {
                let elem = pList[i];
                if( !schema[elem] ) schema[elem] = {}
                schema = schema[elem];
            }
            schema[pList[len-1]] = value;
            return newState;
        });
    }

    const handleDateChange = (value) => {
        if (value.length === 8) {
            const formattedValue = value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
            handleChange('dateOfBirth', formattedValue);
        } else {
            handleChange('dateOfBirth', value);
        }
    };

    const clearForm = () => {
        setResident({
            name: {
                first: '',
                last: '',
                middle: '',
                suffix: ''
            },
            dateOfBirth: '',
            placeOfBirth: '',
            yrsOfResidency: 0,
            address: {
                streetName: '',
                apartment: '',
                householdNumber: '',
                sitio: ''
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        toast.loading('Adding Resident');
        //check if date is valid
        if (resident.dateOfBirth.length !== 10) {
            toast.dismiss();
            toast.error('Invalid date format');
            return;
        }

        const dateValid = validateDate(resident.dateOfBirth);
        if (!dateValid) {
            toast.dismiss();
            toast.error('Invalid date format');
            return;
        }
    
        // Prepare data for submission
        let dataToSubmit = { ...resident };
        prepareData(dataToSubmit);
    
        try {
            onClose();
            const res = await axios.post(`${API_URL}resident/create`, dataToSubmit);
            console.log(res);
            toast.dismiss();
            toast.success('Resident added successfully');
            clearForm();
            navigate(`/residents/${res.data.resident._id}`);
        } catch (error) {
            onClose();
            toast.dismiss();
            console.log(error)
            toast.error(error.response.data.message);
        }
    };
    
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Resident</h3>
                        <div className="mt-4 flex gap-2 items-center">
                            <div className="flex flex-col">
                                <label className="text-sm">Last Name</label>
                                <input type="text" className="p-2 border border-gray-300 rounded-sm w-full mb-4" value={resident?.name.last} onChange={e => handleChange('name.last', e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm">First Name</label>
                                <input type="text" className="p-2 border border-gray-300 rounded-sm w-full mb-4" value={resident?.name.first} onChange={e => handleChange('name.first', e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm">Middle Name</label>
                                <input type="text" className="p-2 border border-gray-300 rounded-sm w-full mb-4" value={resident?.name.middle} onChange={e => handleChange('name.middle', e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm">Suffix</label>
                                <select  onChange={e => handleChange('name.suffix', e.target.value)}  className="p-2 border border-gray-300 rounded-sm w-full mb-4" name="name.suffix" value={resident?.name?.suffix || ''}>
                                    <option value="">None</option>
                                    <option value="JR">Jr</option>
                                    <option value="SR">Sr</option>
                                    <option value="II">II</option>
                                    <option value="III">III</option>
                                    <option value="IV">IV</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2 items-center w-full">
                            <div className="flex flex-col">
                                <label className="text-sm">Birthdate <span className="text-xs">(yyyy-mm-dd)</span></label>
                                <input type="text" className="p-2 border border-gray-300 rounded-sm w-full mb-4" value={resident.dateOfBirth} onChange={e=>handleDateChange(e.target.value)} maxLength={8}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm">Place Of Birth</label>
                                <input type="text" className="p-2 border border-gray-300 rounded-sm w-full mb-4" value={resident.placeOfBirth} onChange={e=>handleChange('placeOfBirth', e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm">Yrs of Residency</label>
                                <input type="number" className="p-2 border border-gray-300 rounded-sm w-full mb-4" value={resident.yrsOfResidency} onChange={e=>handleChange('yrsOfResidency', e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm">Sex</label>
                                <select className="p-2 border border-gray-300 rounded-sm w-full mb-4" value={resident.sex} onChange={e=>handleChange('sex', e.target.value)}>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2 items-center">
                            <div className="flex flex-col">
                                <label className="text-sm">Street</label>
                                <input type="text" className="p-2 border border-gray-300 rounded-sm w-full mb-4" value={resident.address.streetName} onChange={e=>handleChange('address.streetName', e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm">Apartment</label>
                                <input type="text" className="p-2 border border-gray-300 rounded-sm w-full mb-4" value={resident.address.apartment} onChange={e=>handleChange('address.apartment', e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm">HouseNo</label>
                                <input type="text" className="p-2 border border-gray-300 rounded-sm w-full mb-4" value={resident.address.householdNumber} onChange={e=>handleChange('address.householdNumber', e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm">Sitio</label>
                                <input type="text" className="p-2 border border-gray-300 rounded-sm w-full mb-4" value={resident.address.sitio} onChange={e=>handleChange('address.sitio', e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                        <button onClick={handleSubmit} type="button" className={`bg-green-500 ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-0 sm:w-auto sm:text-sm`}>
                            Confirm
                        </button>
                        <button onClick={onClose} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResidentAddModal;
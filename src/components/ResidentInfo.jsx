import { useEffect, useState } from "react";
import WebcamCapture from "./residents/ResidentCameraModal";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../constants/api";
import validateDate from "../helper/validateDate";
import prepareData from "../helper/prepareData";

const ResidentInfo = ({residentData}) => {
    const [resident, setResident] = useState({});

    const [openPicture, setOpenPicture] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleChange = (path, value) => {
        setResident(prevState => {
            const newState = { ...prevState };
            let schema = newState;
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

    const handleDateChange = (path, value) => {
        if (value.length === 8) {
            const formattedValue = value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
            handleChange(path, formattedValue);
        } else {
            handleChange(path, value);
        }
    };

    const handleSave = async () => {
        toast.loading('Saving changes...');
        const isValidDate = validateDate(resident.dateOfBirth);
        if (!isValidDate) {
            toast.dismiss();
            toast.error('Invalid birth date format');
            return;
        }
        if(resident.dateOfDeath && resident.dateOfDeath !== ''){
            const isValidDeathDate = validateDate(resident.dateOfDeath);
            if (!isValidDeathDate) {
                toast.dismiss();
                toast.error('Invalid death date format');
                return;
            }
        }

        try{
            let dataToSubmit = { ...resident };
            prepareData(dataToSubmit);

            const {data} = await axios.put(`${API_URL}resident/update/${residentData._id}`, dataToSubmit);
            console.log(data);
            toast.dismiss();
            toast.success('Resident updated successfully');
        } catch (error) {
            toast.dismiss();
            toast.error('An error occurred');
            console.error(error);
        }
        
    }

    const handlePfpSave = async () => {
        const formData = new FormData();
        formData.append('image', photo);
        formData.append('fileIsRequired', true);
        try {
            const {data} = await axios.put(`${API_URL}resident/update-pfp/${residentData._id}`, formData);
            console.log(data);
            toast.success('Profile picture updated successfully');
            setTimeout(() => {
                window.location.reload();
            },1000);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        console.log(residentData)
        setResident(residentData);
        console.log(residentData.dateOfBirth, residentData.dateOfDeath)
        if(residentData.dateOfBirth){
            setResident({...residentData, dateOfBirth: residentData.dateOfBirth.split('T')[0]});
        }
        if(residentData.dateOfDeath){
            setResident({...residentData, 
                dateOfDeath: residentData.dateOfDeath.split('T')[0],
                dateOfBirth: residentData.dateOfBirth.split('T')[0]
            });
        }
    }, [residentData]);

    return (
        <div>
            <div className="flex justify-between px-8 pt-4">
                <h3 className="font-semibold text-2xl text-gray-700 mb-4">Details</h3>  
                <button onClick={handleSave} className="p-2 bg-green-500 text-white rounded-md font-medium">Save Changes</button>
            </div>
            
            <div className="flex flex-col p-8 w-full h-[82vh] overflow-auto">
                <div className="flex flex-col gap-4 mb-4">
                    <h3 className="font-medium text-sm text-gray-600">Profile Picture</h3>
                    <div className="flex items-center gap-4">
                        {photo && <img src={URL.createObjectURL(photo)} alt="preview" />}
                        <button className="bg-blue-500 rounded-md p-2 hover:bg-blue-600 transition-all" onClick={() => setOpenPicture(true)}><svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 512 512"><circle cx="256" cy="272" r="64" fill="white"/><path fill="white" d="M432 144h-59c-3 0-6.72-1.94-9.62-5l-25.94-40.94a15.5 15.5 0 0 0-1.37-1.85C327.11 85.76 315 80 302 80h-92c-13 0-25.11 5.76-34.07 16.21a15.5 15.5 0 0 0-1.37 1.85l-25.94 41c-2.22 2.42-5.34 5-8.62 5v-8a16 16 0 0 0-16-16h-24a16 16 0 0 0-16 16v8h-4a48.05 48.05 0 0 0-48 48V384a48.05 48.05 0 0 0 48 48h352a48.05 48.05 0 0 0 48-48V192a48.05 48.05 0 0 0-48-48M256 368a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96"/></svg></button>
                        {
                            photo && (
                                <button onClick={handlePfpSave} className="bg-green-500 rounded-md p-2 hover:bg-green-600 transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="white" d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg></button>
                            )
                        }
                        {
                            openPicture && (
                                <WebcamCapture setPhoto={setPhoto} onClose={()=>setOpenPicture(false)}/>
                            )
                        }
                    </div>
                </div>
                <hr  className="my-4"/>
                <h3 className="font-medium my-2 bg-blue-500 text-white w-fit p-2">Personal Details</h3>
                <div className="flex items-center flex-wrap gap-2">
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">First Name</label>
                        <input type="text" className="border py-2 px-1 border-gray-400 rounded-sm font-semibold" value={resident?.name?.first} onChange={e=>handleChange('name.first', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Middle Name</label>
                        <input type="text" className="border py-2 px-1 border-gray-400 rounded-sm font-semibold" value={resident?.name?.middle} onChange={e=>handleChange('name.middle', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Last Name</label>
                        <input type="text" className="border py-2 px-1 border-gray-400 rounded-sm font-semibold" value={resident?.name?.last} onChange={e=>handleChange('name.last', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-1/12">
                        <label className="text-sm">Suffix</label>
                        <select className="border-b border px-2 py-1 border-gray-400 rounded-sm font-semibold" name="suffix" value={resident?.name?.suffix || ''}  onChange={e=>handleChange('name.suffix', e.target.value)}>
                            <option value="">None</option>
                            <option value="JR">Jr</option>
                            <option value="SR">Sr</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-1/12">
                        <label className="text-sm">Sex</label>
                        <select className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.sex || ''} onChange={e=>handleChange('sex', e.target.value)}>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="">Unset</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-1/12">
                        <label className="text-sm ">Blood Type</label>
                        <select className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.bloodType || ''} onChange={e=>handleChange('bloodType', e.target.value)}>
                            <option value="O">O</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="AB">AB</option>
                            <option value="">Unset</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Birthdate <span className="text-xs text-gray-700">(yyyy-mm-dd)</span></label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.dateOfBirth} maxLength={8} onChange={e=>handleDateChange('dateOfBirth', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Birthplace</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.placeOfBirth} onChange={e=>handleChange('placeOfBirth', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Deathdate <span className="text-xs text-gray-700">(yyyy-mm-dd)</span></label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.dateOfDeath || ''} maxLength={8} onChange={e=>handleDateChange('dateOfDeath', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-1/12">
                        <label className="text-sm">Weight (kg)</label>
                        <input type="number" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" maxLength={3} value={resident?.weight || null} onChange={e=>handleChange('weight', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-1/12">
                        <label className="text-sm">Height (cm)</label>
                        <input type="number" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold"  maxLength={3} value={resident?.height || null} onChange={e=>handleChange('height', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Education</label>
                        <select name="education"  className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.educationalAttainment || ''} onChange={e=>handleChange('educationalAttainment', e.target.value)}>
                            <option value="elementary">Elementary</option>
                            <option value="highschool">Highschool</option>
                            <option value="undergraduate">Undergraduate</option>
                            <option value="masteral">Masteral</option>
                            <option value="doctorate">Doctorate</option>
                            <option value="non">Non</option>
                            <option value="">Unset</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-1/12">
                        <label className="text-sm">Citizenship</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.citizenship} onChange={e=>handleChange('citizenship', e.target.value)}/>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm">Civil Status</label>
                        <select className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.civilStatus || ''} onChange={e=>handleChange('civilStatus', e.target.value)}>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Separated">Separated</option>
                            <option value="">Unset</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Religion</label>
                        <select className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.religion || ''} onChange={e=>handleChange('religion', e.target.value)}>
                            <option value="Roman Catholic">Catholic</option>
                            <option value="Islam">Islam</option>
                            <option value="Iglesia ni Cristo">INC</option>
                            <option value="Jehova's Witnesses">Jehova</option>
                            <option value="Buddhism">Buddhism</option>
                            <option value="Other">Others</option>
                            <option value="">Unset</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Yrs Of Residency</label>
                        <input type="number" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.yrsOfResidency} onChange={e=>handleChange('yrsOfResidency', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Registered Voter</label>
                        <select type="number" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.voterInfo?.isRegistered} onChange={e=>handleChange('voterInfo.isRegistered', e.target.value)}>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                            <option value="">Unset</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Precicnt Number</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.voterInfo?.precinctNumber} onChange={e=>handleChange('voterInfo.precinctNumber', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Voters ID Number</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.voterInfo?.voterID} onChange={e=>handleChange('voterInfo.voterID', e.target.value)}/>
                    </div>
                </div>
                <hr  className="my-4"/>
                <h3 className="font-medium my-2 bg-green-500 text-white w-fit p-2">Address</h3>
                <div className="flex items-center flex-wrap gap-2 mt-2">
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Street</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.address?.streetName} onChange={e=>handleChange('address.streetName', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Apartment</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.address?.apartment} onChange={e=>handleChange('address.apartment', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-1/12">
                        <label className="text-sm">HouseNo</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.address?.householdNumber} onChange={e=>handleChange('address.householdNumber', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Sitio</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.address?.sitio} onChange={e=>handleChange('address.sitio', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Mobile Number</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.mobileNumber} onChange={e=>handleChange('mobileNumber', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Landline Number</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.landlineNumber} onChange={e=>handleChange('landlineNumber', e.target.value)}/>
                    </div>
                </div>
                <hr className="my-4"/>
                <h3 className="font-medium my-2 bg-red-500 text-white w-fit p-2">Emergency Contact Person</h3>
                <div className="flex items-center flex-wrap gap-2 mt-2">
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Name</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.emergencyContact?.name} onChange={e=>handleChange('emergencyContact.name', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Number</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.emergencyContact?.mobileNumber} onChange={e=>handleChange('emergencyContact.mobileNumber', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Relationship</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.emergencyContact?.relationship} onChange={e=>handleChange('emergencyContact.relationship', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Address</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.emergencyContact?.address} onChange={e=>handleChange('emergencyContact.address', e.target.value)}/>
                    </div>
                </div>

                <hr className="my-4"/>
                <h3 className="font-medium my-2 bg-yellow-500 text-white w-fit p-2">Employment</h3>
                <div className="flex items-center flex-wrap gap-2 mt-2">
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Occupation</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.employment?.occupation} onChange={e=>handleChange('employment.occupation', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Employer</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.employment?.employer} onChange={e=>handleChange('employment.employer', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Employer Address</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.employment?.employerAddress} onChange={e=>handleChange('employment.employerAddress', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Years Employed</label>
                        <input type="number" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.employment?.yearsEmployed} maxLength={2} onChange={e=>handleChange('employment.yearsEmployed', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Employment Status</label>
                        <select className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.employment?.employmentStatus || ''} onChange={e=>handleChange('employment.employmentStatus', e.target.value)}>
                            <option value="Employed">Employed</option>
                            <option value="Unemployed">Unemployed</option>
                            <option value="Unemployed">Self-Employed</option>
                            <option value="Retired">Retired</option>
                            <option value="">Unset</option>
                        </select>
                    </div>
                </div>

                <hr className="my-4"/>
                <h3 className="font-medium my-2 bg-orange-500 text-white w-fit p-2">IDs</h3>
                <div className="flex items-center flex-wrap gap-2 mt-2">
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">SSS</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.IDs?.SSS} onChange={e=>handleChange('IDs.SSS', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">TIN</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.IDs?.TIN} onChange={e=>handleChange('IDs.TIN', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">PAG-IBIG</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.IDs?.PAGIBIG} onChange={e=>handleChange('IDs.PAGIBIG', e.target.value)}/>
                    </div>
                    <div className="flex flex-col w-2/12">
                        <label className="text-sm">Philhealth</label>
                        <input type="text" className="border py-2 border-gray-400 rounded-sm px-1 font-semibold" value={resident?.IDs?.PhilHealth} onChange={e=>handleChange('IDs.PhilHealth', e.target.value)}/>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default ResidentInfo;
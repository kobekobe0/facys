import axios from "axios"
import API_URL from "../constants/api"
import ResidentInfo from "./ResidentInfo"
import ResidentFormModal from "./residents/ResidentFormModal"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import WebcamCapture from "./residents/ResidentCameraModal"

const withPurpose = ['BRC','BC', 'CH', 'IC']
const withImg = ['BRC', 'SLP', 'WP', 'BC', "TODA", 'IC']
const withLocation = ['ECC', 'EX', 'FC', 'BDC']

const FormCard = ({form, open}) => {
    return (
        <div onClick={open} className="w-full hover:bg-gray-200 transition-all rounded-md border border-b my-2 p-4 flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                    <p className="text-md font-medium">
                        {form.formNumber}
                    </p>
                    <p className="font-normal text-gray-700">
                        {form.formName}
                    </p>
                </div>
            </div>
            <div>
                <span className="text-sm font-semibold text-gray-500">
                    {new Date(form.formDateIssued).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>
        </div>
    )    
}

const BusinessCard = ({business}) => {
    return (
        <Link to={`/business/${business._id}`} className="w-full hover:bg-gray-200 transition-all rounded-md border border-b my-2 p-4 flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className={`h-2 w-2 ${business.isClosed ? 'bg-red-500' : 'bg-green-500'} text-white rounded-full`}></div>
                    <p className="text-md font-medium">
                        {business.businessName}
                    </p>
                    <p className="font-normal text-gray-700">
                        {business.location}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-500">
                    {business?.natureOfBusiness}
                </span>
            </div>
        </Link>
    )
}
const IndigentCard = ({indigent}) => {
    return (
        <div className="w-full hover:bg-gray-200 transition-all rounded-md border border-b my-2 p-4 flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                    <p className="text-md font-medium">
                        {indigent?.recommendation}
                    </p>
                    <p className="font-normal text-gray-700">
                        {indigent.amount && indigent.amount.toLocaleString('en-US', {style: 'currency', currency: 'PHP'})}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-500">
                    {indigent?.approvedAt ? new Date(indigent?.approvedAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                </span>
            </div>
        </div>
    )
}

const ResidentFormRequest = ({id, resident}) => { // TODO: FORM LIST
    const [activeForm, setActiveForm] = useState(null)
    const [forms, setForms] = useState([])
    const [businesses, setBusinesses] = useState([])
    const [formType, setFormType] = useState('')
    const [formDisplay, setFormDisplay] = useState('');
    const [formTypeQuery, setFormTypeQuery] = useState('')
    const [indigentHistory, setIndigentHistory] = useState([])
    const [photo, setPhoto] = useState(null);
    const [openPicture, setOpenPicture] = useState(false);

    const [additionalData, setAdditionalData] = useState({
        CTCNo: '',
        ORNo: '',
        placeIssued: 'Pandi, Bulacan',
        dateIssued: '',
        purpose: '',
        yrsOfResidency: resident?.yrsOfResidency,
        coHabitation: {
            resident1: '',
            resident2: '',
            dateOfCoHabitation: '',
            blotterEntryNumber: '',
            dateOfBlotter: '',
            numberOfChildren: 0
        },
        TODA: {
            model: '',
            motorNumber: '',
            chassisNumber: '',
            plateNumber: '',
        },
        employment: {
            position: '',
            dateLastEmployed: '',
            companyName: '',
            location: '',
        },
        ITR: {
            incomeMin: 0,
            incomeMax: 0,
        },
        indigency: {
            beneficiaryName: '',
            relationToBeneficiary: '',
        },
        lateBC: {
            father: '',
            mother: '',
            fatherOccupation: '',
            motherOccupation: '',
            placeOfBirth: '',
            dateOfBirth: '',
            religion: '',
            isMerried: false,
            nameOfChild: '',
            school: '',
        },
        location: ''
    })

    const setDateToNow = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        setAdditionalData({
            ...additionalData,
            dateIssued: formattedDate
        })
    }

    useEffect(()=>{
        setAdditionalData({
            ...additionalData,
            yrsOfResidency: resident?.yrsOfResidency
        })
    }, [resident])

    const handleChangeData = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        
        if (keys.length > 1) {
            setAdditionalData(prevData => ({
                ...prevData,
                [keys[0]]: {
                    ...prevData[keys[0]],
                    [keys[1]]: value
                }
            }));
        } else {
            setAdditionalData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    }

    const handleChangeFormType = (e) => {
        setFormType(e.target.value);
        setFormDisplay(e.target.options[e.target.selectedIndex].innerText);
    };

    const fetchBusinesses = async () => {
        try {
            const {data} = await axios.get(`${API_URL}business?residentID=${id}`)
            setBusinesses(data.data)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchForms = async () => {
        try {
            //format the query
            //dd formTypeQuery to the query
            let query = `form/resident/${id}`
            query += formTypeQuery ? `?formType=${formTypeQuery}` : ''


            const {data} = await axios.get(`${API_URL}${query}`)
            setForms(data.data)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchIndigentHistory = async () => {
        try {
            const {data} = await axios.get(`${API_URL}indigent/resident/${id}`)
            console.log(data)
            setIndigentHistory(data.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handlePfpSave = async () => {
        const formData = new FormData();
        formData.append('image', photo);
        formData.append('fileIsRequired', true);
        try {
            const {data} = await axios.put(`${API_URL}resident/update-pfp/${id}`, formData);
            console.log(data);
            toast.success('Profile picture updated successfully');
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchBusinesses()
        fetchForms()
        fetchIndigentHistory()
    }, [id])

    useEffect(() => {
        fetchForms()
    }, [formTypeQuery])


    const handleGenerate = async () => {
        //check for values
        // if(!additionalData.dateIssued) {
        //     toast.error('Please input a date issued');
        //     return;
        // }

        const isConfirmed = await confirm('Are you sure you want to generate this document?');
        if (!isConfirmed) return;

        let body = {
            purpose: additionalData.purpose,
            placeIssued: additionalData.placeIssued,
            dateIssued: additionalData.dateIssued,
            CTCNo: additionalData.CTCNo,
            ORNo: additionalData.ORNo,
            formType: formType,
            formName: formDisplay,
            residentID: id,
            yrsOfResidency: additionalData.yrsOfResidency,
            coHabitation: formType == 'CH' ? additionalData.coHabitation : null,
            TODA: formType == 'TODA' ? additionalData.TODA : null,
            employment: formType == 'UEC' || formType == 'EC' ? additionalData.employment : null,
            ITR: formType == 'ITR' ? additionalData.ITR : null,
            fileIsRequired: false,
            electrical: formType == 'ECC' ? {location: additionalData.location} : null,
            excavation: formType == 'EX' ? {location: additionalData.location} : null,
            fencing: formType == 'FC' ? {location: additionalData.location} : null,
            building: formType == 'BDC' ? {location: additionalData.location} : null,
            indigency: formType == 'IC' ? additionalData.indigency : null,
            lateBC: formType == 'LBC' ? additionalData.lateBC : null
        }

        try{
            //create form in the backend, if failed do not generate document
            const response = await axios.post(`${API_URL}form/`, body, {
                responseType: 'arraybuffer' 
            })
            console.log(response)
            //download the docx file
            const file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
            const fileURL = URL.createObjectURL(file);

            const link = document.createElement('a');
            link.href = fileURL;
            link.download = `${formDisplay}_${resident?.name?.first}_${resident?.name?.last}.docx`;
            link.click();

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex flex-col w-full justify-center">
            <div className="flex flex-col p-8 w-full h-fit shadow-lg bg-gray-300 ">
                <h3 className="font-semibold text-2xl text-gray-700">Forms</h3>
                {
                   resident?.isBlocked && <p className="text-red-500 text-sm font-medium mt-2">This resident is blocked, requesting form is not possible.</p> 
                }
                <div className="flex my-2 justify-between gap-4">
                    <select name="form" className="border p-2 w-5/6 rounded-md"  value={formType} onChange={handleChangeFormType}>
                        <option value="BC">Barangay Clearance</option>
                        <option value="IC">Certification of Indigency</option>
                        <option value="BRC">Certification of Residency</option>
                        <option value="SLP">Solo Parent Certification</option>
                        <option value="WP">Water Permit Certification</option>
                        <option value="CH">Co-Habitation Certification</option>
                        <option value="TODA">TODA Clearance</option>
                        <option value="EC">Employment Certification</option>
                        <option value="UEC">Unemployment Certification</option>
                        <option value="ITR">ITR Exemption Certification</option>
                        <option value="ECC">Electrical Clearance</option>
                        <option value="EX">Excavation Clearance</option>
                        <option value="FC">Fencing Clearance</option>
                        <option value="BDC">Building Clearance</option>
                        <option value="LBC">Late Birth Registration</option>
                        <option value="FT">First Time Job Seeker</option>
                        <option value="">Select Form Type</option>
                    </select>
                    <button onClick={handleGenerate} className={`${formType == '' || resident?.isBlocked ? 'bg-green-300' : 'bg-green-500'}  text-white p-2 rounded-md w-1/6`} disabled={formType == '' || resident?.isBlocked}>Generate Form</button>
                </div>
                {
                    formType !== '' && (
                        <div className="flex w-full flex-col">
                            {
                                withImg.includes(formType) && 
                                    <div>
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
                                        <p className="text-orange-500 text-sm font-medium">This form needs resident's Image. Make sure that the resident has an image before generating.</p>
                                    </div>
                            }
                            {
                                withLocation.includes(formType) && (
                                    <>
                                        <label className="text-sm font-medium mt-2">Location</label>
                                        <input type="text" name="location" onChange={handleChangeData} value={additionalData.location} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>
                                    </>
                                )
                            }
                            {
                                formType === 'CH' && (
                                    <>
                                        <label className="text-sm font-medium mt-2">Resident 1</label>
                                        <input type="text" name="coHabitation.resident1" onChange={handleChangeData} value={additionalData.coHabitation.resident1 || ''} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>
                                    
                                        <label className="text-sm font-medium mt-2">Resident 2</label>
                                        <input type="text" name="coHabitation.resident2" onChange={handleChangeData} value={additionalData.coHabitation.resident2 || ''} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Date of Cohabitation</label>
                                        <input type="date" name="coHabitation.dateOfCoHabitation" onChange={handleChangeData} value={additionalData.coHabitation.dateOfCoHabitation || ''} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Blotter Entry Number</label>
                                        <input type="text" name="coHabitation.blotterEntryNumber" onChange={handleChangeData} value={additionalData.coHabitation.blotterEntryNumber || ''} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Date of Blotter</label>
                                        <input type="date" name="coHabitation.dateOfBlotter" onChange={handleChangeData} value={additionalData.coHabitation.dateOfBlotter || ''} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Number of Children</label>
                                        <input type="number" name="coHabitation.numberOfChildren" onChange={handleChangeData} value={additionalData.coHabitation.numberOfChildren} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>
                                    </>
                                )
                            }
                            {
                                formType === 'UEC' && (
                                    <>
                                        <label className="text-sm font-medium mt-2">Position</label>
                                        <input type="text" name="employment.position" onChange={handleChangeData} value={additionalData.employment.position} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Date Last Employed</label>
                                        <input type="date" name="employment.dateLastEmployed" onChange={handleChangeData} value={additionalData.employment.dateLastEmployed} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>
                                    </>
                                )
                            }
                            {
                                formType === 'LBC' && (
                                    <>
                                        <label className="text-sm font-medium mt-2">Father</label>
                                        <input type="text" name="lateBC.father" onChange={handleChangeData} value={additionalData.lateBC.father} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Mother's Maiden Name</label>
                                        <input type="text" name="lateBC.mother" onChange={handleChangeData} value={additionalData.lateBC.mother} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Name of Child</label>
                                        <input type="text" name="lateBC.nameOfChild" onChange={handleChangeData} value={additionalData.lateBC.nameOfChild} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Father's Occupation</label>
                                        <input type="text" name="lateBC.fatherOccupation" onChange={handleChangeData} value={additionalData.lateBC.fatherOccupation} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Mother's Occupation</label>
                                        <input type="text" name="lateBC.motherOccupation" onChange={handleChangeData} value={additionalData.lateBC.motherOccupation} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Place of Birth</label>
                                        <input type="text" name="lateBC.placeOfBirth" onChange={handleChangeData} value={additionalData.lateBC.placeOfBirth} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Date of Birth</label>
                                        <input type="date" name="lateBC.dateOfBirth" onChange={handleChangeData} value={additionalData.lateBC.dateOfBirth} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Religion</label>
                                        <input type="text" name="lateBC.religion" onChange={handleChangeData} value={additionalData.lateBC.religion} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Is Married</label>
                                        <select name="lateBC.isMerried" onChange={handleChangeData} value={additionalData.lateBC.isMerried} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg">
                                            <option value={true}>Yes</option>
                                            <option value={false}>No</option>
                                        </select>

                                    </>
                                )
                            }
                            {
                                formType === 'IC' && (
                                    <>
                                        <label className="text-sm font-medium mt-2">Requested By</label>
                                        <input type="text" name="indigency.beneficiaryName" onChange={handleChangeData} value={additionalData.indigency.beneficiaryName} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Relation to Beneficiary</label>
                                        <input type="text" name="indigency.relationToBeneficiary" onChange={handleChangeData} value={additionalData.indigency.relationToBeneficiary} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>
                                    </>
                                )
                            }
                            {
                                formType === 'EC' && (
                                    <>
                                        <label className="text-sm font-medium mt-2">Position</label>
                                        <input type="text" name="employment.position" onChange={handleChangeData} value={additionalData.employment.position} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Company Name</label>
                                        <input type="text" name="employment.companyName" onChange={handleChangeData} value={additionalData.employment.companyName} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Location</label>
                                        <input type="text" name="employment.location" onChange={handleChangeData} value={additionalData.employment.location} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>
                                    </>
                                )
                            }
                            {
                                formType === 'TODA' && (
                                    <>
                                        <label className="text-sm font-medium mt-2">Model</label>
                                        <input type="text" name="TODA.model" onChange={handleChangeData} value={additionalData.TODA.model} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Motor Number</label>
                                        <input type="text" name="TODA.motorNumber" onChange={handleChangeData} value={additionalData.TODA.motorNumber} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Chassis Number</label>
                                        <input type="text" name="TODA.chassisNumber" onChange={handleChangeData} value={additionalData.TODA.chassisNumber} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Plate Number</label>
                                        <input type="text" name="TODA.plateNumber" onChange={handleChangeData} value={additionalData.TODA.plateNumber} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>
                                    </>
                                )
                            }
                            {
                                formType === 'ITR' && (
                                    <>
                                        <label className="text-sm font-medium mt-2">Income Min</label>
                                        <input type="number" name="ITR.incomeMin" onChange={handleChangeData} value={additionalData.ITR.incomeMin} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                                        <label className="text-sm font-medium mt-2">Income Max</label>
                                        <input type="number" name="ITR.incomeMax" onChange={handleChangeData} value={additionalData.ITR.incomeMax} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>
                                    </>
                                )
                            }
                            {
                                withPurpose.includes(formType) && (
                                    <>
                                        <label className="text-sm font-medium mt-2">Purpose</label>
                                        <input type="text" name="purpose" onChange={handleChangeData} value={additionalData.purpose} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>        
                                    </>     
                                )
                            }


                            <label className="text-sm font-medium mt-2">Place Issued</label>
                            <input type="text" name="placeIssued" onChange={handleChangeData} value={additionalData.placeIssued} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                            <label className="text-sm font-medium mt-2">CTCNo</label>
                            <input type="text" name="CTCNo" onChange={handleChangeData} value={additionalData.CTCNo} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>
                            
                            <label className="text-sm font-medium mt-2">CTC Date</label>
                            <div className="flex items-center gap-2 w-full">
                                <input type="date" name="dateIssued" onChange={handleChangeData} value={additionalData.dateIssued} className=" w-5/6 p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>
                                <button onClick={setDateToNow} className="bg-blue-500 p-2 text-white rounded-md w-1/6">Set Date to Now</button>
                            </div>

                            <label className="text-sm font-medium mt-2">ORNo</label>
                            <input type="text" name="ORNo" onChange={handleChangeData} value={additionalData.ORNo} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>

                            <label className="text-sm font-medium mt-2">Years of Residency</label>
                            <input type="number" name="yrsOfResidency" onChange={handleChangeData} value={additionalData.yrsOfResidency} className="p-2 px-4 border border-gray-300 rounded-md font-medium text-lg"/>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col p-8 w-full h-fit shadow-lg ">
                <div className="overflow-y-auto mt-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-medium text-gray-600">Form Requests History ({forms.length})</h3>
                        <div className="flex items-center gap-4">
                            <p>sort by: </p>
                            <select name="form" className="border p-1" value={formTypeQuery} onChange={e => setFormTypeQuery(e.target.value)}>
                                <option value="">All Form Type</option>
                                <option value="BC">Barangay Clearance</option>
                                <option value="BDC">Building Clearance</option>
                                <option value="BRC">Certificate of Residency</option>
                                <option value="BSC">Business Clearance</option>
                                <option value="CL">Calamity Loan</option>
                                <option value="CB">Closed Business</option>
                                <option value="CH">Co-Habitation Certification</option>
                                <option value="ECC">Electrical Clearance</option>
                                <option value="EC">Employment Clearance</option>
                                <option value="EX">Excavation Clerance</option>
                                <option value="FC">Fencing Clearance</option>
                                <option value="IC">Indigency Certification</option>
                                <option value="ITR">ITR Exemption</option>
                                <option value="LBC">Late BC Registration</option>
                                <option value="LB">Lipat Bahay</option>
                                <option value="MC">Medical Certification</option>
                                <option value="NRC">Non-Resident Certification</option>
                                <option value="PAO">PAO Certification</option>
                                <option value="RC">Reconstruction Clearance</option>
                                <option value="SLP">Solo Parent Certification</option>
                                <option value="TODA">TODA Certification</option>
                                <option value="UEC">Unemployment Certification</option>
                                <option value="WP">Water Permit</option>
                                <option value="ZC">oning Clearance</option>
                            </select>
                        </div>
                    </div>
                    <div className="h-[30vh] overflow-y-auto flex flex-col">
                        {
                            forms.map(form => (
                                <FormCard form={form} key={form._id} open={()=>setActiveForm(form)}/>
                            ))
                        }
                    </div>
                    {
                        activeForm !== null && <ResidentFormModal onClose={() => setActiveForm(null)} form={activeForm}/>
                    }
                </div>
            </div>

            <div className="flex flex-colw-full h-fit shadow-lg ">
                <div className="flex flex-col p-8 w-full h-fit shadow-lg fit">
                    <div className="flex my-4 justify-between gap-4">
                        <h3 className="font-semibold text-lg text-gray-700">Business</h3>
                        <Link to='/business' className="bg-green-500 text-white p-2 rounded-md w-1/6 text-center">Add Business</Link>
                        
                    </div>
                    <div className="flex flex-col w-full items-center">
                        {
                            businesses.map(business => (
                                <BusinessCard business={business} key={business._id}/>
                            ))
                        }
                    </div>  
                </div>
            </div>

            <div className="flex flex-col p-8 w-full h-fit shadow-lg fit">
                
                <div className="flex my-4 justify-between gap-4">
                    <h3 className="font-semibold text-lg text-gray-700">Help Received History</h3>
                </div>
                <div className="flex flex-col w-full items-center">
                    {
                        indigentHistory.map(indigent => (
                            <IndigentCard indigent={indigent} key={indigent._id}/>
                        ))
                    }
                </div>  
            </div>
        </div>
    )
}

export default ResidentFormRequest;
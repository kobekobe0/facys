import { useState } from 'react'
import API_URL from '../../constants/api';
import axios from 'axios';
import toast from 'react-hot-toast';

const RequestClearance = ({ business, title, setOpen }) => {
    const [additionalData, setAdditionalData] = useState({
        year: new Date().getFullYear(),
        CTCNo: '',
        ORNo: '',
        placeIssued: 'Pandi, Bulacan',
        dateIssued: '',
        purpose: '',
    })

    const handleQueryChange = (e) => {
        const { name, value } = e.target;
        setAdditionalData({
            ...additionalData,
            [name]: value
        });
    }

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

    const handleGenerate = async () => {

        const isConfirmed = await confirm('Are you sure you want to generate this document?');
        if (!isConfirmed) return;

        let body = {
            business: business?._id,
            purpose: additionalData.purpose,
            placeIssued: additionalData.placeIssued,
            dateIssued: additionalData.dateIssued,
            CTCNo: additionalData.CTCNo,
            ORNo: additionalData.ORNo,
            isResident: business?.isResident,
            formType: 'BSC',
            formName: 'Business Clearance',
        }

        if(business?.isResident) {
            body = {
                ...body,
                residentID: business?.residentID?._id
            }
        } else {
            body = {
                ...body,
                nonResident: business?.nonResident
            }
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
            link.download = `Business_Clearance_${business?.businessName}.docx`;
            link.click();

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start justify-between">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    {title}
                                </h3>
                                <div className="mt-2 flex justify-between items-center w-full">
                                    <p className="text-sm text-gray-500">
                                        Input the details below
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#db0000" d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"/></g></svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 px-4 flex-col">
                            <label htmlFor="">Purpose</label>
                            <input type="text" className="w-full p-2 border border-gray-600 rounded-md" name="purpose" value={additionalData.purpose} onChange={handleQueryChange} placeholder="Purpose" />
                            
                            <label htmlFor="">Place Issued</label>
                            <input type="text" className="w-full p-2 border border-gray-600 rounded-md" name="placeIssued" value={additionalData.placeIssued} onChange={handleQueryChange} placeholder="Last name" />
                            
                            <label htmlFor="">Date Issued</label>
                            <input type="date" className="w-full p-2 border border-gray-600 rounded-md" name="dateIssued" value={additionalData.dateIssued} onChange={handleQueryChange} placeholder="First name"/>
                            <button className='text-white text-sm px-2 py-1 w-1/6 bg-green-500 self-end rounded-md' onClick={setDateToNow}>Set Date To Now</button>

                            <label htmlFor="">CTCNo</label>
                            <input type="text" className="w-full p-2 border border-gray-600 rounded-md" name="CTCNo" value={additionalData.CTCNo} onChange={handleQueryChange} placeholder="CTC Number"/>
                            
                            <label htmlFor="">ORNo</label>
                            <input type="text" className="w-full p-2 border border-gray-600 rounded-md" name="ORNo" value={additionalData.ORNo} onChange={handleQueryChange} placeholder="OR Number"/>
                            
                            <button onClick={handleGenerate} className="bg-blue-500 mt-4 text-white p-2 mb-2 w-1/4 self-end rounded-md">Generate</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default RequestClearance
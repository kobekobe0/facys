import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../constants/api";
import InputField from "../components/receipts/InputField";
import validateDate from "../helper/validateDate";

const CedulaItem = () => {
    const {id} = useParams()
    const [booklet, setBooklet] = useState(null)
    const [yearToAdd, setYearToAdd] = useState('')
    const [monthToAdd, setMonthToAdd] = useState('')
    const [isSaved, setIsSaved] = useState(true)

    const fetchBooklet = async () => {
        try {
            const {data} = await axios.get(`${API_URL}cedula/${id}`)
            setBooklet(data.data)
            console.log(data.data)
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        fetchBooklet()
    }, [])

    const handleInputChange = (index, field, event) => {
        if(isSaved) setIsSaved(false)

        setBooklet((prevBooklet) => {
          const newItems = [...prevBooklet.items];
          let value = event.target.value;
      
          if (field === 'individual' || field === 'corporation' || field === 'rpt' || field === 'others') {
            value = value === '' ? '0' : value;
            if (value.length > 1 && value[0] === '0') {
              value = value.slice(1);
            }
            value = parseFloat(value) || 0;
          }
      
          if (field === 'date') {
            if (/[^0-9-]/.test(value)) {
              return prevBooklet; // No need to update if invalid date format
            }
      
            let formattedDate;
            if (value.length === 8) {
              formattedDate = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
            } else if (value.length === 9) {
              formattedDate = value.replace(/-/g, '');
            } else if (value.length >= 10) {
              formattedDate = value.slice(0, 10);
            } else {
              formattedDate = value;
            }
            value = formattedDate;
          }
      
          newItems[index][field] = value;
          return { ...prevBooklet, items: newItems }; // Update only the items property
        });
    };

    const addYearToDateFields = () => {
        if(yearToAdd.length !== 4) {
            if(parseInt(yearToAdd) < 1970) {
                setYearToAdd('');
                toast.error('Please enter a valid year');
                return;
            }
            toast.error('Please enter a valid year');
            return;
        }
        const newItems = booklet.items.map(item => {
            if (item.date === '' || item.date === null){
                return {...item, date: yearToAdd}
            }
            return item
        })
        setBooklet({...booklet, items: newItems})
        setYearToAdd('')
    }

    const addMonthToDateFields = () => {
        console.log(monthToAdd)
        const newItems = booklet.items.map(item => {
            if (item.date.trim().length === 4){
                return {...item, date: item.date + monthToAdd}
            }
            return item
        })
        
        setBooklet({...booklet, items: newItems})
    }
    

    //check if the date is valid, if empty or null, leave it as is, only check if it is not empty. Date should be in the format yyyy-mm-dd and string
    const checkItemDates = (items) => {
        for (let i = 0; i < items.length; i++) {
            const date = items[i]?.date;
            if (date && date.trim() !== '') {
                if (!validateDate(date)) {
                    return false;
                }
                console.log(date);
            }
        }
        return true;
    };


    const handleSave = async () => {
        if (!checkItemDates(booklet.items)) {
            toast.error('Invalid date format')
            return
        }
        try {
            const itemsArray = Array.isArray(booklet.items) ? booklet.items : Object.values(booklet.items);
            const {data} = await axios.put(`${API_URL}cedula/${id}`, {items: itemsArray})
            console.log(data)
            toast.success('Report saved successfully')
            setIsSaved(true)
        } catch (error) {
            console.log(error)
            toast.error('Failed to save report')
        }
    }

    const handlePrint = async () => {
        if(!isSaved) return toast.error('Please save the report first')

        try {
            const response = await axios.get(`${API_URL}cedula/print/${id}`, {
                responseType: 'arraybuffer',
            });
    
            const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const fileURL = URL.createObjectURL(file);
    
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = `${booklet.bookletNumber}.docx`;
            link.click();
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async () => {
        const isConfirmed = await confirm('Are you sure you want to delete this report?')
        if (!isConfirmed) return

        try {
            const {data} = await axios.delete(`${API_URL}cedula/${id}`)
            console.log(data)
            toast.success('Report deleted successfully')
            setTimeout(() => {
                window.location.href = '/cedula'
            }, 2000)
        } catch (error) {
            console.log(error)
            toast.error('Failed to delete report')
        }
    }

    if (!booklet) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex gap-4 ml-64 p-8 w-full">
            <div className="flex flex-col w-1/4 h-fit">
                <div className="flex shadow-lg mb-4 flex-col p-8 w-full">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-gray-700">Booklet Number</p>
                        <h2 className="text-4xl font-semibold">{booklet?.bookletNumber}</h2>
                    </div>
                    <div className="mt-8 flex justify-between w-full">
                        <p className="text-gray-700">Prepared By: </p>
                        <h2 className="font-semibold text-lg">{booklet?.preparedBy}</h2>
                    </div>
                    <div className="mt-4 flex justify-between w-full">
                        <p className="text-gray-700">CTC Numbers</p>
                        <h2 className=" text-lg">{booklet?.startOfCTC} - {booklet?.endOfCTC}</h2>
                    </div>
                    <hr className="mt-4"/>
                    <div className="mt-4 flex justify-between w-full">
                        <p className="text-gray-700 font-semibold">Date Covered</p>
                    </div>
                    <div className="mt-4 flex justify-between w-full">
                        <p className="text-gray-700">From</p>
                        <h2 className=" text-lg">{booklet?.dateFrom ? new Date(booklet?.dateFrom).toLocaleString('en-US', {year: 'numeric', month:'long', day:'2-digit'}) : 'N/A'}</h2>
                    </div>
                    <div className="mt-4 flex justify-between w-full">
                        <p className="text-gray-700">To</p>
                        <h2 className=" text-lg">{booklet?.dateTo ? new Date(booklet?.dateTo).toLocaleString('en-US', {year: 'numeric', month:'long', day:'2-digit'}) : 'N/A'}</h2>
                    </div>
                    <hr  className="my-4"/>
                    <div className="mt-4 flex justify-between w-full">
                        <p className="text-gray-700">Total Amount</p>
                        <h2 className="text-2xl">
                            ₱ {booklet?.items.reduce((acc, item) => acc + item.individual + item.corporation + item.rpt + item.others, 0).toFixed(2).toLocaleString()}
                        </h2>
                    </div>
                    <button className={`bg-green-500 text-white p-2 rounded-md mt-4 hover:bg-green-600 transition-all ${isSaved && 'opacity-55'}`} onClick={handleSave} disabled={isSaved}>Save Report</button>
                    <button onClick={handlePrint} className="bg-blue-500 text-white p-2 rounded-md mt-2 hover:bg-blue-600 transition-all">Print Report</button>
                    <button onClick={handleDelete} className=" text-red-400 border border-red-400 p-2 rounded-md mt-2 hover:bg-red-400 hover:text-white transition-all">Delete Booklet Entry</button>
                </div>
                <div className="flex shadow-lg mb-4 flex-col p-8 w-full">
                    <div className="flex flex-col flex-wrap gap-2 w-full">
                        <p className="text-sm text-gray-700">Add Year to Empty Date Fields</p>
                        <div className="w-full">
                            <input className="border p-2 w-4/5" type="number" value={yearToAdd} onChange={(e) => setYearToAdd(e.target.value)} />
                            <button className="bg-green-500 w-1/5 text-white p-2 mt-2 hover:bg-green-600 transition-all" onClick={addYearToDateFields}>Insert</button>
                        </div>                        
                    </div>
                    <div className="flex flex-col flex-wrap gap-2 w-full">
                        <p className="text-sm text-gray-700 mt-4">Add Month to Date Fields</p>
                        <div className="w-full">
                            <select className="border p-2 w-4/5" name="month" onChange={e=>setMonthToAdd(e.target.value)}>
                                <option value="01">01 - January</option>
                                <option value="02">02 - February</option>
                                <option value="03">03 - March</option>
                                <option value="04">04 - April</option>
                                <option value="05">05 - May</option>
                                <option value="06">06 - June</option>
                                <option value="07">07 - July</option>
                                <option value="08">08 - August</option>
                                <option value="09">09 - September</option>
                                <option value="10">10 - October</option>
                                <option value="11">11 - November</option>
                                <option value="12">12 - December</option>
                            </select>
                            <button className="bg-green-500 text-white p-2 w-1/5 mt-2 hover:bg-green-600 transition-all" onClick={() => addMonthToDateFields()}>Insert</button>    
                        </div>
                    </div>
                </div>
            </div>
            <div className="shadow-lg flex w-3/4">
                <div className="flex flex-col p-8 w-full">
                    <div className="flex gap-4 items-center">
                        <h3 className="font-semibold text-2xl text-gray-700">CTC Entries</h3>  
                        <p className={`
                            ${isSaved ? 'bg-green-300' : 'bg-yellow-300'}
                            text-white h-7 w-7 flex items-center justify-center rounded-full text-xs
                        `}>
                            {
                                isSaved 
                                    ? <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 20 20"><path fill="green" d="m15.3 5.3l-6.8 6.8l-2.8-2.8l-1.4 1.4l4.2 4.2l8.2-8.2z"/></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="red" d="M30 19.4L28.6 18L25 21.6L21.4 18L20 19.4l3.6 3.6l-3.6 3.6l1.4 1.4l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6z"/><path fill="black" d="M16 26h-4v-8h4v-2h-4c-1.1 0-2 .9-2 2v8H6V6h4v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V6.4l4 4V16h2v-6c0-.3-.1-.5-.3-.7l-5-5c-.2-.2-.4-.3-.7-.3H6c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h10zM12 6h8v4h-8z"/></svg>
                            }
                        </p>
                    </div>
                    <div className="overflow-y-auto h-[80vh] mt-4">
                        <div className="flex justify-between items-center border-gray-200 w-full">
                            <p className="w-2/12 h-12 border text-center px-2 py-1 text-lg text-gray-800 font-semibold ">CTCNo</p>
                            <p className="w-3/12 h-12 border text-center px-2 py-1 text-lg text-gray-800 font-semibold flex items-center justify-center">Date <span className="text-xs">(yyyy-mm-dd)</span></p>
                            <p className="w-3/12 h-12 border text-center px-2 py-1 text-lg text-gray-800 font-semibold">Name</p>
                            <p className="w-4/12 h-12 border text-center px-2 py-1 text-sm flex flex-col text-gray-800 font-semibold">Nature
                                <span className="flex justify-between items-center border-t-2">
                                    <span className="border-r-2 w-1/4">CTC-Indv</span>
                                    <span className="border-r-2 w-1/4">CTC-Corp</span>
                                    <span className="border-r-2 w-1/4">RPT</span>
                                    <span className="w-1/4">Others</span>
                                </span>
                            </p>
                        </div>
                        {
                            booklet?.items?.map((item, index) => (
                                <div key={item.ORNumber} className="flex justify-between items-center border-gray-200 w-full">
                                    <p className="w-2/12 border text-center px-2 py-1 text-lg text-gray-500 font-semibold">{item?.CTCNumber}</p>
                                    <InputField width={'w-3/12'} label="Date" value={item?.date?.split('T')[0] || ''} onChange={(e) => handleInputChange(index, 'date', e)} />
                                    <InputField width={'w-3/12'} label="Name" value={item?.payor} onChange={(e) => handleInputChange(index, 'payor', e)} />                               
                                    <InputField width={'w-1/12'} label="Amount" value={item?.individual.toString()} onChange={(e) => handleInputChange(index, 'individual', e)} />
                                    <InputField width={'w-1/12'} label="Amount" value={item?.corporation.toString()} onChange={(e) => handleInputChange(index, 'corporation', e)} />
                                    <InputField width={'w-1/12'} label="Amount" value={item?.rpt.toString()} onChange={(e) => handleInputChange(index, 'rpt', e)} />
                                    <InputField width={'w-1/12'} label="Amount" value={item?.others.toString()} onChange={(e) => handleInputChange(index, 'others', e)} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CedulaItem
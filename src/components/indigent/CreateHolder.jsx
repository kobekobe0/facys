import { useEffect, useState } from "react"
import ResidentSelector from "../business/ResidentSelector"
import axios from "axios"
import API_URL from "../../constants/api"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

const CreateHolder = ({setOpen}) => {
    const [amount, setAmount] = useState(0)

    const handleSave = async () => {
        try {
            const {data} = await axios.post(`${API_URL}indigent/holder`, {amount})
            toast.success(data.message)
            setOpen(false)
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } catch (error) {
            console.log(error)
            toast.error('An error occured. Please try again.')
        }
    }
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Amount</h3>
                        <p className="text-sm mt-4">Enter new amount <b>AVAILABLE</b> in the indigent funds. (New release)</p>
                        <div className="mt-4">
                            <label className="text-sm font-medium">Amount</label>
                            <input type="number"  className="p-2 border border-gray-600 rounded-md my-2 w-full" value={amount} onChange={e=>setAmount(e.target.value)}/>
                        </div>
                    </div>
                    

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-4">
                        <button onClick={handleSave} type="button" className={`bg-green-500 ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-0 sm:w-auto sm:text-sm`}>
                            Confirm
                        </button>
                        <button onClick={()=>setOpen(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateHolder
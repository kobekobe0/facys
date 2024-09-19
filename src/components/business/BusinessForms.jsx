const BusinessForm = ({form}) => {
    return (
        <div className="w-full hover:bg-gray-200 transition-all duration-100 flex justify-center flex-col my-2 border p-2 border-gray-300 rounded-md">
            <div className="flex justify-between w-full items-center">
                <div className="flex flex-col justify-center">
                    <h2 className="text-lg font-medium">{form?.formNumber}</h2>
                    <h3 className="text-sm text-gray-700">{form?.formName}</h3>
                </div>
                <p className="text-xs justify-start items-start self-start">
                    {new Date(form?.dateIssued).toLocaleString('en-us',{year: 'numeric', month: 'long', day: '2-digit'})}
                </p>
            </div>
            <hr className="my-2"/>
            <div className="flex flex-col justify-center p-2">
                <div className="flex justify-between items-center">
                    <h2>Purpose:</h2>
                    <h2 className="font-medium">{form?.purpose || "N/A"}</h2>
                </div>
                <div className="flex justify-between items-center">
                    <h2>CTC:</h2>
                    <h2 className="font-medium">{form?.CTCNo || "N/A"}</h2>
                </div>
                <div className="flex justify-between items-center">
                    <h2>OR:</h2>
                    <h2 className="font-medium">{form?.ORNo || "N/A"}</h2>
                </div>
            </div>
        </div>
    )
}

const BusinessForms = ({forms}) => {
    return (
        <div className='flex flex-col  rounded-md w-2/3 shadow-lg p-8 overflow-y-auto h-fit'>
            <div className='flex flex-col justify-center gap-4'>
                <h2 className="text-lg font-medium text-gray-800">Forms Requested</h2>
                <div className="flex flex-col h-[80vh] overflow-y-scroll">
                    {
                        forms?.map(form => (
                            <BusinessForm key={form._id} form={form}/>
                        ))
                    }
                    {
                        forms?.length == 0 && <h2 className="text-lg text-gray-400">No forms requested</h2>
                    }
                </div>
            </div>
        </div>
    )
}

export default BusinessForms
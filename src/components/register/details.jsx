const CheckDetails = ({ next, prev, details, setDetails, schedule }) => {
    return (
        <div className="mt-4 w-full">
            <div className='flex flex-col mb-8'>
                <h2 className='text-xl font-semibold text-gray-600'>
                    <span className='text-lg font-normal'>Step 2:</span> Check Details
                </h2>
                <p className='text-sm text-gray-500'>Check the details we extracted from your COR</p>
            </div>

            <div className='flex flex-col mb-4'>
                <div className='flex justify-between mb-2'>
                    <span className='text-gray-700 '>Student Number:</span>
                    <span className='font-semibold'>{details.studentNumber}</span>
                </div>
                <div className='flex justify-between mb-4'>
                    <span className=' text-gray-700 '>Name:</span>
                    <span className='font-semibold'>{details.studentName}</span>
                </div>



                <div className='flex justify-between mb-2 items-center text-end'>
                    <span className='text-gray-700 '>Department:</span>
                    <span className='font-semibold text-sm'>{details.department}</span>
                </div>

                <div className='flex justify-between mb-2 items-center text-end'>
                    <span className='text-gray-700 '>Section:</span>
                    <span className='font-semibold text-sm'>{details.section}</span>
                </div>

                <div className='flex justify-between mb-2 items-center text-end'>
                    <span className='text-gray-700 '>Department:</span>
                    <span className='font-semibold text-sm'>{details.yearLevel}</span>
                </div>
                <div className='flex justify-between mb-2 items-center text-end'>
                    <span className='text-gray-700 '>School Year:</span>
                    <span className='font-semibold text-sm'>AY {details.SY.start} - {details.SY.end} {details.SY.semester} Semester</span>
                </div>

                <div className='flex flex-col mb-4'>
                    <label className='font-semibold' htmlFor='sex'>Sex:</label>
                    <select
                        id='sex'
                        value={details.sex}
                        onChange={(e) => setDetails({ ...details, sex: e.target.value })}
                        className='border border-gray-300 rounded-md p-2 mt-1'
                    >
                        <option value='M'>Male</option>
                        <option value='F'>Female</option>
                    </select>
                </div>

                <div className='flex flex-col mb-4'>
                    <label className='font-semibold' htmlFor='dateOfBirth'>Date of Birth:</label>
                    <input
                        type='date'
                        id='dateOfBirth'
                        value={details.dateOfBirth}
                        onChange={(e) => setDetails({ ...details, dateOfBirth: e.target.value })}
                        className='border border-gray-300 rounded-md p-2 mt-1'
                    />
                </div>
            </div>
            <label className="text-sm font-semibold mb-4">Schedule</label>
            {/* Schedule Table Container */}
            <div className="w-full max-h-64 overflow-y-auto"> {/* Adjust max-h as needed */}
                
                <div className="overflow-x-auto">
                    <table className="table-auto h-full w-full border border-slate-400 text-xs">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-slate-300 p-2">Subject</th>
                                <th className="border border-slate-300 p-2">Code</th>
                                <th className="border border-slate-300 p-2">Professor</th>
                                <th className="border border-slate-300 p-2">Section</th>
                                <th className="border border-slate-300 p-2">First Schedule</th>
                                <th className="border border-slate-300 p-2">Second Schedule</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule?.map((entry, index) => (
                                <tr key={index} className="even:bg-gray-50">
                                    <td className="border border-slate-300 p-2">{entry[1]}</td>
                                    <td className="border border-slate-300 p-2">{entry[2]}</td>
                                    <td className="border border-slate-300 p-2">{entry[3]}</td>
                                    <td className="border border-slate-300 p-2">{entry[4]}</td>
                                    <td className="border border-slate-300 p-2">{entry[0]}</td>
                                    <td className="border border-slate-300 p-2">{entry.length === 6 ? entry[5] : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='flex items-end w-full justify-end gap-4'>
                <button 
                    onClick={prev} // Assuming you want to go back to the previous step
                    className={`border border-red-600 text-red-600 px-8 py-2 rounded-md hover:bg-red-800 hover:text-white transition-all ease-in-out`} 
                >
                    Back
                </button>
                <button 
                    onClick={next}
                    className={`border border-red-600 bg-red-600 text-white px-8 py-2 rounded-md hover:bg-red-800 transition-all ease-in-out`} 
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default CheckDetails;

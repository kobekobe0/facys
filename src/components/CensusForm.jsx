const CensusForm = ({resident, edit, onMemberValueChange, handleSave, removeModal }) => {
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        onMemberValueChange(resident._id, name, value);
    };
    return (
        <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 my-2">
                    <div className="flex flex-col w-[7.5%]">
                        <label className="text-xs" htmlFor="lastName">Last Name</label>
                        <input onChange={handleInputChange} type="text" name="name.last" className="border-b border px-2 py-1" value={resident?.name?.last || ''} disabled={!edit}/>
                    </div>
                    <div className="flex flex-col w-[7.5%]">
                        <label className="text-xs" htmlFor="firstName">First Name</label>
                        <input onChange={handleInputChange} type="text" name="name.first" className="border-b border px-2 py-1" value={resident?.name?.first || ''} disabled={!edit}/>
                    </div>
                    <div className="flex flex-col w-[7.5%]">
                        <label className="text-xs" htmlFor="middleName">Middle Name</label>
                        <input onChange={handleInputChange} type="text" name="name.middle" className="border-b border px-2 py-1" value={resident?.name?.middle || ''} disabled={!edit}/>
                    </div>
                    <div className="flex flex-col w-[5%]">
                        <label className="text-xs" htmlFor="suffix">Suffix</label>
                        <select onChange={handleInputChange} className="border-b border px-2 py-1" name="name.suffix" value={resident?.name?.suffix || ''} disabled={!edit}>
                            <option value="">None</option>
                            <option value="JR">Jr</option>
                            <option value="SR">Sr</option>
                            <option value="II">II</option>
                            <option value="III">III</option>
                            <option value="IV">IV</option>
                        </select>
                    </div>

                    <div className="flex flex-col w-[7%]">
                        <label className="text-xs" htmlFor="dob">Date Of Birth</label>
                        <input onChange={handleInputChange} type="text" name="dateOfBirth" className="border-b border px-2 py-1" value={resident?.dateOfBirth || ''} disabled={!edit}/>
                    </div>
                    <div className="flex flex-col w-[5%]">
                        <label className="text-xs" htmlFor="sex">Sex</label>
                        <select onChange={handleInputChange} className="border-b border px-2 py-1" name="sex" value={resident?.sex || ''} disabled={!edit}>
                            <option value="">Unset</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-[7%]">
                        <label className="text-xs" htmlFor="civilStatus">Civil Status</label>
                        <select onChange={handleInputChange} className="border-b border px-2 py-1" name="civilStatus" value={resident?.civilStatus || ''} disabled={!edit}>
                            <option value="">Unset</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="annulled">Annulled</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-[8%]">
                        <label className="text-xs" htmlFor="occupation">Occupation</label>
                        <input onChange={handleInputChange} type="text" name="employment.occupation" className="border-b border px-2 py-1" value={resident?.employment?.occupation || ''} disabled={!edit}/>
                    </div>
                    <div className="flex flex-col w-[5%]">
                        <label className="text-xs" htmlFor="educationalAttainment">Education</label>
                        <select onChange={handleInputChange} className="border-b border px-2 py-1" name="educationalAttainment" value={resident?.educationalAttainment || ''} disabled={!edit}>
                            <option value="elementary">Elementary</option>
                            <option value="highschool">Highschool</option>
                            <option value="undergraduate">Undergraduate</option>
                            <option value="vocational">Vocational</option>
                            <option value="masteral">Masteral</option>
                            <option value="doctorate">Doctorate</option>
                            <option value="">Non</option>
                        </select>
                    </div>

                    <div className="flex flex-col w-[5%]">
                        <label className="text-xs" htmlFor="religion">Religion</label>
                        <select onChange={handleInputChange} className="border-b border px-2 py-1" name="religion" value={resident?.religion || ''} disabled={!edit}>
                            <option value="">Unset</option>
                            <option value="Roman Catholic">Catholic</option>
                            <option value="Islam">Islam</option>
                            <option value="Iglesia ni Cristo">INC</option>
                            <option value="Jehova's Witnesses">Jehova</option>
                            <option value="Buddhism">Buddhism</option>
                            <option value="Other">Others</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-[5%]">
                        <label className="text-xs" htmlFor="sector">Sector</label>
                        <select onChange={handleInputChange} className="border-b border px-2 py-1" name="sector" value={resident?.sector || ''} disabled={!edit}>
                            <option value="">None</option>
                            <option value="pwd">PWD</option>
                            <option value="senior">Senior Citizen</option>
                            <option value="solo">Solo Parent</option>
                            <option value="ofw">OFW</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-[5%]">
                        <label className="text-xs" htmlFor="voterStatus">Voter</label>
                        <select onChange={handleInputChange} className="border-b border px-2 py-1" name="voterInfo.isRegistered" value={resident?.voterInfo?.isRegistered?.toString() || ''} disabled={!edit}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-[4%]">
                        <label className="text-xs" htmlFor="pregnant">Pregnant</label>
                        <select onChange={handleInputChange} className="border-b border px-2 py-1" name="pregnant" value={resident?.pregnant?.toString() || 'false'} disabled={!edit}>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-[4%]">
                        <label className="text-xs" htmlFor="p4">4P's</label>
                        <select onChange={handleInputChange} className="border-b border px-2 py-1" name="p4" value={resident?.p4?.toString() || 'false'} disabled={!edit}>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-[5%]">
                        <label className="text-xs" htmlFor="registeredBusiness">Reg Business</label>
                        <select onChange={handleInputChange} className="border-b border px-2 py-1" name="registeredBusiness" value={resident?.registeredBusiness?.toString() || 'false'} disabled={!edit}>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs" htmlFor="registeredBusiness">Fam Planning</label>
                        <select onChange={handleInputChange} className="border-b border px-2 py-1" name="familyPlanning" value={resident?.familyPlanning?.toString() || 'false'} disabled={!edit}>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                    

            </div>
            {
                edit && (
                    <div className="flex gap-2 item-center justify-end">
                        <button className="bg-red-500 py-1 px-2 text-white rounded-sm text-sm" onClick={removeModal}>Remove member</button>
                        <button className="bg-green-500 py-1 px-2 text-white rounded-sm text-sm" onClick={handleSave}>Save</button>
                    </div>
                )
            }
        </div>
    
    )
}

export default CensusForm;

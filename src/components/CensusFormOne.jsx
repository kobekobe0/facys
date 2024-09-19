const CensusFormOne = ({resident, edit, onInputChange, onDateChange}) => {
    return (
        <div className="flex flex-wrap gap-2 my-2">
                <div className="flex flex-col w-[7.5%]">
                    <label className="text-xs" htmlFor="lastName">Last Name</label>
                    <input type="text" name="lastName" className="border-b border px-2 py-1" value={resident?.name?.last || ''} onChange={e=>onInputChange('head.name.last', e.target.value)}/>
                </div>
                <div className="flex flex-col w-[7.5%]">
                    <label className="text-xs" htmlFor="firstName">First Name</label>
                    <input type="text" name="firstName" className="border-b border px-2 py-1" value={resident?.name?.first || ''} onChange={e=>onInputChange('head.name.first', e.target.value)}/>
                </div>
                <div className="flex flex-col w-[7.5%]">
                    <label className="text-xs" htmlFor="middleName">Middle Name</label>
                    <input type="text" name="middleName" className="border-b border px-2 py-1" value={resident?.name?.middle || ''} onChange={e=>onInputChange('head.name.middle', e.target.value)}/>
                </div>
                <div className="flex flex-col w-[5%]">
                    <label className="text-xs" htmlFor="suffix">Suffix</label>
                    <select className="border-b border px-2 py-1" name="suffix" value={resident?.name?.suffix || ''} onChange={e=>onInputChange('head.name.suffix', e.target.value)}>
                        <option value="">None</option>
                        <option value="JR">Jr</option>
                        <option value="SR">Sr</option>
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                    </select>
                </div>

                <div className="flex flex-col w-[10%]">
                    <label className="text-xs" htmlFor="dob">Birthdate <span className="text-xs">(yyyy-mm-dd)</span></label>
                    <input maxLength={10} type="text" name="dob" className="border-b border px-2 py-1" value={resident?.dateOfBirth || ''} onChange={e=>onDateChange('head.dateOfBirth', e.target.value)}/>
                </div>
                <div className="flex flex-col w-[5%]">
                    <label className="text-xs" htmlFor="sex">Sex</label>
                    <select className="border-b border px-2 py-1" name="sex" value={resident?.sex || ''} onChange={e=>onInputChange('head.sex', e.target.value)}>
                        <option value="">Unset</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                </div>
                <div className="flex flex-col w-[7%]">
                    <label className="text-xs" htmlFor="civilStatus">Civil Status</label>
                    <select className="border-b border px-2 py-1" name="civilStatus" value={resident?.civilStatus || ''} onChange={e=>onInputChange('head.civilStatus', e.target.value)}>
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
                    <input type="text" name="occupation" className="border-b border px-2 py-1" value={resident?.employment?.occupation || ''} onChange={e=>onInputChange('head.employment.occupation', e.target.value)}/>
                </div>
                <div className="flex flex-col w-[5%]">
                    <label className="text-xs" htmlFor="educationalAttainment">Education</label>
                    <select className="border-b border px-2 py-1" name="educationalAttainment" value={resident?.educationalAttainment || ''} onChange={e=>onInputChange('head.educationalAttainment', e.target.value)}>
                        <option value="elementary">Elementary</option>
                        <option value="highschool">Highschool</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="voctional">Vocational</option>
                        <option value="masteral">Masteral</option>
                        <option value="doctorate">Doctorate</option>
                        <option value="">Non</option>
                    </select>
                </div>

                <div className="flex flex-col w-[5%]">
                    <label className="text-xs" htmlFor="religion">Religion</label>
                    <select className="border-b border px-2 py-1" name="religion" value={resident?.religion || ''} onChange={e=>onInputChange('head.religion', e.target.value)}>
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
                    <select className="border-b border px-2 py-1" name="sector" value={resident?.sector || ''} onChange={e=>onInputChange('head.sector', e.target.value)}>
                        <option value="">None</option>
                        <option value="pwd">PWD</option>
                        <option value="senior">Senior Citizen</option>
                        <option value="solo">Solo Parent</option>
                        <option value="ofw">OFW</option>
                    </select>
                </div>
                <div className="flex flex-col w-[5%]">
                    <label className="text-xs" htmlFor="voterStatus">Voter</label>
                    <select className="border-b border px-2 py-1" name="voterStatus" value={resident?.votingInfo?.isRegistered?.toString() || ''} onChange={e=>onInputChange('head.votingInfo.isRegistered', e.target.value === 'true')}>
                        <option value="">Unset</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
                <div className="flex flex-col w-[4%]">
                    <label className="text-xs" htmlFor="pregnant">Pregnant</label>
                    <select className="border-b border px-2 py-1" name="pregnant" value={resident?.pregnant?.toString() || 'false'} onChange={e=>onInputChange('head.pregnant', e.target.value === 'true')}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </div>
                <div className="flex flex-col w-[4%]">
                    <label className="text-xs" htmlFor="p4">4P's</label>
                    <select className="border-b border px-2 py-1" name="p4" value={resident?.p4?.toString() || 'false'} onChange={e=>onInputChange('head.p4', e.target.value === 'true')}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </div>
                <div className="flex flex-col w-[5%]">
                    <label className="text-xs" htmlFor="registeredBusiness">Reg Business</label>
                    <select className="border-b border px-2 py-1" name="registeredBusiness" value={resident?.registeredBusiness?.toString() || 'false'} onChange={e=>onInputChange('head.registeredBusiness', e.target.value === 'true')}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs" htmlFor="registeredBusiness">Fam Planning</label>
                    <select className="border-b border px-2 py-1" name="registeredBusiness" value={resident?.familyPlanning?.toString() || 'false'} onChange={e=>onInputChange('head.familyPlanning', e.target.value === 'true')}>
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </div>
        </div>
    
    )
}

export default CensusFormOne;

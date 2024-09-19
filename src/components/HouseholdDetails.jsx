import { useState } from "react";
import CensusForm from "./CensusForm";

const household = 
    {
        id: 1,
        address: {
            street: 'Castro',
            apartment: null,
            householdNuber: '114',
            sitio: null
        },
        head: {
            name: {
                first: 'Juan',
                last: 'Dela Cruz',
                middle: 'Bautista',
                suffix: null
            },
            dateOfBirth: '1990-01-01',
            sex: 'M',
            civilStatus: 'married',
            occupation: 'Farmer',
            educationalAttainment: 'Elementary Graduate',
            religion: 'Islam',
            sector: null,
            votingStatus: true,
            pregnant: false,
            p4: true,
            registeredBusiness: true,
        },
    }

const families = [
    {
        id: 1,
        familyMembers: [
            {
                name: {
                    first: 'Juan',
                    last: 'Dela Cruz',
                    middle: 'Bautista',
                    suffix: null
                },
                dateOfBirth: '1990-01-01',
                sex: 'M',
                civilStatus: 'Married',
                occupation: 'Farmer',
                educationalAttainment: 'Elementary Graduate',
                religion: 'Roman Catholic',
                sector: null,
                votingStatus: true,
                p4: true,
                registered: true,
            },
            {
                name: {
                    first: 'Juan',
                    last: 'Dela Cruz',
                    middle: 'Bautista',
                    suffix: null
                },
                dateOfBirth: '1990-01-01',
                sex: 'M',
                civilStatus: 'Married',
                occupation: 'Farmer',
                educationalAttainment: 'Elementary Graduate',
                religion: 'Roman Catholic',
                sector: null,
                votingStatus: true,
                p4: true,
                registered: true,
            },
            {
                name: {
                    first: 'Juan',
                    last: 'Dela Cruz',
                    middle: 'Bautista',
                    suffix: null
                },
                dateOfBirth: '1990-01-01',
                sex: 'M',
                civilStatus: 'Married',
                occupation: 'Farmer',
                educationalAttainment: 'Elementary Graduate',
                religion: 'Roman Catholic',
                sector: null,
                votingStatus: true,
                p4: true,
                registered: true,
            },
            {
                name: {
                    first: 'Juan',
                    last: 'Dela Cruz',
                    middle: 'Bautista',
                    suffix: null
                },
                dateOfBirth: '1990-01-01',
                sex: 'M',
                civilStatus: 'Married',
                occupation: 'Farmer',
                educationalAttainment: 'Elementary Graduate',
                religion: 'Roman Catholic',
                sector: null,
                votingStatus: true,
                p4: true,
                registered: true,
            },
            {
                name: {
                    first: 'Juan',
                    last: 'Dela Cruz',
                    middle: 'Bautista',
                    suffix: null
                },
                dateOfBirth: '1990-01-01',
                sex: 'M',
                civilStatus: 'Married',
                occupation: 'Farmer',
                educationalAttainment: 'Elementary Graduate',
                religion: 'Roman Catholic',
                sector: null,
                votingStatus: true,
                p4: true,
                registered: true,
            },
        ],
        householdID: 1
    },
    {
        id: 1,
        familyMembers: [
            {
                name: {
                    first: 'Juan',
                    last: 'Dela Cruz',
                    middle: 'Bautista',
                    suffix: null
                },
                dateOfBirth: '1990-01-01',
                sex: 'M',
                civilStatus: 'Married',
                occupation: 'Farmer',
                educationalAttainment: 'Elementary Graduate',
                religion: 'Roman Catholic',
                sector: null,
                votingStatus: true,
                p4: true,
                registered: true,
            },
            {
                name: {
                    first: 'Juan',
                    last: 'Dela Cruz',
                    middle: 'Bautista',
                    suffix: null
                },
                dateOfBirth: '1990-01-01',
                sex: 'M',
                civilStatus: 'Married',
                occupation: 'Farmer',
                educationalAttainment: 'Elementary Graduate',
                religion: 'Roman Catholic',
                sector: null,
                votingStatus: true,
                p4: true,
                registered: true,
            },
            {
                name: {
                    first: 'Juan',
                    last: 'Dela Cruz',
                    middle: 'Bautista',
                    suffix: null
                },
                dateOfBirth: '1990-01-01',
                sex: 'M',
                civilStatus: 'Married',
                occupation: 'Farmer',
                educationalAttainment: 'Elementary Graduate',
                religion: 'Roman Catholic',
                sector: null,
                votingStatus: true,
                p4: true,
                registered: true,
            },
            {
                name: {
                    first: 'Juan',
                    last: 'Dela Cruz',
                    middle: 'Bautista',
                    suffix: null
                },
                dateOfBirth: '1990-01-01',
                sex: 'M',
                civilStatus: 'Married',
                occupation: 'Farmer',
                educationalAttainment: 'Elementary Graduate',
                religion: 'Roman Catholic',
                sector: null,
                votingStatus: true,
                p4: true,
                registered: true,
            },
            {
                name: {
                    first: 'Juan',
                    last: 'Dela Cruz',
                    middle: 'Bautista',
                    suffix: null
                },
                dateOfBirth: '1990-01-01',
                sex: 'M',
                civilStatus: 'Married',
                occupation: 'Farmer',
                educationalAttainment: 'Elementary Graduate',
                religion: 'Roman Catholic',
                sector: null,
                votingStatus: true,
                p4: true,
                registered: true,
            },
        ],
        householdID: 1
    },
]

const HouseholdDetails = ({householdID}) => {
    const [edit, setEdit] = useState(false)
    const [temp, setTemp] = useState('01/21/1990')
    const [familiesData, setFamiliesData] = useState([...families])
    return (
        <div className='shadow-lg p-8'>
            <div className='flex justify-between items-center '>
                <h2 className='font-semibold text-lg'>Household</h2>
                <div>
                    {
                        edit ? (
                            <button className='bg-blue-500 text-white rounded-sm px-4 py-1' onClick={() => setEdit(false)}>Save</button>
                        ) : (
                            <button className='bg-blue-500 text-white rounded-sm px-4 py-1' onClick={() => setEdit(true)}>Edit</button>
                        )
                    }
                </div>
                
            </div>
            <div className="mt-4">
                <h3 className="font-semibold text-sm">Address</h3>
                <div className="flex justify-between mt-2">
                    <div className="flex flex-col">
                        <label className="text-xs" htmlFor="street">Street</label>
                        <input type="text" name="street" className="border-b border px-2 py-1" defaultValue={household.address.street} disabled={!edit}/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs" htmlFor="street">House Number</label>
                        <input type="text" name="street" className="border-b border px-2 py-1" defaultValue={household.address.householdNuber} disabled={!edit}/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs" htmlFor="street">Apartment</label>
                        <input type="text" name="street" className="border-b border px-2 py-1" defaultValue={household.address.apartment} disabled={!edit}/>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs" htmlFor="street">Sitio</label>
                        <input type="text" name="street" className="border-b border px-2 py-1" defaultValue={household.address.sitio} disabled={!edit}/>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <h3 className="font-semibold text-sm">Head</h3>
                <CensusForm resident={household.head} edit={edit} temp={temp}/>
            </div>
            <div className="mt-2">
                <div className="p-2">
                    {
                        familiesData.map((family, index) => {
                            return (
                                <div key={index} className="shadow-lg p-2 mt-4 gap-8 flex flex-col">
                                    <div className="flex justify-between items-center">
                                       <h3 className="font-semibold text-sm">Family {index + 1}</h3> 
                                    </div>
                                    
                                    {
                                        family.familyMembers.map((resident, index) => {
                                            return (
                                                <div className={`flex flex-col p-4 rounded-md ${index % 2 === 0 ? 'bg-gray-200' : ''}`}>
                                                    <p className="font-bold">Member {index + 1}</p>
                                                    <CensusForm resident={resident} edit={edit} temp={temp}/>
                                                </div>
                                            )
                                        })
                                    }
                                                                           {edit && (
                                            <button className="bg-blue-500 text-white px-2 py-1 rounded-sm ">Add Member</button>
                                       )}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <button className="w-full bg-green-500 text-white hover:bg-green-600 p-2 rounded-md mt-8">+ Add Family</button>
        </div>
    );
}

export default HouseholdDetails;
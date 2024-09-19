import { useState, useEffect } from "react";
import CensusForm from "../components/CensusForm";
import ConfirmationModal from "../components/ConfirmationModal";

const HouseholdNew = () => {
    const [edit, setEdit] = useState(true)
    const [temp, setTemp] = useState('01/21/1990') //TODO
    const [familiesData, setFamiliesData] = useState([])

    const [modal, setModal] = useState({
        title: '',
        message: '',
        color: '',
        onConfirm: null,
        onCancel: null,
        open: false
    })

    const handleAddFamily = () => {
        setFamiliesData([...familiesData, {
            id: familiesData.length + 1,
            familyMembers: [
                {
                    name: {
                        first: '',
                        last: '',
                        middle: '',
                        suffix: ''
                    },
                    dateOfBirth: '',
                    sex: '',
                    civilStatus: '',
                    occupation: '',
                    educationalAttainment: '',
                    religion: '',
                    sector: null,
                    votingStatus: true,
                    pregnant: false,
                    p4: true,
                    registeredBusiness: true,
                }]
        }])
    }

    const handleAddFamilyMember = (index) => {
        const newFamiliesData = [...familiesData]; // Create a copy of familiesData
        const newFamily = newFamiliesData[index];
        newFamily.familyMembers.push({
            name: {
                first: '',
                last: '',
                middle: '',
                suffix: ''
            },
            dateOfBirth: '',
            sex: '',
            civilStatus: '',
            occupation: '',
            educationalAttainment: '',
            religion: '',
            sector: null,
            votingStatus: true,
            pregnant: false,
            p4: true,
            registeredBusiness: true,
            _id: Math.floor(Math.random() * 15631216)
        });
    
        setFamiliesData(newFamiliesData); // Update the state with the new data
    }

    const handleRemoveFamily = (index) => {
        const newFamiliesData = [...familiesData]; // Create a copy of familiesData
        newFamiliesData.splice(index, 1); // Remove the family at the specified index
    
        setFamiliesData(newFamiliesData); // Update the state with the new data
    }

    const handleRemoveFamilyMember = (familyIndex, memberIndex, e) => {
        if(!edit) return;
        e.preventDefault();

        const newFamiliesData = [...familiesData];
        const familyToRemoveMember = newFamiliesData[familyIndex];
        familyToRemoveMember.familyMembers.splice(memberIndex, 1);
        console.log(familyToRemoveMember.familyMembers)

        setModal({
            open: false,
            title: '',
            message: '',
            color: '',
            onConfirm: null,
            onCancel: null
        })
    };

    const openModal = (title, message, color, onConfirm, onCancel, e) => {
        e.preventDefault();
        setModal({
            title,
            message,
            color,
            onConfirm,
            onCancel,
            open: true
        })
    }

    useEffect(() => {
        console.log(familiesData);
    }, [familiesData]);

    return (
        <div className='shadow-lg p-8'>
            <div>
                <div className='flex justify-between items-center'>
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
                    <div className="flex gap-4 mt-2">
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="street">Street</label>
                            <input type="text" name="street" className="border-b border px-2 py-1"/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="houseNumber">House Number</label>
                            <input type="text" name="houseNumber" className="border-b border px-2 py-1"/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="apartment">Apartment</label>
                            <input type="text" name="apartment" className="border-b border px-2 py-1" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="sitio">Sitio</label>
                            <input type="text" name="sitio" className="border-b border px-2 py-1"/>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="font-semibold text-sm">Head</h3>
                    <CensusForm resident={null} edit={true} temp={temp}/>
                </div>

                <div className="mt-4">
                    {
                        familiesData.map((family, index) => (
                            <div key={index} className="mt-4">
                                <h3 className="font-semibold text-sm">Family {index + 1}</h3>
                                {
                                    family.familyMembers.map((member, memberIndex) => (
                                        <div key={member._id} className={`${memberIndex % 2 === 0 ? 'bg-gray-200': 'white'} p-2 hover:bg-red-300 transition-all`} onContextMenu={(e) => {
                                            openModal(
                                                'Remove Family Member',
                                                'Are you sure you want to remove this family member?',
                                                'bg-red-500',
                                                () => handleRemoveFamilyMember(index, memberIndex, e),
                                                () => {setModal({open: false})},
                                                e
                                            )
                                        }}>
                                            <CensusForm resident={null} edit={true} temp={temp}/>
                                        </div>
                                    ))
                                }
                                <div className="flex justify-end gap-4">
                                    <button onClick={() => handleRemoveFamily(index)} className="bg-red-400 p-2 rounded-md text-white mt-4">Remove family</button>
                                    <button onClick={() => handleAddFamilyMember(index)} className="bg-blue-500 p-2 rounded-md text-white mt-4">+ Add Family Member</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <button onClick={handleAddFamily} className="w-full bg-green-500 rounded-md text-white p-2 hover:bg-green-600 transition-all mt-8">+ Add New Family</button>
            {
                modal.open && (
                    <ConfirmationModal title={modal.title} message={modal.message} color={modal.color} onConfirm={modal.onConfirm} onCancel={modal.onCancel}/>
                )
            }
        </div>
    );
}

export default HouseholdNew;
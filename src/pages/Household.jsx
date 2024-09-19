import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import CensusForm from "../components/CensusForm";
import ConfirmationModal from "../components/ConfirmationModal";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../constants/api.js";
import prepareData from "../helper/prepareData";

const Household = () => {
    const {householdId} = useParams()
    const [edit, setEdit] = useState(false)
    const [temp, setTemp] = useState('01/21/1990') //TODO
    
    const [household, setHousehold] = useState(null)
    const [families, setFamilies] = useState([])
    const [members, setMembers] = useState([])

    const formatDate = (dateString) => {
        if (dateString.length === 8) {
          return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
        }
        return dateString;
    }

    const fetchHousehold = async () => {
        try {
            const {data} = await axios.get(`${API_URL}census/household/${householdId}`)
            console.log(data.data)

            // split head.dateOfBirth to yyyy-mm-dd
            const head = {
                ...data.data.head,
                dateOfBirth: data.data.head.dateOfBirth.split('T')[0]
            }
            setHousehold({...data.data, head})
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        console.log(families)
        console.log(members)
    }, [families, members])

    const fetchFamilies = async () => {
        try {
            const { data } = await axios.get(`${API_URL}census/family-in-household/${householdId}`);
    
            const newFamilies = data.data.map(family => ({
                _id: family._id,
                members: family.members.map(member => member._id)
            }));
    
            setFamilies([...newFamilies]);
    
            const newMembers = data.data.flatMap(family =>
                family.members.map(member => ({
                    ...member,
                    dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split('T')[0] : '',
                    name: {
                        first: member?.name?.first || '',
                        last: member?.name?.last || '',
                        middle: member?.name?.middle || '',
                        suffix: member?.name?.suffix || ''
                    },
                    sex: member?.sex || '',
                    civilStatus: member?.civilStatus || '',
                    employment: {
                        occupation: member?.employment?.occupation || ''
                    },
                    educationalAttainment: member?.educationalAttainment || '',
                    religion: member?.religion || '',
                    sector: member?.sector || null,
                    voterInfo: {
                        isRegistered: member?.voterInfo?.isRegistered || false,
                    },
                    pregnant: member?.pregnant || false,
                    p4: member?.p4 || false,
                    registered: member?.registered || false,
                    familyPlanning: member?.familyPlanning || true,
                    isSaved: true
                }))
            );
    
            setMembers([...newMembers]);
    
        } catch (error) {
            console.error(error.message);
        }
    };    

    const [modal, setModal] = useState({
        title: '',
        message: '',
        color: '',
        onConfirm: null,
        onCancel: null,
        open: false
    })

    const handleAddFamily = async () => {
        try {
            const {data} = await axios.post(`${API_URL}census/family/create/${householdId}`)
            console.log(data.data)
            setFamilies([...families, {
                _id: data.data._id,
                members: []
            }])
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleAddFamilyMember = (familyID) => {
        const tempID = `tempID-${Math.floor(Math.random() * 1000000)}`;

        // push tempID to the family.members array based on the familyID
        setFamilies(families.map(family => {
            if (family._id === familyID) {
                return {
                    ...family,
                    members: [...family.members, tempID]
                }
            }
            return family;
        }));
    
        // Add a new member to the members array
        setMembers([...members, {
            name: {
                first: '',
                last: '',
                middle: '',
                suffix: ''
            },
            dateOfBirth: '',
            sex: '',
            civilStatus: '',
            employment: {
                occupation: ''
            },
            educationalAttainment: '',
            religion: '',
            sector: null,
            voterInfo: {
                isRegistered: false,
            },
            pregnant: false,
            p4: false,
            registered: false,
            familyPlanning: true,
            _id: tempID,
            isSaved: false
        }]);
    }

    // for each member, if onContextMenu, change isSaved to false (per member)
    const handleMemberContextMenu = (e, memberID) => {
        e.preventDefault();
        setMembers(members.map(member => {
            if (member._id === memberID) {
                return {
                    ...member,
                    isSaved: false
                }
            }
            return member;
        }));
    }
        
    const memoizedMembers = useMemo(() => members, [members]);

    const handleMemberSave = async (memberID, familyID) => {
        const member = memoizedMembers.find(member => member._id === memberID);

        if (member.isSaved) return;

        let dataToSubmit = {
            member,
            address: household.address,
            householdID: household._id
        }
        prepareData(dataToSubmit)

        console.log("TO SUBMIT: ", dataToSubmit)

        try {
            const { data } = await axios.post(`${API_URL}census/member/save/${familyID}`, dataToSubmit);

            if (memberID.includes('tempID')) {
                // Replace tempID with the actual ID, without changing the order in family.members
                setFamilies(families.map(family => {
                    if (family._id === familyID) {
                        return {
                            ...family,
                            members: family.members.map(member => member === memberID ? data.data._id : member)
                        };
                    }
                    return family;
                }));
            }

            if(data.data?.dateOfBirth) {
                data.data.dateOfBirth = data.data.dateOfBirth.split('T')[0]
            }

            setMembers(memoizedMembers.map(member => {
                if (member._id === memberID) {
                    return {
                        ...member,
                        ...data.data,
                        isSaved: true
                    };
                }
                return member;
            }));

            toast.success(data.message);
        } catch (error) {
            console.error(error.message);
            toast.error('Failed to save member');
        }
    };

    const handleRemoveFamily = async (familyID) => {
        // Remove family members based on familyID
        setMembers(members.filter(member => !families.find(family => family._id === familyID).members.includes(member._id)));

        try {
            await axios.delete(`${API_URL}census/family/delete/${familyID}`);
            setFamilies(families.filter(family => family._id !== familyID));
        } catch (error) {
            console.error(error.message);
            toast.error('Failed to remove family');
        }
    }

    const handleRemoveFamilyMember = (memberID, familyID) => {
        setModal({
            open: false,
            title: '',
            message: '',
            color: '',
            onConfirm: null,
            onCancel: null
        })
        // Remove member based on memberID
        setMembers(members.filter(member => member._id !== memberID));

        // Remove member from family members array
        setFamilies(families.map(family => {
            if (family._id === familyID) {
                return {
                    ...family,
                    members: family.members.filter(member => member !== memberID)
                }
            }
            return family;
        }));
    };

    const handleMemberRemoveModal = (memberID, familyID) => {
        if(memberID.includes('tempID')) {
            handleRemoveFamilyMember(memberID, familyID)
            return;
        }
        setModal({
            title: 'Remove Member',
            message: 'We have identified this resident already exists in our system. If some details are incorrect, please edit them to ensure accurate information. If you wish to remove this resident from the family members list, please click Confirm',
            color: 'bg-red-500',
            onConfirm: () => handleRemoveFamilyMember(memberID, familyID),
            onCancel: () => setModal({ open: false, title: '', message: '', color: '', onConfirm: null, onCancel: null }),
            open: true
        });
    }

    const handleMemberValueChange = useCallback((memberID, keyPath, value) => {
        setMembers(members => members.map(member => {
            if (member._id === memberID) {
                let updatedMember = { ...member };
    
                // Check if the keyPath is 'dateOfBirth' and value is 8 characters long
                if (keyPath === 'dateOfBirth') {
                    let formattedDate
                    if (value.length === 8) {
                        formattedDate = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
                    } else if (value.length === 9) {
                        formattedDate = value.replace(/-/g, '');
                    } else if (value.length >= 10) {
                        //prevent user from typing more than 10 characters, replace last character with empty string
                        formattedDate = value.slice(0, 10);
                    } else {
                        formattedDate = value;
                    }
                    updatedMember[keyPath] = formattedDate;
                } else {
                    // For other fields, update normally
                    const keys = keyPath.split('.');
                    let currentLevel = updatedMember;
    
                    for (let i = 0; i < keys.length - 1; i++) {
                        currentLevel = currentLevel[keys[i]];
                    }
    
                    currentLevel[keys[keys.length - 1]] = value;
                }
    
                return updatedMember;
            }
            return member;
        }));
    }, []);

    const handleDeleteHousehold = async () => {
        const isConfirmed = await confirm('Are you sure you want to delete this household?');

        if (!isConfirmed) return;

        try {
            await axios.delete(`${API_URL}census/household/delete/${householdId}`);
            toast.success('Household deleted successfully');
        } catch (error) {
            console.error(error.message);
            toast.error('Failed to delete household');
        }
    }

    useEffect(() => {
        fetchHousehold()
        fetchFamilies()
    }, [])

    return (
        <div className='shadow-lg p-8'>
            <div>
                <div className='flex justify-between items-center'>
                    <h2 className='font-semibold text-lg'>Household</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={handleDeleteHousehold} className='bg-red-500 text-white rounded-sm px-4 py-1'>Delete Household</button>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="font-semibold text-sm bg-blue-500 w-fit p-2 text-white">Address</h3>
                    <div className="flex gap-4 mt-2">
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="street">Street</label>
                            <input type="text" name="street" className="border-b border px-2 py-1" defaultValue={household?.address?.streetName} disabled={true}/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="houseNumber">House Number</label>
                            <input type="text" name="houseNumber" className="border-b border px-2 py-1" defaultValue={household?.address?.householdNumber} disabled={true}/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="apartment">Apartment</label>
                            <input type="text" name="apartment" className="border-b border px-2 py-1" defaultValue={household?.address?.apartment} disabled={true}/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs" htmlFor="sitio">Sitio</label>
                            <input type="text" name="sitio" className="border-b border px-2 py-1" defaultValue={household?.address?.sitio} disabled={true}/>
                        </div>
                        {
                            !household?.isUnique && (
                                <div className="flex flex-col justify-around">
                                    <p className="text-xs font-semibold" htmlFor="householdNumber">Special Address <span className="text-xs font-normal text-gray-700">(This is auto generated if household address is not unique)</span></p>
                                    <input type="text" name="sitio" className="border-b border px-2 py-1 font-bold" defaultValue={household?.identifier} disabled={true}/>
                                </div>
                            )
                        }
                    </div>
                </div>
                <hr className="my-4 bg-gray-300 h-[1.5px]"/>
                <div className="mt-4">
                    <h3 className="font-semibold text-sm bg-green-500 w-fit p-2 text-white">Head</h3>
                    <CensusForm resident={household?.head} edit={edit} temp={temp}/>
                </div>
                <hr className="my-4 bg-gray-300 h-[2px]"/>
                <div className="mt-4">
                    {
                        families.map((family, familyIndex) => (
                            <div key={family._id} className="mt-4">
                                <div className="flex justify-between items-center my-2">
                                    <h3 className="font-semibold text-sm bg-red-500 w-fit px-2 py-1 text-white">Family {familyIndex + 1}</h3>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleRemoveFamily(family._id)} className="border border-red-400 text-red-400 px-2 rounded-md hover:bg-red-400 hover:text-white py-1 text-sm">Remove family</button>
                                        <button onClick={() => handleAddFamilyMember(family._id)} className="bg-blue-500 px-2 rounded-md text-white py-1 text-sm">+ Add Family Member</button>
                                    </div>
                                </div>
                                {family.members.map((memberId, memberIndex) => {
                                    const member = memoizedMembers.find(member => member._id === memberId);
                                    if (!member) return null;

                                    return (
                                        <div key={member._id} className={`${memberIndex % 2 === 0 ? 'bg-gray-200' : 'white'} p-2 hover:bg-red-300 transition-all`} onContextMenu={(e) => {
                                            handleMemberContextMenu(e, member._id);
                                        }}>
                                            <CensusForm key={member._id} resident={member} removeModal={()=>handleMemberRemoveModal(member._id, family._id)} onMemberValueChange={handleMemberValueChange} handleSave={() => handleMemberSave(member._id, family._id)} edit={!member?.isSaved} />
                                        </div>
                                    );
                                })}
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

export default Household;
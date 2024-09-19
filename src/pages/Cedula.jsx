import { Link } from "react-router-dom"
import AddBookletEntry from "../components/AddBookletEntry"
import { useState, useEffect, useCallback, useRef } from "react"
import { debounce } from "lodash"
import API_URL from "../constants/api"
import axios from "axios"
import AddCedula from "../components/cedula/AddCedula"

const BookletCard = ({book}) => {
    return (
        <Link to={`${book._id}`} className="w-full hover:bg-gray-200 transition-all rounded-md border border-b my-2 p-4 flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="black" d="M8 2v20H4v-4H2v-2h2v-3H2v-2h2V8H2V6h2V2zm12.005 0C21.107 2 22 2.898 22 3.99v16.02c0 1.099-.893 1.99-1.995 1.99H10V2z"/></svg>
                <div className="flex flex-col justify-center">
                    <span className="text-lg font-semibold text-gray-800">
                        {book.bookletNumber}
                    </span>
                    <span className="text-sm font-normal text-gray-500">
                        {book.preparedBy}
                    </span>
                </div>
            </div>
            <div>
                <span className="text-sm font-semibold text-gray-500">
                        {new Date(book?.dateCreated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>

        </Link>
    )
}


const Cedula = () => {
    const [addModal, setAddModal] = useState(false)
    const [booklet, setBooklet] = useState([])

    const [preparedBy, setPreparedBy] = useState('');
    const [bookletNumber, setBookletNumber] = useState('');
    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);
    const [totalReceipt, setTotalReceipt] = useState(0);

    const preparedByRef = useRef(preparedBy);
    const bookletNumberRef = useRef(bookletNumber);
    const pageRef = useRef(page);

    useEffect(() => {
        preparedByRef.current = preparedBy;
        bookletNumberRef.current = bookletNumber;
        pageRef.current = page;
    }, [preparedBy, bookletNumber, page]);

    const fetchBooklets = async (query) => {
        try {
            const { data } = await axios.get(`${API_URL}cedula`, { params: query });
            setBooklet(data.data);
            setTotalPages(data.totalPages);
            setTotalReceipt(data.totalReceipts);
        } catch (error) {
            console.log(error);
        }
    };

    const debouncedFetchBooklets = useCallback(
        debounce(() => {
            fetchBooklets({
                bookletNumber: bookletNumberRef.current,
                preparedBy: preparedByRef.current,
                page: pageRef.current,
            });
        }, 300),
        []
    );

    useEffect(() => {
        debouncedFetchBooklets();
    }, [preparedBy, bookletNumber, page]);

    const handleBookletNumberChange = (e) => {
        setBookletNumber(e.target.value);
    };

    const handlePreparedByChange = (e) => {
        setPreparedBy(e.target.value);
    };


    return (
        <div className="flex p-8 flex-col ml-64 w-full">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Cedula</h1>
                <div className="flex items-center gap-4">
                <input
                    className="p-2 border border-gray-400 rounded-md"
                    type="text"
                    placeholder="search booklet number"
                    onChange={handleBookletNumberChange}
                    value={bookletNumber}
                />
                <input
                    className="p-2 border border-gray-400 rounded-md"
                    type="text"
                    placeholder="search prepared by"
                    onChange={handlePreparedByChange}
                    value={preparedBy}
                />
                    <button onClick={()=> setAddModal(true)} className="bg-green-500 text-white px-4 py-2 rounded-md">Add Entry</button>
                </div>
                
            </div>
            <div className="mt-8 flex justify-between gap-2 items-center">
                <p className="p-2 font-medium w-fit flex items-center gap-2">
                    <span className={`${totalReceipt == 0 ? 'bg-red-500' : 'bg-green-500'} p-2 rounded-full w-8 h-8 flex items-center justify-center text-white`}>
                        {totalReceipt}
                    </span> 
                    Booklets
                </p>
                <div className="flex gap-2">
                    <button onClick={() => setPage(page - 1)} className="hover:bg-gray-300 flex items-center rounded-full border" disabled={page <= 1}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="none" stroke={page <= 1 ? 'lightgray' : 'black'} strokeWidth="2" d="m15 6l-6 6l6 6"/></svg>
                    </button>


                    <button onClick={() => setPage(page + 1)} className="hover:bg-gray-300 flex items-center rounded-full border" disabled={page >= totalPages}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="none" stroke={page >= totalPages ? 'lightgray' : 'black'} strokeWidth="2" d="m9 6l6 6l-6 6"/></svg>
                    </button>
                </div>

            </div>
            <div className="flex flex-col w-full mt-4 h-[79vh] overflow-y-scroll">
                {
                    booklet?.map((book, index) => (
                        <BookletCard key={book._id} book={book} />
                    ))
                }
            </div>
            {
                addModal && <AddCedula onClose={()=>setAddModal(false)} />
            }
        </div>
    );
}

export default Cedula;
const CensusSector = ({data}) => {
    return (
        <div className="shadow-lg border border-gray-100 rounded-md p-8 flex items-center justify-between">
        <div className="flex items-start gap-4">
            <div className="bg-orange-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 48 48"><g fill="none"><path d="M0 0h48v48H0z"/><path fill="white" d="M22 13a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9m13 12a3 3 0 0 0-3 3v.343a1 1 0 1 0 2 0V28a1 1 0 1 1 2 0v14.946a1 1 0 1 0 2 0V28a3 3 0 0 0-3-3m-5.291-4.821L28 19.433l1.595.677zm1.226 1.062a5 5 0 0 0-1.226-1.062L36 22.928v-.096v.002c.095 1.1-.755 2.067-1.899 2.16c-1.134.09-2.132-.714-2.241-1.801v-.002l-.015-.086a4 4 0 0 0-.115-.434a4.5 4.5 0 0 0-.795-1.43"/><path fill="white" fill-rule="evenodd" d="m36 22.831l-6.405-2.72A7 7 0 0 0 28 19.432V42a2 2 0 0 1-3.99.199l-1-10A2 2 0 0 1 23 32h-2q0 .1-.01.199l-1 10A2 2 0 0 1 16 42V27.919c-1.679-.223-3.09-.898-4.136-1.925A6.2 6.2 0 0 1 10 21.481A6.34 6.34 0 0 1 11.92 17c1.29-1.259 3.129-2 5.335-2h7.32c4.973 0 7.944 1.722 9.62 3.759a8.4 8.4 0 0 1 1.494 2.695c.146.44.26.893.309 1.353v.015l.002.006zm-21.169.362c.257.252.631.496 1.169.648V19.17c-.5.152-.864.389-1.123.641a2.4 2.4 0 0 0-.72 1.708c-.006.64.232 1.24.674 1.674" clip-rule="evenodd"/></g></svg>
            </div>
            <div className="flex flex-col">
                <h2 className="text-sm text-gray-500">Senior Citizen</h2>
                <h2 className="font-medium text-3xl text-gray-800">{data?.senior?.toLocaleString()}</h2>
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="bg-blue-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14"/><path d="m7 18l1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9M2 13l6 6"/></g></svg>                    </div>
            <div className="flex flex-col">
                <h2 className="text-sm text-gray-500">4P's Member</h2>
                <h2 className="font-medium text-3xl text-gray-800">{data?.p4?.toLocaleString()}</h2>
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="bg-green-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.38em" height="1.5em" viewBox="0 0 22 24"><path fill="white" d="M13.878 17.986c-.924 2.33-3.15 3.951-5.758 3.968h-.005a6.08 6.08 0 0 1-3.62-10.965l.016-.012l-.355-2.191c-2.499 1.418-4.158 4.06-4.158 7.09a8.124 8.124 0 0 0 15.377 3.663l.021-.046z"/><path fill="white" d="M16.248 15.07a1.747 1.747 0 0 0-.234-.194l-.006-.004c-.219-.15-.49-.24-.782-.24H8.895l-.819-5.047h6.758a.994.994 0 1 0 0-1.988H7.752l-.111-.672a1.411 1.411 0 1 0-2.783.47l-.001-.008l1.44 8.825a1.524 1.524 0 0 0 1.446 1.237h6.905l5.409 5.41a1.406 1.406 0 1 0 1.988-1.988zM8.345 2.691a2.691 2.691 0 1 1-5.383 0a2.691 2.691 0 0 1 5.383 0"/></svg>                    </div>
            <div className="flex flex-col">
                <h2 className="text-sm text-gray-500">PWD Member</h2>
                <h2 className="font-medium text-3xl text-gray-800">{data?.pwd?.toLocaleString()}</h2>
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="bg-violet-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><path fill="white" d="M14.423 12.17a5.233 5.233 0 0 1-3.102 1.03c-1.163 0-2.23-.39-3.103-1.03c-.75.625-1.498 1.52-2.11 2.623c-1.423 2.563-1.58 5.192-.35 5.874c.548.312 1.126.078 1.722-.496a10.51 10.51 0 0 0-.167 1.874c0 2.938 1.14 5.312 2.543 5.312c.846 0 1.265-.865 1.466-2.188c.2 1.314.62 2.188 1.46 2.188c1.397 0 2.546-2.375 2.546-5.312c0-.66-.062-1.29-.168-1.873c.6.575 1.176.813 1.726.497c1.227-.682 1.068-3.31-.354-5.874c-.61-1.104-1.36-1.998-2.11-2.623zm-3.103.03a4.279 4.279 0 1 0-.003-8.561a4.279 4.279 0 0 0 .003 8.563zm10.667 5.47c1.508 0 2.732-1.224 2.732-2.734S23.493 12.2 21.986 12.2a2.737 2.737 0 0 0-2.736 2.736a2.737 2.737 0 0 0 2.737 2.735zm3.33 1.657c-.39-.705-.868-1.277-1.348-1.677c-.56.41-1.24.66-1.983.66c-.744 0-1.426-.25-1.983-.66c-.48.4-.958.972-1.35 1.677c-.91 1.638-1.01 3.318-.224 3.754c.35.2.72.05 1.1-.316a6.874 6.874 0 0 0-.104 1.197c0 1.88.728 3.397 1.625 3.397c.54 0 .81-.553.938-1.398c.128.84.396 1.397.934 1.397c.893 0 1.627-1.518 1.627-3.396c0-.42-.04-.824-.108-1.196c.383.367.752.52 1.104.317c.782-.434.68-2.115-.228-3.753z"/></svg>                    </div>
            <div className="flex flex-col">
                <h2 className="text-sm  text-gray-500">Solo Parent</h2>
                <h2 className="font-medium text-3xl text-gray-800">{data?.soloParent?.toLocaleString()}</h2>
            </div>
        </div>
        <div className="flex items-start gap-4">
            <div className="bg-gray-500 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="M12 15c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4M8 9a4 4 0 0 0 4 4a4 4 0 0 0 4-4m-4.5-7c-.3 0-.5.21-.5.5v3h-1V3s-2.25.86-2.25 3.75c0 0-.75.14-.75 1.25h10c-.05-1.11-.75-1.25-.75-1.25C16.25 3.86 14 3 14 3v2.5h-1v-3c0-.29-.19-.5-.5-.5z"/></svg>                    </div>
            <div className="flex flex-col">
                <h2 className="text-sm text-gray-500">OFW</h2>
                <h2 className="font-medium text-3xl text-gray-800">{data?.ofw?.toLocaleString()}</h2>
            </div>
        </div>
    </div>
    )
}

export default CensusSector
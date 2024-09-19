import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";


const Landing = () => {
    const [activeTab, setActiveTab] = useState(0);
    //0 - home
    //1 - register

    return (
        <main className="flex flex-col h-[100vh]">
            <Navbar/>
            <Banner/>
            <div className="flex-1 max-h-20 flex items-center justify-center border-t-2 border-red-950 shadow-lg">
                <p className="text-red-950 text-xs">© Facys Team | 2024</p>
            </div>
        </main>
    );
}

export default Landing;
import { useState, useEffect } from "react";
import DashboardChart from "../components/admin/DashboardChart";
import LogsTable from "../components/admin/LogTable";
import axios from "axios";
import API_URL from "../constants/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate()
    const [numbers, setNumbers] = useState(null)

    const fetchNumbers = async () => {
        const res = await axios.get(`${API_URL}log/numbers`)
        setNumbers(res.data)
    }

    useEffect(()=> {
        fetchNumbers()
    },[])
  return (
    <div className="flex flex-col flex-grow p-8">
      <h2 className="font-semibold text-3xl font-sans">Dashboard</h2>
      <div className="p-4 mt-4 flex flex-col bg-white rounded shadow-md flex-grow">
        <h3 className="font-medium text-lg text-gray-800">Overview</h3>
        <div className="flex justify-start items-center mt-4 px-4 bg-gray-100 h-fit rounded">
            <div className="bg-white h-full gap-4 flex items-center justify-between w-[50%] p-4 px-8 rounded">
                <div className="bg-white gap-4 flex flex-col">
                    <h4 className="text-sm text-gray-500">Total Logs Today</h4>
                    <p className="text-5xl font-semibold">{numbers?.logsToday || '0'}</p>
                    <button className="text-sm text-red-500 w-fit" onClick={()=>navigate('/admin/logs')}>View Logs</button>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 15 15"><path fill="currentColor" d="M4 6h1V5H4zm6 0h1V5h-1zm.1 2.7a3.25 3.25 0 0 1-5.2 0l-.8.6c1.7 2.267 5.1 2.267 6.8 0zM1 5V2.5H0V5zm1.5-4H5V0H2.5zM1 2.5A1.5 1.5 0 0 1 2.5 1V0A2.5 2.5 0 0 0 0 2.5zM0 10v2.5h1V10zm2.5 5H5v-1H2.5zM0 12.5A2.5 2.5 0 0 0 2.5 15v-1A1.5 1.5 0 0 1 1 12.5zM10 1h2.5V0H10zm4 1.5V5h1V2.5zM12.5 1A1.5 1.5 0 0 1 14 2.5h1A2.5 2.5 0 0 0 12.5 0zM10 15h2.5v-1H10zm5-2.5V10h-1v2.5zM12.5 15a2.5 2.5 0 0 0 2.5-2.5h-1a1.5 1.5 0 0 1-1.5 1.5z"/></svg>
            </div>

          <div className="gap-4 w-[50%] flex items-center justify-between p-4 px-8 rounded">
            <div className="flex flex-col items-start p-4 gap-4">
                <h4 className="text-sm text-gray-500">Unique Logs Today</h4>
                <p className="text-5xl font-semibold">{numbers?.uniqueLogsToday || '0'}</p>
                <p className="text-sm text-green-500">{
                        //calculate percentage
                        numbers?.uniqueLogsToday && numbers?.logsToday ?
                        `${Math.round((numbers?.uniqueLogsToday / numbers?.logsToday) * 100)}% of total logs` : '0%'
                    }</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 12h8m-8 6h8M13 6h8M3 12h1m-1 6h1M3 6h1m4 6h1m-1 6h1M8 6h1"/></svg>

          </div>
        </div>
      </div>
        <div className="mt-4 mb-2 flex items-center justify-between">
            <h2 className="text-sm ml-4 font-medium">Last 15 Days Logs</h2>
            <button className="text-sm text-red-500 w-fit mr-4 font-medium" onClick={()=>navigate('/admin/logs')}>View Logs</button>
        </div>
        <DashboardChart/>
        <div className="mt-4 mb-2">
            <h2 className="text-sm ml-4 font-medium">Recent Logs</h2>
        </div>
        <LogsTable/>
    </div>
  );
};

export default Dashboard;

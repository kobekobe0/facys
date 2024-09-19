import { Outlet } from "react-router-dom";
import StudentNavbar from "../components/student/StudentNavbar";

export default function StudentHome() {
    const logout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/signin';
    }
    return (
        <div>
            <StudentNavbar />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl text-red-800">Student Dashboard</h1>
                <p className="text-lg">Welcome to your dashboard. Here you can view your grades, attendance, and more.</p>
            </div>
        </div>
    )
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/Home'
import Error from './pages/Error'
import Signin from './pages/Signin'

import Census from './pages/Census'
import CensusItem from './pages/CensusItem'
import Household from './pages/Household'
import HouseholdNew from './pages/HouseholdNew'
import Receipts from './pages/Receipts'
import ReceiptItem from './pages/ReceiptItem'
import Cedula from './pages/Cedula'
import Residents from './pages/Residents'
import ResidentItem from './pages/ResidentItem'
import { Toaster } from 'react-hot-toast'
import Business from './pages/Business'
import BusinessItem from './pages/BusinessItem'
import Indigent from './pages/Indigent'
import BlockLog from './pages/BlockLogs'
import CedulaItem from './pages/CedulaItem'
import Temp from './pages/Temp'
import Forms from './pages/Forms'
import Borrow from './pages/Borrow'
import useAuth from './helper/useAuth'
import path from 'path'
import Landing from './pages/Landing'
import Register from './pages/Register'
import StudentHome from './pages/StudentHome'
import ResetPassword from './pages/ResetPassword'
import Webcam from './components/Webcam'
import AdminSignin from './pages/AdminSignin'
import FaceRecognition from './pages/FaceRecognition'
import ChangePassword from './pages/ResetPasswordUser'
import StudentLogs from './components/StudentLogs'
import Students from './components/Students'
import StudentId from './pages/StudentId'
import WebcamCaptureTest from './components/WebcamCaptureTest'
import Settings from './pages/Settings'
import AcademicYear from './components/admin/settings/AcademicYear'
import AdminAccount from './components/admin/settings/AdminAccount'
import StudentAccounts from './components/admin/settings/StudentAccounts.jsx'
import BlockedStudents from './components/BlockedStudents.jsx'
import SystemLogs from './pages/SystemLogs.jsx'
import StudentProfile from './pages/StudentProfile.jsx'
import OutdatedStudent from './components/OutdatedStudent.jsx'
import ResetPasswordAdmin from './pages/ResetPasswordAdmin.jsx'
import ChangePasswordAdmin from './pages/ResestPasswordAdminChange.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Visitors from './components/Visitors.jsx'
import VisitorLogs from './components/VisitorsLogs.jsx'
import VisitorCreate from './components/VisitorCreate.jsx'
import VisitorRegister from './components/VisitorRegister.jsx'
import ArchiveStudents from './components/ArchiveStudents.jsx'

const router = createBrowserRouter([
  {

    path: '/admin',
    element: <Home />,
    errorElement: <Error/>,
    children:[
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path:'scan',
        element: <FaceRecognition />,
      },
      {
        path: 'visitors',
        element: <Visitors />,
      },
      {
        path: 'visitors/create',
        element: <VisitorCreate />,
      },
      {
        path: 'visitor-logs',
        element: <VisitorLogs />,
      },
      {
        path: 'logs',
        element: <StudentLogs />,
      },
      {
        path: 'students',
        element: <Students />,
      },
      {
        path: 'archived',
        element: <ArchiveStudents />,
      },
      {
        path: 'blocklist',
        element: <BlockedStudents />,
      },
      {
        path: 'outdated',
        element: <OutdatedStudent />,
      },
      {
        path: 'system-logs',
        element: <SystemLogs />,
      },
      {
        path: 'settings',
        element: <Settings />,
        children:[
          {
            path: 'admin-account',
            element: <AdminAccount />
          },
          {
            path: 'invalid-accounts',
            element: <StudentAccounts />
          },
          {
            path: 'academic-year',
            element: <AcademicYear />
          }
        ]
      },
      {
        path: 'students/:id',
        element: <StudentId />,
      }
    ]
  },
  {
    path: '/student',
    errorElement: <Error/>,
    children:[
      {
        index: true,
        element: <StudentHome />,
      },
      {
        path: "profile",
        element: <StudentProfile />
      }
    ]
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/register-visitor',
    element: <VisitorRegister />
  },
  {
    path: '/testing',
    element: <WebcamCaptureTest />
  },
  {
    path: '/signin',
    element: <Signin />
  },
  {
    path: '/admin-signin',
    element: <AdminSignin />
  },
  {
    path: '/forgot-password',
    element: <ResetPassword />
  },
  {
    path: '/forgot-password/:id',
    element: <ChangePassword />
  },
  {
    path: '/admin-forgot-password/:id',
    element: <ChangePasswordAdmin />
  },
  {
    path: 'admin/forgot-password',
    element: <ResetPasswordAdmin />
  },

  {
    path: '/test',
    element: <Webcam />
  },
  {
    path: '/',
    element: <Landing />
  }
]);



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
    <Toaster 
      position='top-center'
      reverseOrder={false}
    />
  </React.StrictMode>,
)

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

const router = createBrowserRouter([
  {

    path: '/admin',
    element: <Home />,
    errorElement: <Error/>,
    children:[
      {
        index: true,
        element: <FaceRecognition />,
      },
      {
        path: 'logs',
        element: <StudentLogs />,
      },
    ]
  },
  {
    path: '/student',
    element: <StudentHome />,
    errorElement: <Error/>,
    children:[]
  },
  {
    path: '/register',
    element: <Register />
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

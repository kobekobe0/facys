import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import API_URL from "../constants/api";
import DETAILS from "../constants/details";
import WebcamCapture from "../components/register/WebcamCapture";
import Tabs from "../components/Tabs";
import logo from '../assets/logo.png';
import DragAndDrop from "../components/register/DragAnddrop";
import CheckDetails from "../components/register/details";

/*

faceData
details
schedule stringyfy

*/
const Register = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [file, setFile] = useState(null);
    const [faceData, setFaceData] = useState(null);
    const [screenshot, setScreenshot] = useState(null);
    const [details, setDetails] = useState({
      studentNumber: '',
      studentName: '',
      department: '',
      sex: 'M',
      dateOfBirth: '',
    });

    const [schedule, setSchedule] = useState([]);
    const navigate = useNavigate();

    const uploadCOR = async () => {
      toast.loading("Uploading file...");
      try{
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_URL}student/cor`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).catch(error => {
            toast.dismiss();
            toast.error(error.response.data.message)
        });

        if(response.status === 200) {
            toast.dismiss();
            toast.success("File uploaded successfully.");
            console.log(response.data);
            setDetails({...response?.data?.details, dateOfBirth:''});
            console.log(response.data);
            setSchedule(response?.data?.schedules);
            console.log(response.data);
            setActiveTab(activeTab + 1);
        }
        if(response.status === 400) {
            toast.dismiss();
            console.log(response.data.message);
        }
      } catch (error){
        toast.dismiss();
        toast.error("An error occurred. Please try again.");
        console.log(error);
      }
    }

    const handleNext = () => {
      switch (activeTab) {
        case 0:
          if (!file) {
            toast.error("Please upload a file");
            return;
          }

          uploadCOR();
          
          break;
        case 1:
          console.log(details);
          if(details.studentNumber === '' || details.studentName === '' || details.department === '' || details.dateOfBirth === '') {
            toast.error("Please fill in all fields");
            return;
          }
          setActiveTab(activeTab + 1);
          break;
        case 2:
          break;
        default:
          break;
      }

      
    };

    const handleBack = () => {
      setActiveTab(activeTab - 1);
    };

    const handleRetry = () => {
      setFaceData(null);
      setActiveTab(activeTab - 1);
      setScreenshot(null);
    }

    const handleSubmit = async () => {
      toast.loading("Uploading data...");
      try{
        const body = {
          studentNumber: details.studentNumber,
          name: details.studentName,
          schedule: JSON.stringify(schedule),
          department: details.department,
          sex: details.sex,
          dateOfBirth: details.dateOfBirth,
          degree: details.degree,
          section: details.section, 
          SY: `AY ${details.SY.start} - ${details.SY.end} ${details.SY.semester} Semester`,
          yearLevel: details.yearLevel,
          faceData: faceData,
        }

        console.log(body)

        const response = await axios.post(`${API_URL}student/create`, body)

        console.log(response.data);
        toast.dismiss();
        toast.success("Registration successful.");
        navigate('/');
      } catch (error){
        toast.dismiss();
        toast.error(error.response.data.message);
        console.log(error);
      }
    }

    return (
      <main className="flex flex-col h-[100vh] overflow-scroll items-center">
        <div className="h-full overflow-auto flex flex-col w-full md:w-1/3 p-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-full justify-between items-center">
              <Link to="/" className="flex items-center my-4 w-full gap-2">
                <img src={logo} alt="Logo" className="w-[50px]" />
                <h2 className="text-xl font-semibold">{DETAILS.title}</h2>
              </Link>
              <div>
                <h2 className="text-2xl">Register</h2>
              </div>
            </div>
            {
              activeTab === 0 && (
                <DragAndDrop setFile={setFile} file={file} handleNext={handleNext} />
              )
            }

            {
              activeTab === 1 && (
                <CheckDetails next={handleNext} prev={handleBack} details={details} setDetails={setDetails} schedule={schedule} />
              )
            }

            {
              activeTab === 2 && (
                <WebcamCapture setFaceData={setFaceData} next={() => setActiveTab(activeTab + 1)} back={handleBack} setScreenshot={setScreenshot} screenshot={screenshot}/>
              )
            }

            {
              activeTab === 3 && (
                <div>
                  <h2 className="text-2xl">Confirm Registration</h2>
                  <p className="text-sm mb-4">Does this photo resembles your face?</p>
                  <img src={screenshot} alt="" className="h-[380px] w-[320px] object-cover"/>
                  <div className="flex mt-4 gap-4 justify-end">
                    <button className="flex items-center border-red-700 border rounded text-red-700 gap-2 px-2 py-1" onClick={handleRetry}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="#c20000" fill-rule="evenodd" d="M7.32.029a8 8 0 0 1 7.18 3.307V1.75a.75.75 0 0 1 1.5 0V6h-4.25a.75.75 0 0 1 0-1.5h1.727A6.5 6.5 0 0 0 1.694 6.424A.75.75 0 1 1 .239 6.06A8 8 0 0 1 7.319.03Zm-3.4 14.852A8 8 0 0 0 15.76 9.94a.75.75 0 0 0-1.455-.364A6.5 6.5 0 0 1 2.523 11.5H4.25a.75.75 0 0 0 0-1.5H0v4.25a.75.75 0 0 0 1.5 0v-1.586a8 8 0 0 0 2.42 2.217" clip-rule="evenodd"/></svg>Retry</button>
                    <button className="border border-red-700 text-white bg-red-700 rounded px-2 py-1" onClick={handleSubmit}>Submit</button>
                  </div>
                  
                </div>
              )
            }

          </div>
        </div>

        <div className="flex-1 max-h-20 flex items-center justify-center border-t-2 w-full border-red-950 shadow-lg">
          <p className="text-red-950 text-xs">© {DETAILS.title} Team | 2024</p>
        </div>
      </main>
    );
};

export default Register;

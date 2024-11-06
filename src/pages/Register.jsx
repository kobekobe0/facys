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
import SetFaceData from "../components/register/SetFaceData";

/*

faceData
details
schedule stringyfy

*/
const Register = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [file, setFile] = useState(null);
    const [faceData, setFaceData] = useState(null);
    const [faceData2, setFaceData2] = useState(null);
    const [faceData3, setFaceData3] = useState(null);
    const [screenshot, setScreenshot] = useState(null);
    const [details, setDetails] = useState({
      studentNumber: '',
      studentName: '',
      department: '',
      sex: 'M',
      dateOfBirth: '',
    });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
            console.log(error.response.data.message)
            toast.dismiss();
            toast.error(error.response.data.message)
            return
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
          console.log('Face Data');
          if(!faceData) return toast.error("Please capture your face");
          setActiveTab(activeTab + 1);
          break;
        default:
          break;
      }

      
    };

    const handleBack = () => {
      setActiveTab(activeTab - 1);
    };

    const handleRetry = (tab) => {
      setFaceData(null);
      setActiveTab(activeTab - tab);
      setScreenshot(null);
    }
    const handleSubmit = async () => {

      console.log("Main Descriptor:", faceData);
console.log("Support Descriptor 1:", faceData2);
console.log("Support Descriptor 2:", faceData3);

      

      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (email === '' || password === '' || confirmPassword === '') return toast.error("Please fill in all fields");
      if (!emailRegex.test(email)) return toast.error("Invalid email address");
      if (password !== confirmPassword) return toast.error("Passwords do not match");
      if (password.length < 8) return toast.error("Password must be at least 8 characters long");
  
      if (!faceData || !faceData2 || !faceData3) {
          return toast.error("Please upload all required face images.");
      }
  
      toast.loading("Uploading data...");
      
  
      try {
          // Create a new FormData object
          const formData = new FormData();
  
          // Append text fields to FormData
          formData.append("studentNumber", details.studentNumber);
          formData.append("name", details.studentName);
          formData.append("schedule", JSON.stringify(schedule));
          formData.append("department", details.department);
          formData.append("sex", details.sex);
          formData.append("dateOfBirth", details.dateOfBirth);
          formData.append("degree", details.degree);
          formData.append("section", details.section);
          formData.append("SY", `AY ${details.SY.start} - ${details.SY.end} ${details.SY.semester} Semester`);
          formData.append("yearLevel", details.yearLevel);
          formData.append("email", email);
          formData.append("password", password);
  
          // Prepare face data structure
          const faceDataPayload = {
              mainDescriptor: Array.from(faceData),            // Main descriptor as array
              supportDescriptor1: Array.from(faceData2),       // First support descriptor as array
              supportDescriptor2: Array.from(faceData3),       // Second support descriptor as array
          };
          
          // Append faceData as a JSON string
          formData.append("faceData", JSON.stringify(faceDataPayload));
  
          // Append the screenshot image file
          if (screenshot) {
              const response = await fetch(screenshot);
              const blob = await response.blob();
              formData.append("image", blob, "screenshot.jpg"); // Append with a file name
          }
  
          // Send the FormData with Axios
          const response = await axios.post(`${API_URL}student/create`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
  
          console.log(response.data);
          toast.dismiss();
          toast.success("Registration successful.");
          navigate('/');
      } catch (error) {
          toast.dismiss();
          toast.error(error.response?.data?.message || "Registration failed.");
          console.error(error);
      }
  };
  
  
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
                  <SetFaceData
                      faceData={faceData}
                      setFaceData2={setFaceData2}
                      setFaceData3={setFaceData3}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      screenshot={screenshot}
                      handleRetry={handleRetry}
                    />
                </div>
              )
            }

            {
              activeTab === 4 && (
                <div>
                  <h2 className="text-2xl">Login Credentails</h2>
                  <p className="text-sm mb-4">Provide your desired email and password</p>
                  <div className="flex flex-col w-full gap-2">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded-md p-2 mb-4 mt-1 w-full"/>

                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-300 rounded-md p-2 mt-1 w-full"/>
                  
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border border-gray-300 rounded-md p-2 mt-1 w-full"/>
                  </div>
                  <div className="flex mt-4 gap-4 justify-end">
                    <button className="flex items-center border-red-700 border rounded text-red-700 gap-2 px-2 py-1" onClick={()=> handleRetry(2)}>Back</button>
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

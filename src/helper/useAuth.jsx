import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import API_URL from '../constants/api';

function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('No token found');
        return navigate('/signin');
      }

      try {
        setIsLoading(true); // Set loading to true while processing
        // Decode the JWT to get the role
        const decodedToken = jwtDecode(token);
        const { role } = decodedToken;

        // Verify the token with the backend
        const response = await axios.post(`${API_URL}student/verify`, { token });
        
        console.log(response);

        if (response.status === 200) {
          // Redirect based on the user's role
          if (role === 'Student') {
            navigate('/student');
          } else if (role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/signin'); // Handle unknown roles
          }
        } else {
          navigate('/signin'); // Token verification failed
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/signin'); // Redirect to login if there's an error
      } finally {
        setIsLoading(false); // Set loading to false after processing
      }
    };

    authenticateUser();
  }, [navigate]);

  return isLoading;
}

export default useAuth;

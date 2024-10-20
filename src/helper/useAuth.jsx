import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

import axios from 'axios';
import API_URL from '../constants/api';

function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const authenticateUser = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        // Allow access to the admin login page without redirecting
        if (location.pathname === '/admin-signin') {
          return; 
        } else {
          return navigate('/signin');
        }
      }

      try {
        setIsLoading(true); // Set loading to true while processing
        // Decode the JWT to get the role
        const decodedToken = jwtDecode(token);
        const { role } = decodedToken;

        // Verify the token with the backend
        let response = null
        if(role === 'Admin') {
          response = await axios.post(`${API_URL}admin/verify`, { token });
          setUser(response.data.user);
        } else if (role === 'Student') {
          response = await axios.post(`${API_URL}student/verify`, { token });
          setUser(response.data.user);
        } else if (role === 'SecurityGuard') {
          response = await axios.post(`${API_URL}guard/verify`, { token });
          setUser(response.data.user);
        }


        if (response.status === 200) {
          // Check the user's role and current location to avoid unnecessary redirection
          if (role === 'Student' && location.pathname.startsWith('/student')) {
            // Do nothing if already on a student-related page
            return;
          } else if (role === 'Admin' && location.pathname.startsWith('/admin')) {
            // Do nothing if already on an admin-related page
            return;
          } else if (role === 'Student') {
            navigate('/student'); // Redirect to student dashboard
          } else if (role === 'Admin') {
            navigate('/admin'); // Redirect to admin dashboard
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
  }, []);

  return { isLoading, user };
}

export default useAuth;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the types for the props
interface ProtectedRoutesProps {
  children: React.ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Create an async function to fetch the profile data
    const checkAuthentication = async () => {
      try {
        // Await the API call to check the session cookie
        const response = await axios.get('http://localhost:4000/api/profile', { withCredentials: true });
        // If successful, set authentication state to true
        console.log(response)
        setIsAuthenticated(true);
      } catch (error) {
        // If the request fails (token invalid, session expired, etc.), set authentication state to false
        setIsAuthenticated(false);
      }
    };

    // Call the async function to check authentication
    checkAuthentication();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (!isAuthenticated) {
    return <div>You are not logged in. Please log in.</div>;
  }

  return <>{children}</>; // Render the protected content if authenticated
};

export default ProtectedRoutes;

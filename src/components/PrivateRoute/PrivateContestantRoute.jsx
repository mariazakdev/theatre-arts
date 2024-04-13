import { Route, Navigate, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";


const URL = process.env.REACT_APP_BACKEND_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

export default function PrivateContestantRoute({ children }) {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const response = await axios.get(
            `${URL}/users/${currentUser.uid}`, 
            { headers: { Authorization: `${API_KEY}`, } }

          );
          const data = response.data;
          setUserData(data.contestant);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, [currentUser]);



  return userData  ? 
    children
   : 
    <Navigate to="/" replace />
  ;

}

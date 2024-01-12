import { Route, Navigate, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

export default function PrivateContestantRoute({ children }) {
  console.log("Component rendering");

  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const response = await axios.get(
            `http://localhost:8000/users/${currentUser.uid}`
          );
          const data = response.data;
          console.log("User Data:", data);
          setUserData(data.contestant);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, [currentUser]);

  console.log("currentUser in private:", currentUser);
  console.log("user in private:", userData);

//   return userData  ? (
//     <Outlet>{children}</Outlet>
//   ) : (
//     <Navigate to="/" replace />
//   );
  return userData  ? 
    children
   : 
    <Navigate to="/" replace />
  ;

}

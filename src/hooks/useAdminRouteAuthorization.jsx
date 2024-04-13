import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const URL = process.env.REACT_APP_BACKEND_URL;

const useAdminRouteAuthorization = (URL) => {
  const { currentUser } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const response = await axios.get(`${URL}/users/${currentUser.uid}`, {
            headers: { Authorization: `${API_KEY}` },
          });
          const user = response.data.user;
          setIsAdmin(user.admin === 1);
        } else {
          setIsAdmin(false); // No user, not admin
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchUserData();
  }, [currentUser, URL, API_KEY]);

  return { isAdmin, loading };
};

export default useAdminRouteAuthorization;

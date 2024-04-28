import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import PaymentForm from "../../components/PaymentForm/PaymentForm"
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './PaymentCompetitionPage.scss';

function PaymentCompetitionPage({URL , CLIENT_URL, API_KEY}) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${URL}/users/${currentUser.uid}`, {
          headers: { Authorization: `${API_KEY}` },
        });
        const user = response.data.user;
        if (user.is_contestant === 0) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser, navigate]);
  return (
    <div className="form-background">

<PaymentForm URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY}  />

</div>
  );
}

export default PaymentCompetitionPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; 

const OneTimeUploadRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUploadStatus = async () => {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().hasUploaded) {
          navigate('/contestant/dashboard');
        } else {
          setIsLoading(false);
        }
      } else {
        navigate('/login');
      }
    };

    checkUploadStatus();
  }, [currentUser, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default OneTimeUploadRoute;

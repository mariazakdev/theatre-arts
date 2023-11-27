import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/';

const OneTimeRoute = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser, checkIfActionCompleted } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      checkIfActionCompleted(currentUser.uid).then(isCompleted => {
        if (isCompleted) {
          navigate('/dashboard');
        }
      });
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate, checkIfActionCompleted]);

  return <>{children}</>;
};

export default OneTimeRoute;

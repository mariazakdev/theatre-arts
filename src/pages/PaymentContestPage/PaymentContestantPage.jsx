import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// In between payment page from payment to upload page.
const PaymentContestantPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the upload page after a delay (e.g., 3 seconds)
    const timeoutId = setTimeout(() => {
      navigate('/contestant/upload');
    }, 3000);

    // Clear the timeout to avoid navigation if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div>
      <h2>Payment Successful!</h2>
      <p>Your payment was successful. You will be redirected to the upload page...</p>
    </div>
  );
};

export default PaymentContestantPage;

import React, { useState } from 'react';
import PaymentForm from "../../components/PaymentForm/PaymentForm"
import './PaymentCompetitionPage.scss';

function PaymentCompetitionPage({URL , CLIENT_URL, API_KEY}) {
  
  return (
    <div className="form-background">

<PaymentForm URL={URL} CLIENT_URL={CLIENT_URL} API_KEY={API_KEY}  />

</div>
  );
}

export default PaymentCompetitionPage;

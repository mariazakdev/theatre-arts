import React, { useState } from 'react';
import EnterCompetitionComponent from "../../components/PaymentForm/PaymentForm"
import './EnterCompetitionPage.scss';

function EnterCompetitionPage({backendURL}) {
  
  return (
    <div className="form-background">

<EnterCompetitionComponent backendURL={backendURL}/>
</div>
  );
}

export default EnterCompetitionPage;

import React, { useState } from 'react';
import EnterCompetitionComponent from "../../components/PaymentForm/PaymentForm"
import Hero from "../../components/Hero/Hero";
import './EnterCompetitionPage.scss';

function EnterCompetitionPage({backendURL}) {
  
  return (
<>
<EnterCompetitionComponent backendURL={backendURL}/>
<Hero/>
</>
  );
}

export default EnterCompetitionPage;

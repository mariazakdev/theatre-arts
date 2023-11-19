import React, { useState } from 'react';
import EnterCompetitionComponent from "../../components/EnterCompetitionComponent/EnterCompetitionComponent"
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

import React, { useState } from 'react';
import EnterCompetitionComponent from "../../components/EnterCompetitionComponent/EnterCompetitionComponent"
import './EnterCompetitionPage.scss';

function EnterCompetitionPage({backendURL}) {
  
  return (
<>
<EnterCompetitionComponent backendURL={backendURL}/>
</>
  );
}

export default EnterCompetitionPage;

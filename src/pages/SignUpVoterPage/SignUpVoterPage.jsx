import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import SignUpGeneralComponent from "../../components/SignUpGeneralComponent/SignUpGeneralComponent";
import '../../styles/forms.scss';

const SignUpVoterPage = () => {
return(<>
<h1>hi</h1>
<SignUpGeneralComponent/>
</>
  
)

};

export default SignUpVoterPage;

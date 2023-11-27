import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import '../../styles/forms.scss';
import SignUpComponent from "../../components/SignUpComponent/SignUpComponent";

const SignUpPage = () => {
return(
  <SignUpComponent/>
)

};

export default SignUpPage;

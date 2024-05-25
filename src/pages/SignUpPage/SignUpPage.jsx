import React, { useState } from "react";
import "./SignUpPage.scss";
import SignUpContestant from "../../components/SignUpContestant/SignUpContestant";


const SignUpPage = ({ URL, API_KEY }) => {
  
  

  return (
    <div className="form-background">

    <SignUpContestant URL={URL} API_KEY={API_KEY} />

 

    </div>
  )
};

export default SignUpPage;

import React, { useState } from "react";
import '../../styles/forms.scss';
import SignUpContestant from "../../components/SignUpContestant/SignUpContestant";

const SignUpPage = ({URL} ) => {
return(
  <SignUpContestant URL={URL}/>
)

};

export default SignUpPage;

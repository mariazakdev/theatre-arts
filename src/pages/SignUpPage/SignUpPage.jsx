import React, { useState } from "react";
import "../../styles/forms.scss";
import SignUpContestant from "../../components/SignUpContestant/SignUpContestant";

const SignUpPage = ({ URL, API_KEY }) => {
  return <SignUpContestant URL={URL} API_KEY={API_KEY} />;
};

export default SignUpPage;

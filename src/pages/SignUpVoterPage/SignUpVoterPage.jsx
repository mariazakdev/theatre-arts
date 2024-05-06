import SignUpGeneralComponent from "../../components/SignUpGeneralComponent/SignUpGeneralComponent";
import './SignUpVoterPage.scss';

const SignUpVoterPage = ({ URL, API_KEY} ) => {
return(
    <div className="form-background">

<SignUpGeneralComponent URL={URL} API_KEY={API_KEY} />
</div>
  
)

};

export default SignUpVoterPage;

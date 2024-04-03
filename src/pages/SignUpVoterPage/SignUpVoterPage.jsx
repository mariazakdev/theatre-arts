import SignUpGeneralComponent from "../../components/SignUpGeneralComponent/SignUpGeneralComponent";
import '../../styles/forms.scss';

const SignUpVoterPage = ({ URL, API_KEY} ) => {
return(<>
<SignUpGeneralComponent URL={URL} API_KEY={API_KEY} />
</>
  
)

};

export default SignUpVoterPage;

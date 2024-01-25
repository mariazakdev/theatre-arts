import LoginContestant from "../../components/LoginContestant/LoginContestant";
import "./LoginPage.scss";

function LoginPage( {URL}) {
  return (
    <div className="form-background">
      <LoginContestant URL={URL}/>
    </div>
  );
}
export default LoginPage;

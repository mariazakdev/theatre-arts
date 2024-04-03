import LoginContestant from "../../components/LoginContestant/LoginContestant";
import "./LoginPage.scss";

function LoginPage( {URL, API_KEY}) {
  return (
    <div className="form-background">
      <LoginContestant URL={URL} API_KEY={API_KEY} />
    </div>
  );
}
export default LoginPage;

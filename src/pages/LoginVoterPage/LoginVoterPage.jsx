import LoginGeneral from "../../components/LoginGeneral/LoginGeneral";

function LoginPage( {URL, API_KEY}) {
  return (
    <div className="form-background">
      <LoginGeneral URL={URL} API_KEY={API_KEY}/>
    </div>
  );
}
export default LoginPage;

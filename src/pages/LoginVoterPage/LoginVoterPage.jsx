import LoginGeneral from "../../components/LoginGeneral/LoginGeneral";

function LoginPage( {URL}) {
  return (
    <div className="form-background">
      <LoginGeneral URL={URL}/>
    </div>
  );
}
export default LoginPage;

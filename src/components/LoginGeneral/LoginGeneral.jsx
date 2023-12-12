import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/forms.scss";

function LoginGeneral() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = (e) => {
    e.preventDefault();
    login(email, password)
      .then((userCredential) => {
        if (userCredential) {
          const user = userCredential.user;
          const { state: { returnPath, actorId } = {} } = location || {};
          const redirectPath = returnPath || "/";

          navigate(redirectPath, { state: { actorId } });

          navigate(returnPath || "/", { state: { actorId } });
          console.log(user);
        } else {
          console.log("No user credentials received");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

 const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main>
      <section>
        <div className="form-container">
          <h1>Log In all voters</h1>

          <form>
            <div className="input-group">
              <label htmlFor="email-address">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // Use the state to toggle between text and password type
                required
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
               <span 
                      className="input-group--password-toggle"
                      onClick={togglePasswordVisibility}>
                         {showPassword ? "Hide" : "Show"}
                      </span>
            </div>
            <div>
              <button onClick={onLogin}>Login</button>
            </div>
            <p className="login-redirect">
              <NavLink to="/forgot-password">Forgot Password?</NavLink>
            </p>
          </form>

          <p className="login-redirect">
            No account yet? <NavLink to="/signup">Sign up</NavLink>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginGeneral;

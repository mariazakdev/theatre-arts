import React, {useState} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom'
import '../../styles/forms.scss';


function LoginComponent() {
  const { login } = useAuth(); 
  const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
       
    const onLogin = (e) => {
        e.preventDefault();
        login(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/contestant/enter")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
       
    }


    return(
      <main>        
      <section>
          <div className="form-container">                                            
              <h1>Log In To Vote</h1>                       
                                                 
              <form>
                  <div className="input-group">
                      <label htmlFor="email-address">Email address</label>
                      <input
                          id="email-address"
                          name="email"
                          type="email"                                    
                          required                                                                                
                          placeholder="Email address"
                          onChange={(e)=>setEmail(e.target.value)}
                      />
                  </div>

                  <div className="input-group">
                      <label htmlFor="password">Password</label>
                      <input
                          id="password"
                          name="password"
                          type="password"                                    
                          required                                                                                
                          placeholder="Password"
                          onChange={(e)=>setPassword(e.target.value)}
                      />
                  </div>
                  <div>
                      <button onClick={onLogin}>Login</button>
                  </div> 
                  <p className="login-redirect">
                      <NavLink to="/forgot-password">Forgot Password?</NavLink>
                  </p>       
              </form>
                 
              <p className="login-redirect">
                  No account yet? {' '}
                  <NavLink to="/signup">Sign up</NavLink>
              </p>
          </div>
      </section>
  </main>
    )
}

export default LoginComponent;

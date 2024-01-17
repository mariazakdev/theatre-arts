import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import '../../styles/forms.scss';

function LoginContestant() {
    const { login } = useAuth(); 
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [flashMessage, setFlashMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const onLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setErrorMessage('Please enter email and password');
            return;
        }
        try {
            const userCredential = await login(email, password);
            const user = userCredential.user;

            if (user) {
                navigate("/contestant/enter");
                console.log(user);
            } else {
                setErrorMessage('Incorrect email or password');
            }
        } catch (error) {
            console.error("Error during login:", error);
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return(
        <main>        
            <section>
                <div className="form-container">                                            
                    <h2>Log In</h2>                       
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
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
                                type={showPassword ? "text" : "password"} 
                                required                                                                                
                                placeholder="Password"
                                onChange={(e)=>setPassword(e.target.value)}
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
                        No account yet? {' '}
                        <NavLink to="/signup">Sign up</NavLink>
                    </p>
                </div>
            </section>
        </main>
    )
}

export default LoginContestant;

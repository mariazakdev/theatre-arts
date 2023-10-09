import React, {useContext, useState, useEffect} from 'react';
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword , sendPasswordResetEmail} from "firebase/auth"; 

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState( true);

    function signup(email, password){
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword( auth, email, password); 
    }

    function logout(){
        auth.signOut();
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }
    function updateEmailFunction(newEmail) {
        if (currentUser) {
            return currentUser.updateEmail(newEmail);
        }
        throw new Error("No user is authenticated");
    }
    
    function updatePasswordFunction(newPassword) {
        if (currentUser) {
            return currentUser.updatePassword(newPassword);
        }
        throw new Error("No user is authenticated");
    }
    useEffect(()=> {
        const unsubscribe = auth.onAuthStateChanged(user => {
            
            setCurrentUser(user);
            setLoading(false); 
        })
        return unsubscribe;
    }, []);
  
    const value ={
        currentUser,
        signup,
        login,
        logout,
        resetPassword, 
        updateEmail: updateEmailFunction,
        updatePassword: updatePasswordFunction
    };

    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

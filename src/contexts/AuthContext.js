import React, { useContext, useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence // Make sure to import this
} from "firebase/auth"; 

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const db = getFirestore();

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // function signup(email, password){
    //     return createUserWithEmailAndPassword(auth, email, password).catch(setError);
    // }

//Fixing undefined is not an object (evaluating '(await o(s,A)).user')"
function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Handle successful signup here if needed
            return userCredential;  // Return the userCredential object
        })
        .catch((error) => {
            setError(error.message);
            throw error;  // Re-throw the error if necessary
        });
}

    

    // function login(email, password) {
    //     // Set the session persistence before signing in
    //     return setPersistence(auth, browserSessionPersistence)
    //         .then(() => {
    //             // Session persistence set, proceed with sign in
    //             return signInWithEmailAndPassword(auth, email, password);
    //         })
    //         .catch((error) => {
    //             // Handle errors here
    //             setError(error.message);
    //             throw error;
    //         });
    // }

    function login(email, password) {
        // Set the session persistence before signing in
        return setPersistence(auth, browserSessionPersistence)
            .then(() => {
                // Session persistence set, proceed with sign in
                return signInWithEmailAndPassword(auth, email, password);
            })
            .catch((error) => {
                // Handle errors here
                if (error.code === 'auth/invalid-credential') {
                    setError("Invalid email or password. Please try again.");
                } else {
                    setError(error.message);
                }
                console.error("Error logging in:", error);
            });
    }
    

const checkIfActionCompleted = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId); // Reference to the user's document in Firestore
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            return userDoc.data().hasCompletedAction || false;
        } else {
            console.log('User not found in Firestore');
            return false;
        }
    } catch (error) {
        console.error('Error checking action completion:', error);
        return false;
    }
};

    function logout(){
        return signOut(auth).catch(setError);
    }

    // function resetPassword(email) {
    //     return sendPasswordResetEmail(auth, email).catch(setError);
    // }
    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("Password reset email sent.");
            })
            .catch((error) => {
                console.error("Error sending password reset email:", error);
                setError(error.message);  // This should be displayed to the user
            });
    }
    function updateEmailFunction(newEmail) {
        if (currentUser) {
            return currentUser.updateEmail(newEmail).catch(setError);
        } else {
            setError('No user is authenticated');
        }
    }
    
    function updatePasswordFunction(newPassword) {
        if (currentUser) {
            return currentUser.updatePassword(newPassword).catch(setError);
        } else {
            setError('No user is authenticated');
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail: updateEmailFunction,
        updatePassword: updatePasswordFunction,
        checkIfActionCompleted,
        error ,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
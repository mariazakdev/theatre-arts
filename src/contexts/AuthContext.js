import React, { useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
 // added serverT 8 nov. Removed duplicate getFirestore()
import { auth, db } from "../firebase";

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

    
    // added 8 nov to fix firebase

async function signup(email, password) {
  try {
    // create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // create Firestore user document
    await setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email ?? "",
        emailVerified: !!user.emailVerified,
        createdAt: serverTimestamp(),
      },
      { merge: true } // avoids overwriting if user doc already exists
    );

    return userCredential;
  } catch (error) {
    setError(error.message);
    throw error;
  }
}


async function signup(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  // create minimal user document
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    emailVerified: user.emailVerified || false,
    createdAt: serverTimestamp(),
  });

  return cred;
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
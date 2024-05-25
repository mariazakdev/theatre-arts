import { auth, googleProvider, yahooProvider } from "../../firebase";

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Handle successful sign-in
  } catch (error) {
    // Handle sign-in error
  }
};


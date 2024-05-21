import React, { createContext, useContext, useState } from 'react';

// This is to track votes from paid buttons , to stop multiple votes from the same user, and to handle errors in the application. 
// The ErrorContext is used to track errors in the application, and the useError hook is used to access the error state. 
// The ErrorProvider component is used to provide the error state to the application.


const PaidVoteContext = createContext();

export const useError = () => useContext(PaidVoteContext);

export const ErrorVoteProvider = ({ children }) => {
  const [error, setError] = useState(null);
console.log(error);
  const clearError = () => setError(null);

  return (
    <PaidVoteContext.Provider value={{ error, setError, clearError }}>
      {children}
    </PaidVoteContext.Provider>
  );
};
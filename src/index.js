import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { detectInAppBrowser, isMobile } from './utils/detectInAppBrowser';


// For mini browsers like Facebook, Instagram, Twitter, etc.Google auth.
function handleInAppBrowserDetection() {
  const detectedBrowser = detectInAppBrowser();

  if (detectedBrowser) {
    const isOnMobile = isMobile();
    const currentUrl = window.location.href;

    // Redirect users based on their environment
    if (isOnMobile) {
      // Redirect to a fallback universal intent for mobile devices
      window.location.href = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
    } else {
      // For desktop, prompt the user to open in a default browser
      window.location.href = currentUrl; // Attempt direct redirection for desktop
    }

    // Optional: Fallback for in-app browsers that block redirection
    setTimeout(() => {
      alert(
        `You're using the ${detectedBrowser} in-app browser. Please open this link in your default browser for the best experience.`
      );
    }, 3000);
  }
}

// Run the redirection logic when the app loads
window.onload = handleInAppBrowserDetection;



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>

  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

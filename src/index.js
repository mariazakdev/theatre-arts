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

    alert(
      `You're using the ${detectedBrowser} in-app browser. ${
        isOnMobile
          ? "Please open this link in your default mobile browser for a better experience."
          : "Please open this link in a secure desktop browser."
      }`
    );

    // Optionally, create a button to open in the default browser
    const currentUrl = window.location.href;
    const openInBrowserButton = document.createElement("button");
    openInBrowserButton.textContent = "Open in Browser";
    openInBrowserButton.style = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      z-index: 1000;
      padding: 10px;
      background-color: #007BFF;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
    `;
    openInBrowserButton.onclick = () => {
      window.location.href = `googlechrome://navigate?url=${currentUrl}`;
    };
    document.body.appendChild(openInBrowserButton);
  }
}
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

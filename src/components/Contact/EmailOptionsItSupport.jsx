
import './EmailOptions.scss';
// EmailOptions.js
import React from 'react';
import './EmailOptions.scss';

const EmailOptionsITSupport = () => {
  const email = 'info@karacter.ca';
  const subject = 'Canadian Broadway Monologue Contest - IT Support Request';
  const body = 'Tell us your full name as listed here and email. If missing, support can be delayed.';

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return (
    <div className="email-options">
      <h2>Technical Support</h2>
      <h3>For IT support only</h3>
      <p>Click on the links below or write directly to <strong>info@karacter.ca</strong></p>
      <p>Include your full name as listed on this site and email. If missing, support can be delayed.</p>
      <a href={mailtoLink} className="email-option">Send Email with Default Client</a>
      <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} target="_blank" className="email-option">Send Email with Gmail</a>
      <a href={`https://outlook.live.com/owa/?path=/mail/action/compose&to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} target="_blank" className="email-option">Send Email with Outlook</a>
      <a href={`https://compose.mail.yahoo.com/?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} target="_blank" className="email-option">Send Email with Yahoo Mail</a>
      <a href={`https://mail.aol.com/webmail-std/en-us/compose?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} target="_blank" className="email-option">Send Email with AOL Mail</a>
    </div>
  );
};

export default EmailOptionsITSupport;


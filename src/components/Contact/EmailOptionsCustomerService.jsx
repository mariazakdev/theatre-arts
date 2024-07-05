import React from 'react';
import './EmailOptions.scss';

const EmailOptionsCustomerSupport = () => {
  const email = 'banerproductions@gmail.com';
  const subject = 'Canadian Broadway Monologue Contest - Customer Support Request';
  const body = 'Tell us your full name as listed here and email. If missing, support can be delayed.';

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return (
    <div className="email-options">
      <h2>Customer Service</h2>
      <h3>For any questions please write to us.</h3>
      <h4> This is not for IT support. Refer to IT email for website errors, or there may be delays in response</h4>
      <p>Click on the links below or to send directly to <strong>banerproductions@gmail.com</strong></p>
      <p>Your name is optional, unless question is directly related to your profile, then it will save time if you include more information.</p>
      <a href={mailtoLink} className="email-option">Send Email with Default Client</a>
      <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} target="_blank" className="email-option">Send Email with Gmail</a>
      <a href={`https://outlook.live.com/owa/?path=/mail/action/compose&to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} target="_blank" className="email-option">Send Email with Outlook</a>
      <a href={`https://compose.mail.yahoo.com/?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} target="_blank" className="email-option">Send Email with Yahoo Mail</a>
      <a href={`https://mail.aol.com/webmail-std/en-us/compose?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`} target="_blank" className="email-option">Send Email with AOL Mail</a>
    </div>
  );
};

export default EmailOptionsCustomerSupport;

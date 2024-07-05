// import React, { useState } from 'react';
// import './ContactITForm.scss';

// export default function ContactITForm() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     comment: ''
//   });
  
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const validate = () => {
//     let formErrors = {};
//     if (!formData.name) formErrors.name = "Name is required";
//     if (!formData.email) {
//       formErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       formErrors.email = "Email address is invalid";
//     }
//     if (!formData.comment) formErrors.comment = "Issue description is required";
//     return formErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formErrors = validate();
//     if (Object.keys(formErrors).length === 0) {
//       const form = new FormData();
//       form.append('name', formData.name);
//       form.append('email', formData.email);
//       form.append('comment', formData.comment);
//       form.append('_formsubmit_id', '');

//       fetch('https://formsubmit.io/send/mzakart@gmail.com', {
//         method: 'POST',
//         body: form
//       })
//       .then(response => response.json())
//       .then(data => {
//         console.log('Success:', data);
//         // Handle successful form submission (e.g., display a message)
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//         // Handle errors in form submission (e.g., display an error message)
//       });
//     } else {
//       setErrors(formErrors);
//     }
//   };

//   return (
//     <div className="contact-form__container">
//       <form id="contactform" onSubmit={handleSubmit} className="contact-form">
//         <h4>Create IT Ticket</h4>
//         <label htmlFor="name">Name</label>
//         <input 
//           name="name" 
//           type="text" 
//           id="name" 
//           placeholder='Full Name'
//           className="contact-form__input"
//           value={formData.name} 
//           onChange={handleChange}
//         />
//         {errors.name && <p className="error">{errors.name}</p>}

//         <label htmlFor="email">Email</label>
//         <input 
//           name="email" 
//           type="email" 
//           id="email" 
//           placeholder='Email Address'
//           className="contact-form__input"
//           value={formData.email} 
//           onChange={handleChange}
//         />
//         {errors.email && <p className="error">{errors.email}</p>}

//         <label htmlFor="comment">Issue Description</label>
//         <textarea 
//           name="comment" 
//           id="comment" 
//           rows="3" 
//           placeholder="Describe your issue"
//           className="contact-form__textarea"
//           value={formData.comment} 
//           onChange={handleChange}
//         ></textarea>
//         {errors.comment && <p className="error">{errors.comment}</p>}

//         <input 
//           name="_formsubmit_id" 
//           type="text" 
//           style={{display: 'none'}}
//         />
//         <p>Please include your full name, email, and a brief description of your issue.</p>
//         <input 
//           value="Submit" 
//           type="submit"
//           className="contact-form__submit"
//         />
//       </form>
//     </div>
//   );
// }
// const axios = require('axios');

// const sendEmail = async () => {
//   const response = await axios.post('https://api.mailersend.com/v1/email', {
//     from: 'your-email@example.com',
//     to: ['recipient@example.com'],
//     subject: 'Hello from MailerSend',
//     text: 'This is a test email.',
//   }, {
//     headers: {
//       'Authorization': 'Bearer YOUR_API_KEY',
//       'Content-Type': 'application/json',
//     },
//   });
//   console.log(response.data);
// };

// sendEmail();

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

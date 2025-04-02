import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './ContactForm.scss';

const userId = process.env.REACT_APP_EMAILJS_USER_ID;
const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID_CUSTOMER_SERVICE;
const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID_CUSTOMER_SERVICE;


const ContactSupportForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    emailjs.send(
      serviceId,
      templateId,
      formData,
      userId
    )
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        setSubmitted(true);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });
  };

  return (
    <div className='contact'>
      <h2 className='contact__title'>Customer Service</h2>
      <h3 className='contact__subtitle'>For any questions please write to us.</h3>
      <h4 className='contact__warning'>This is not for IT support. Refer to IT email for website errors, or there may be delays in response.</h4>
      {submitted ? (
        <div className='contact__thank-you-message'>
          <p>Thank you for your message!</p>
          <button className='contact__button' onClick={() => setSubmitted(false)}>
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='contact__form'>
          <div className='contact__form-group'>
            <label className='contact__label'>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className='contact__input'
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className='contact__form-group'>
            <label className='contact__label'>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className='contact__input'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className='contact__form-group'>
            <label className='contact__label'>Message:</label>
            <textarea
              name="message"
              className='contact__textarea'
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className='contact__button'>Submit</button>
        </form>
      )}
    </div>
  );
};

export default ContactSupportForm;

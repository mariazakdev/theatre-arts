import React from 'react'
import ContactITForm from '../../components/Contact/ContactItForm'
import ContactSupportForm from '../../components/Contact/ContactSupportForm'
import './ContactPage.scss'

export default function ContactPage() {
  return (
    <div className='contact-container'>
      <ContactSupportForm/>
      <ContactITForm />
    </div>
  )
}

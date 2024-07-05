import React from 'react'
import EmailOptionsCustomerSupport from '../../components/Contact/EmailOptionsCustomerService'
import EmailOptionsITSupport from '../../components/Contact/EmailOptionsItSupport'

export default function ContactPage() {
  return (
    <div>
      <EmailOptionsCustomerSupport />
      <EmailOptionsITSupport />
    </div>
  )
}

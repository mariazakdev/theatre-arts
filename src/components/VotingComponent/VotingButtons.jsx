import React from 'react'
import PaymentButton from '../PaymentButton/PaymentButton'
import './VotingButtons.scss';

export default function VotingButtons() {
  
  return (
  <div className='button-wrap'>
        <h2>Help this actor achieve their dream faster by contributing</h2>  
        <h3>Funds go to charity</h3>
   
        <div className='button-wrap__button-container'>
      <PaymentButton text="Contribute $" amount="10"/>
      <PaymentButton text="Contribute $" amount="25" />
      <PaymentButton text="Contribute $" amount="50"  />
      <PaymentButton text="Contribute $" amount="100" />
      <PaymentButton text="Contribute $" amount="250" />


    </div></div>
  )
}

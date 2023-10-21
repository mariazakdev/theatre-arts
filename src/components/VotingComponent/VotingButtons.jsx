import React from 'react'
import PaymentButton from '../PaymentButton/PaymentButton'
import './VotingButtons.scss';

export default function VotingButtons() {
  
  return (
  <div className='button-wrap'>
        <h2>Help this actor achieve their dream faster by contributing</h2>  
        <h3>Funds go to charity</h3>
   
        <div className='button-wrap__button-container'>
      <PaymentButton text="Contribute $" amount="10" priceId= {process.env.REACT_APP_ITEM1_PRICE_ID} />
      <PaymentButton text="Contribute $" amount="25" priceId= {process.env.REACT_APP_ITEM2_PRICE_ID} />
      <PaymentButton text="Contribute $" amount="50"  priceId= {process.env.REACT_APP_ITEM3_PRICE_ID} />
      <PaymentButton text="Contribute $" amount="100" priceId= {process.env.REACT_APP_ITEM4_PRICE_ID} />
      <PaymentButton text="Contribute $" amount="250" priceId= {process.env.REACT_APP_ITEM5_PRICE_ID} />


    </div></div>
  )
}

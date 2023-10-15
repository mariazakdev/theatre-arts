import React from 'react';
import './PaymentButton.scss';

function PaymentButton({ text, amount, onSuccess }) {

  const handlePlaceholderClick = () => {
    alert('Placeholder payment action triggered!');
    // Call the onSuccess function with placeholder data if necessary
    onSuccess({ placeholderData: true }, {});
  }

  return (
    <div className="button-container">

    <div className='button-container__payment-btn' onClick={handlePlaceholderClick}> {text}{amount}</div>
    </div>
  );
}

export default PaymentButton;
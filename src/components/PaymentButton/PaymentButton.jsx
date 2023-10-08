import React from 'react';


function PaymentButton({ amount, onSuccess }) {

  const handlePlaceholderClick = () => {
    alert('Placeholder payment action triggered!');
    // Call the onSuccess function with placeholder data if necessary
    onSuccess({ placeholderData: true }, {});
  }

  return (
    <button onClick={handlePlaceholderClick}>Pay ${amount}</button>
  );
}

export default PaymentButton;
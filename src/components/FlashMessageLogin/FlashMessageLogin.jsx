import React from "react";

 function FlashMessageLogin({ message, type }) {
  return (
    <div className={`flash-message ${type}`}>
      <p>{message}</p>
    </div>
  );
}

export default FlashMessageLogin;
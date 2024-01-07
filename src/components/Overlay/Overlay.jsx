// Overlay.js
import React from 'react';
import './Overlay.scss';

function Overlay({ onClose }) {
  return <div className="overlay" onClick={onClose}></div>;
}

export default Overlay;

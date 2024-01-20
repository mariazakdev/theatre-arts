import React, { useState } from 'react';
import "./Footer.scss";

function Footer() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <header className={`footer ${isNavOpen ? 'nav-open' : ''}`}>
      <div className='footer--top'>
        {/* <img src={Logo} alt="logo" className='header-logo'></img> */}
        <div className='footer-title'>
        <p>All rights reserved</p>
        </div>
   
      </div>
    </header>
  );
}

export default Footer;

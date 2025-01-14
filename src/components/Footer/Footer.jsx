import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./Footer.scss";

function Footer() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <footer className='footer'>
      <div className='footer__top'>
        {/* <img src={Logo} alt="logo" className='footer-logo'></img> */}
        <div className='footer-title'>
          <p>All rights reserved</p>
        </div>
      </div>
      <div className='footer__links'>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms-of-service">Terms of Service</Link>
        <Link to="/remove-user">Remove User</Link>
        <Link to="/contact-us">Contact Us</Link>
      </div>
    </footer>
  );
}

export default Footer;

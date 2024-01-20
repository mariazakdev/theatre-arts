import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import Logo from '../../assets/images/fotor-2024010481259.png';
import OpenBtn from '../../assets/icons/hamburger.png';
import Overlay from '../Overlay/Overlay'; 
import './Header.scss';
import { Link } from 'react-router-dom';



function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`header ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <div className='header--top'>
        <Link to='/'>
          <img src={Logo} alt="logo" className='header-logo'></img>
        </Link>
        <h1>Canadian Broadway Theatre</h1>
        <div className='header-menu'>
          <img src={OpenBtn} className='menu-icon' onClick={handleMobileMenuToggle}/>
        
          {isMobileMenuOpen && <Overlay onClose={() => setMobileMenuOpen(false)} />}
          <Nav isMobileMenuOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} /> {/* Pass onClose function to Nav */}
        </div>
      </div>
    </header>
  );
}

export default Header;


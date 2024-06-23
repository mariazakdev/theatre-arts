import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import Logo from '../../assets/images/fotor-2024010481259.png';

import TitleLogo from '../../assets/logos/logo_title2.png';
import OpenBtn from '../../assets/icons/hamburger.png';
import Overlay from '../Overlay/Overlay'; 
import './Header.scss';
import { Link } from 'react-router-dom';



function Header({URL, API_KEY}) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`header ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <div className='header--top'>
        <div className='header--top__left'>

             <Link to='/'>
          <div className='header-logo'>           <img src={Logo} alt="logo" className='header-logo__pic'></img> </div>

        </Link>
        <div className='header-title'> 
          <img src={TitleLogo} alt="title" className='header-title__pic'></img>
          {/* <h1 className=''>Canadian Broadway</h1>
          <h2>Monologue Contest</h2> */}

          </div> 
        </div>
        <div className='header--top__right'>
            
        <div className='header-menu'>
          <img src={OpenBtn} className='menu-icon' onClick={handleMobileMenuToggle}/>
        
          {isMobileMenuOpen && <Overlay onClose={() => setMobileMenuOpen(false)} />}
          <Nav isMobileMenuOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} URL={URL} API_KEY={API_KEY}/> 
        </div>
        </div>
     
     
      </div>
    </header>
  );
}

export default Header;


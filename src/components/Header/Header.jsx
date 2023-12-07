// Header.js
import React, { useState } from 'react';
import Logo from "../../assets/icons/drama.png";
import Nav from '../Nav/Nav';
import "./Header.scss";

function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <header className={`header ${isNavOpen ? 'nav-open' : ''}`}>
      <div className='header--top'>
        <img src={Logo} alt="logo" className='header-logo'></img>
        <div className='header-title'>
          <h1>Canadian Broadway Theatre</h1>
          <h2>Monologue Competition</h2>
        </div>
        <div className='header--top__menu-icon' onClick={toggleNav}>
          {isNavOpen ? '✕' : '☰'}
        </div>
        <div className={`header-nav ${isNavOpen ? 'nav-open' : ''}`}>
          <Nav closeNav={closeNav} />
        </div>
      </div>
    </header>
  );
}

export default Header;

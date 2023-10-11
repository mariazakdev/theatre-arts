import React from 'react';
import Logo from "../../assets/icons/drama.png"
import "./Header.scss";

function Header() {
  return (
    <header className='header'>
      <img src={Logo} alt="logo" className='header-logo'></img>
      <div className='header-title'>
        <h1 >Canadian Broadway Theatre</h1>  
        <h2>Monologue Competition</h2>
        </div>
      
      <div className='header-nav'></div>
    </header>
  );
}

export default Header;
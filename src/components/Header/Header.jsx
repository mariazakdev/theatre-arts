import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import Logo from '../../assets/images/fotor-2024010481259.png';
import "./Header.scss";
import { Link } from 'react-router-dom';

function Header() {

  return (
    <header className='header'>
      <div className='header--top'>
        <Link to='/'>
        <img src={Logo} alt="logo" className='header-logo'></img>
        </Link>
        {/* <div className='header-title'> */}
          <h1>Canadian Broadway Theatre</h1>
        {/* </div> */}
       
        <div >
          <Nav  />
        </div>
      </div>
    </header>
  );
}

export default Header;

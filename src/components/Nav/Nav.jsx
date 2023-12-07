import React from 'react';
import "./Nav.scss";

function Nav({ closeNav }) {
  const handleLinkClick = () => {
    closeNav();
  };

  return (
    <nav className="nav">
      <ul>
        {/* Common Routes */}
        <li><a href="/home" onClick={handleLinkClick}>Home</a></li>
        <li><a href="/signup" onClick={handleLinkClick}>Sign Up</a></li>
        <li><a href="/login" onClick={handleLinkClick}>Login</a></li>
        <li><a href="/actors" onClick={handleLinkClick}>Actors</a></li>

        {/* Routes for Contestants */}
        <li><a href="/contestant/dashboard" onClick={handleLinkClick}>Contestant Dashboard</a></li>
        <li><a href="/contestant/upload" onClick={handleLinkClick}>Video Upload</a></li>
        <li><a href="/contestant/update-profile" onClick={handleLinkClick}>Update Profile</a></li>
      </ul>
    </nav>
  );
}
export default Nav;

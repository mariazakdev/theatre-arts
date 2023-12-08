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
        <li><a href="/actors" onClick={handleLinkClick}>Actors</a></li>

        {/* Routes for Contestants */}
        <li><a href="/contestant/dashboard" onClick={handleLinkClick}>Dashboard</a></li>
      </ul>
    </nav>
  );
}
export default Nav;


import React, { useState } from "react";
import CloseBtn from "../../assets/icons/icone-x-grise.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Nav.scss";

function Nav({ isMobileMenuOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLinkClick = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleShareClick = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Profile URL copied to clipboard!");
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <nav className={`nav ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}>
      <ul>
        <li>
          <img
            src={CloseBtn}
            alt="close"
            className="close-btn"
            onClick={onClose}
          />
        </li>
        {currentUser ? (
          <>
            {/* Render contestant links */}
            <li
                href="/contestant/enter"
                onClick={() => handleLinkClick("/contestant/enter")}
              >
                Enter Contest
              
            </li>
            {/* Render admin link */}
            {currentUser.is_admin === 1 && (
              <li>
                <a href="/admin" onClick={() => handleLinkClick("/admin")}>
                  Admin
                </a>
              </li>
            )}
            {/* Logout button */}
            <li onClick={handleLogout} className="nav-logout">
              Logout
            </li>
            {/* Share Profile */}
            <li onClick={handleShareClick}className="nav-logout nav-share-profile">
              Share Profile
            </li>
          </>
        ) : (
          <li>
            <a href="/login" onClick={() => handleLinkClick("/login")}>
              Login
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Nav;

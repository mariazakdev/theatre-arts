import React, { useState, useEffect } from "react";
import CloseBtn from "../../assets/icons/icone-x-grise.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Nav.scss";

function Nav({ isMobileMenuOpen, onClose, URL, API_KEY }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          // console.log("Fetching data for user:", currentUser.uid); // Log the user ID

          const response = await axios.get(
            `${URL}/users/${currentUser.uid}`,
            { headers: { Authorization: `${API_KEY}` } }
          );
          const data = response.data;
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, [currentUser, URL, API_KEY]);

  const handleLinkClick = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };



  const renderContestantLinks = () => {
    if (userData?.is_contestant === 1 && userData.hasPaid === 0 && userData.uploadStatus === 0) {
      return (
        <li>
          <a href="/contestant/enter" onClick={() => handleLinkClick("/contestant/upload")}>
            Enter Contest
          </a>
        </li>
      );
    } else if (userData?.is_contestant === 1 && userData.hasPaid === 1 && userData.uploadStatus === 0) {
      return (
        <li>
          <a href="/contestant/upload" onClick={() => handleLinkClick("/contestant/upload")}>
            Upload Video
          </a>
        </li>
      );
    } else if (userData?.is_contestant === 1 && userData.uploadStatus === 1 && userData.hasPaid === 1) {
      return (
        <li>
          <a href="/contestant/dashboard" onClick={() => handleLinkClick("/contestant/dashboard")}>
            Dashboard
          </a>
        </li>
      );
    }
    return null;
  };

  const handleShareClick = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Profile URL copied to clipboard!");
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // console.log("userData", userData);

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
            {renderContestantLinks()}
            {userData?.is_admin === 1 && (
              <li>
                <a
                  href="/admin"
                  onClick={() => handleLinkClick("/admin")}
                >
                  Admin
                </a>
              </li>
            )}
            <li onClick={handleLogout} className="nav-logout">
              Logout
            </li>
            {/* <li onClick={handleShareClick} className="nav-share-profile">
              Share Profile
            </li> */}
          </>
        ) : (
          <li>
            <a href="/login" onClick={() => handleLinkClick("/login")}>
              Login
            </a>
          </li>
          
        )}
         <li onClick={handleShareClick} className="nav-share-profile">
              Share Profile
            </li>
            <li>
          <a href="https://thesunking.canadatheatre.ca" target="_blank" rel="noopener noreferrer" className="nav-sunking nav-share-profile">
           The Sun King
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;

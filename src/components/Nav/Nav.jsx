import React, { useState, useEffect } from "react";
import CloseBtn from "../../assets/icons/icone-x-grise.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Nav.scss";

const URL = process.env.REACT_APP_BACKEND_URL;

function Nav({ isMobileMenuOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const response = await axios.get(
            `${URL}/users/${currentUser.uid}`
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
  }, [currentUser]);

  const handleLinkClick = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className={`nav ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}>
      <ul>
        <li>
          {" "}
          <img
            src={CloseBtn}
            alt="close"
            className="close-btn"
            onClick={onClose}
          />
        </li>

        {currentUser ? (
          userData?.is_contestant ? (
            <>
              <li>
                <a
                  href="/contestant/dashboard"
                  onClick={() => handleLinkClick("/contestant/dashboard")}
                >
                  Dashboard
                </a>
              </li>
              <li onClick={handleLogout} className="nav-logout">
                Logout
              </li>
            </>
          ) : (
            <li onClick={handleLogout} className="nav-logout">
              Logout
            </li>
          )
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

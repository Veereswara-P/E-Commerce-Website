import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProfileMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = () => setIsOpen(false);
  
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="profile-menu-container" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="icon-btn">
        {user ? (
          <i className="fa-solid fa-user-circle"></i>
        ) : (
          <i className="fa-solid fa-user"></i>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {user ? (
            <>
              <div className="dropdown-header">
                <strong>{user.customer_name || user.email}</strong>
              </div>
              <Link to="/auth" onClick={handleLinkClick}>My Profile</Link>
              
              {/* --- THIS IS THE NEW CODE --- */}
              {/* It checks if the user's role is 'admin' before rendering the link */}
              {user.role === 'admin' && (
                <Link to="/admin" onClick={handleLinkClick}>Admin Dashboard</Link>
              )}
              
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth" onClick={handleLinkClick}>Login</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
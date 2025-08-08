// src/components/ProfileMenu.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProfileMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- THIS IS THE FIX ---
  // This useEffect hook closes the dropdown whenever the user's
  // login status changes, preventing it from being open after login.
  useEffect(() => {
    setIsOpen(false);
  }, [user]); // It runs every time the 'user' object changes

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
    setIsOpen(false); // Also ensure it closes on logout click
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="icon-btn">
        {user ? (
          <i className="fa-solid fa-user-circle text-2xl"></i>
        ) : (
          <i className="fa-solid fa-user text-xl"></i>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          {user ? (
            // Menu for a logged-in user
            <>
              <div className="px-4 py-2 text-sm text-gray-700">
                Signed in as <br />
                <strong className="font-medium">{user.customer_name || user.email}</strong>
              </div>
              <hr />
              <Link to="/profile" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
              <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
            </>
          ) : (
            // Menu for a logged-out user (Signup/Login)
            <>
              <Link to="/login" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
              <Link to="/register" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;

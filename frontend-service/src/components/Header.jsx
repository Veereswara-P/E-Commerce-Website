// src/components/Header.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  // 1. Logic moved from GlobalSearchBar.jsx
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); // Prevents the page from reloading
    if (searchTerm.trim()) {
      // Navigates to the search results page with the query
      navigate(`/search?q=${searchTerm.trim()}`);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">MyApp</Link>
      </div>

      {/* 2. JSX for the search bar is now directly here */}
      <form onSubmit={handleSearch} className="gmail-header-search">
        <input
          type="text"
          placeholder="Search for products, categories..."
          className="gmail-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" style={{ display: 'none' }} aria-label="Search"></button>
      </form>

      <nav className="navbar">
        <Link to="/cart">Cart</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
};

export default Header;

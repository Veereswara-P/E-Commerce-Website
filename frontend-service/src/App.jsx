// src/App.jsx
import React, { useContext, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import { AuthContext } from './context/AuthContext';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProductListPage from './pages/ProductListPage';
import ProfileMenu from './components/ProfileMenu';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';

function App() {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
    }
  };

  return (
    <div>
      <header className="gmail-header">
        <div className="gmail-header-left">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '12px' }}>
            <img src="/MarketPlace logo.jpg" alt="App logo" style={{ height: '32px', width: 'auto' }} />
            <span style={{ fontSize: '1.4rem', color: '#444' }}>MarketPlace</span>
          </Link>
        </div>
        
        <form onSubmit={handleSearch} className="gmail-header-search">
          <input
            type="text"
            placeholder="Search products and categories..."
            className="gmail-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" style={{ display: 'none' }} aria-label="Search"></button>
        </form>
        
        <div className="gmail-header-right">
          <Link to="/wishlist" className="icon-btn" title="Wishlist">
             <i className="fa-solid fa-heart"></i>
          </Link>
          <Link to="/cart" className="icon-btn" title="Cart">
             <i className="fa-solid fa-cart-shopping"></i>
          </Link>
          <ProfileMenu />
        </div>
      </header>
      
      <main id="root">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

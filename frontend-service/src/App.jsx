import React, { useContext, useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import api from './api';

// Import Contexts, Components, and Pages
import { AuthContext } from './context/AuthContext';
import { AlertProvider } from './components/Alert';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ProductListPage from './pages/ProductListPage';
import ProfileMenu from './components/ProfileMenu';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import AuthPage from './pages/AuthPage'; // <-- Import the new consolidated page
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard'; 

function App() {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState({ products: [], categories: [] });
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions({ products: [], categories: [] });
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const { data } = await api.get('/search', { params: { q: searchTerm } });
        setSuggestions(data);
        setIsSuggestionsVisible(true);
      } catch (err) {
        console.error("Failed to fetch search suggestions:", err);
      }
    };
    const debounceTimer = setTimeout(() => fetchSuggestions(), 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSuggestionsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
      setIsSuggestionsVisible(false);
      setIsMenuOpen(false);
    }
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const handleSuggestionClick = (path) => {
    navigate(path);
    setIsSuggestionsVisible(false);
    setSearchTerm('');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <AlertProvider>
      <div>
        <header className="main-header">
          <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <Link to="/" onClick={closeMenu} className="header-logo">
            <img src="/MarketPlace logo.jpg" alt="App logo" />
            <span>MarketPlace</span>
          </Link>
          <form onSubmit={handleSearch} className="header-search" ref={searchContainerRef}>
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSuggestionsVisible(true)}
              ref={searchInputRef}
            />
            <button type="submit" style={{ display: 'none' }}></button>
            
            {searchTerm && (
              <button type="button" onClick={handleClearSearch} className="clear-search-btn">
                &times;
              </button>
            )}

            {isSuggestionsVisible && (suggestions.products.length > 0 || suggestions.categories.length > 0) && (
              <div className="suggestions-dropdown">
                {/* ... suggestions logic ... */}
              </div>
            )}
          </form>
          <div className="header-nav">
            <Link to="/wishlist" className="icon-btn" title="Wishlist">
               <i className="fa-solid fa-heart"></i>
            </Link>
            <Link to="/cart" className="icon-btn" title="Cart">
               <i className="fa-solid fa-cart-shopping"></i>
            </Link>
            <ProfileMenu />
          </div>
        </header>

        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>
            <Link to="/cart" onClick={closeMenu}>Cart</Link>
            <div className="mobile-profile-menu">
              <ProfileMenu />
            </div>
          </div>
        )}
        
        <main id="root">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* --- CONSOLIDATED AUTH ROUTE --- */}
            <Route path="/auth" element={<AuthPage />} />

          </Routes>
        </main>
      </div>
    </AlertProvider>
  );
}

export default App;
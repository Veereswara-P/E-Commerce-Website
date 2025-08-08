// src/context/WishlistContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const localData = localStorage.getItem('wishlistItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    // Protection Logic: Check for user before proceeding
    if (!user) {
      navigate('/login');
      return;
    }

    // Original logic for toggling wishlist
    setWishlistItems(prevItems => {
      const isWishlisted = prevItems.some(item => item.product_id === product.product_id);
      if (isWishlisted) {
        return prevItems.filter(item => item.product_id !== product.product_id);
      } else {
        return [...prevItems, product];
      }
    });
  };

  const isItemInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const wishlistContextValue = {
    wishlistItems,
    toggleWishlist,
    isItemInWishlist,
  };

  return (
    <WishlistContext.Provider value={wishlistContextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

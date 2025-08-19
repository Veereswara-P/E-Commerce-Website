import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import api from '../api';
import { useAlert } from '../components/Alert';

export const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const showAlert = useAlert();

  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (user) {
        try {
          const { data } = await api.get('/wishlist');
          setWishlistItems(data);
        } catch (err) {
          console.error("Failed to fetch wishlist:", err);
        }
      } else {
        setWishlistItems([]);
      }
    };
    fetchWishlistItems();
  }, [user]);

  const isItemInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const isWishlisted = isItemInWishlist(product.product_id);

    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${product.product_id}`);
        setWishlistItems(prevItems =>
          prevItems.filter(item => item.product_id !== product.product_id)
        );
        showAlert(`${product.product_name} removed from wishlist.`);
      } else {
        await api.post('/wishlist', { productId: product.product_id });
        setWishlistItems(prevItems => [...prevItems, product]);
        showAlert(`${product.product_name} added to wishlist!`);
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
      showAlert('Could not update wishlist.', 'error');
    }
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
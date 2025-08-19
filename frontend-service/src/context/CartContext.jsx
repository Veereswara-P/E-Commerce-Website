import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import api from '../api';
import { useAlert } from '../components/Alert';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const showAlert = useAlert();

  const fetchCartItems = async () => {
    if (user) {
      try {
        const { data } = await api.get('/cart');
        setCartItems(data);
      } catch (err) {
        console.error("Failed to fetch cart items:", err);
      }
    } else {
      setCartItems([]);
    }
  };

  // Fetch cart items when the user's status changes
  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const itemInCart = cartItems.find(item => item.product_id === product.product_id);
    const currentQuantity = itemInCart ? itemInCart.quantity : 0;
    const stockQuantity = product.product_stock_quantity;

    if ((currentQuantity + quantity) > stockQuantity) {
      showAlert(`Cannot add more: only ${stockQuantity} in stock.`, 'error');
      return;
    }

    try {
      await api.post('/cart', {
        productId: product.product_id,
        product_quantity: quantity,
      });
      await fetchCartItems(); // Re-fetch the cart to ensure data consistency
      showAlert(`${product.product_name} added to cart!`);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Could not add item to cart.';
      showAlert(errorMsg, 'error');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      await fetchCartItems(); // Re-fetch
      showAlert('Item removed from cart.');
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      showAlert('Could not remove item from cart.', 'error');
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const item = cartItems.find(item => item.product_id === productId);
    if (!item) return;

    // Check against stock quantity
    const stockQuantity = item.product_stock_quantity; 
    if (newQuantity > stockQuantity) {
      showAlert(`Cannot set quantity: only ${stockQuantity} in stock.`, 'error');
      return;
    }
    
    if (newQuantity < 1) {
      return removeFromCart(productId);
    }
  
    const difference = newQuantity - item.quantity;
  
    try {
      if (difference > 0) { // Quantity increased
        await api.post('/cart', { productId: productId, product_quantity: difference });
      } else if (difference < 0) { // Quantity decreased
        for (let i = 0; i < Math.abs(difference); i++) {
          await api.put(`/cart/decrease/${productId}`);
        }
      }
      await fetchCartItems(); // Re-fetch
      showAlert('Cart updated.');
    } catch (err) {
      console.error("Failed to update quantity:", err);
      showAlert('Could not update quantity.', 'error');
    }
  };
  
  const clearCart = async () => {
    try {
      await api.delete('/cart');
      await fetchCartItems(); // Re-fetch
      showAlert('Cart cleared.');
    } catch (err) {
      console.error("Failed to clear cart:", err);
      showAlert('Could not clear cart.', 'error');
    }
  };

  const cartContextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
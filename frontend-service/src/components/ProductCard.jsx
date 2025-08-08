// src/components/ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ item, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Navigate to product detail page only if the user didn't click a button
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'I') {
      navigate(`/products/${item.product_id}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click from firing
    onAddToCart(item);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation(); // Prevent card click from firing
    onAddToWishlist(item);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        {/* --- FIX: Use the correct property name from your API response --- */}
        <img src={item.category_image_url} alt={item.product_name} className="product-image" />
        <button className="wishlist-btn" title="Add to Wishlist" onClick={handleAddToWishlist}>
          <i className="fa-regular fa-heart"></i>
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{item.product_name}</h3>
        <p className="product-price">${item.product_price}</p>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

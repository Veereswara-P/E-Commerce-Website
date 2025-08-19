// src/components/ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ item, onAddToCart }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isItemInWishlist } = useWishlist();

  const handleCardClick = (e) => {
    // Navigate only if the click is not on a button or an icon within a button
    if (e.target.closest('button')) return;
    navigate(`/products/${item.product_id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(item);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(item);
  };

  const itemIsWishlisted = isItemInWishlist(item.product_id);

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img src={item.category_image_url} alt={item.product_name} className="product-image" />
        <button 
          onClick={handleToggleWishlist} 
          className="wishlist-btn"
          title={itemIsWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <i className={itemIsWishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart"} style={{ color: itemIsWishlisted ? 'red' : 'black' }}></i>
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
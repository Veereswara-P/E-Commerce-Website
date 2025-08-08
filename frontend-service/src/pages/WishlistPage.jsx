// src/pages/WishlistPage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-6">Save items you love by clicking the heart icon.</p>
        <Link to="/" className="px-6 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      <div className="product-grid">
        {wishlistItems.map(item => (
          <ProductCard
            key={item.product_id}
            item={item}
            onAddToCart={addToCart}
            onAddToWishlist={toggleWishlist}
          />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;

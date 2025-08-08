// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return <div className="text-center p-10">Product not found.</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2">
          {/* --- FIX: Use the correct image property 'category_image_url' --- */}
          <img src={product.category_image_url} alt={product.product_name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-bold mb-4">{product.product_name}</h1>
          <p className="text-2xl text-indigo-600 mb-6">${product.product_price}</p>
          <p className="text-gray-700 mb-6">{product.product_description}</p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => addToCart(product)}
              className="px-8 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => toggleWishlist(product)}
              className="p-3 border rounded-full hover:bg-gray-100"
              title="Add to Wishlist"
            >
              <i className="fa-regular fa-heart text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

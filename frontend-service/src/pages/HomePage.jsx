// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import Loader from '../components/Loader';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const observer = useRef();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products', {
          params: { page: currentPage, limit: 12 }
        });

        // --- THIS IS THE FIX ---
        // We will now filter out any duplicate products before updating the state.
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.product_id));
          const newProducts = response.data.products.filter(p => !existingIds.has(p.product_id));
          return [...prev, ...newProducts];
        });
        
        setHasMore(response.data.products.length > 0);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage]); // The dependency array is now correct

  const lastProductElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  return (
    <div className="homepage-layout">
      <div className="sidebar-column">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map(cat => (
            <div key={cat.category_id} className="category-card" onClick={() => navigate(`/products?category=${cat.category_id}`)}>
              <img src={cat.image_url} alt={cat.category_name} />
              <div className="category-card-name">{cat.category_name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="main-column">
        <h2>Featured Items</h2>
        <div className="product-grid">
          {products.map((product, index) => (
            <div ref={products.length === index + 1 ? lastProductElementRef : null} key={product.product_id}>
              <ProductCard item={product} onAddToCart={addToCart} onAddToWishlist={toggleWishlist} />
            </div>
          ))}
        </div>
        {loading && <Loader />}
        {!hasMore && products.length > 0 && <p className="text-center p-5">You've reached the end.</p>}
      </div>
    </div>
  );
};

export default HomePage;

// src/pages/ProductListPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/products', {
          params: {
            category: categoryId || undefined
          }
        });
        setProducts(response.data.products || response.data); // Handle both paginated and non-paginated responses
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">
        {categoryId ? `Products in Category ${categoryId}` : 'All Products'}
      </h1>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard
              key={product.product_id}
              item={product}
              onAddToCart={addToCart}
              onAddToWishlist={toggleWishlist}
            />
          ))}
        </div>
      ) : (
        <p>No products found in this category.</p>
      )}
    </div>
  );
};

export default ProductListPage;

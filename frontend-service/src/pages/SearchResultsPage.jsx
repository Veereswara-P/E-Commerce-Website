import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { CartContext } from '../context/CartContext.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  
  const [results, setResults] = useState({ products: [], categories: [] });
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist } = useContext(WishlistContext);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get('/search', { params: { q: query } });
        setResults(response.data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page-container p-8">
      <h2 className="text-2xl font-bold mb-6">Search Results for "{query}"</h2>

      {results.categories.length > 0 && (
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Matching Categories</h3>
          <div className="category-grid">
            {results.categories.map(cat => (
              <div key={cat.category_id} className="category-card" onClick={() => navigate(`/products?category=${cat.category_id}`)}>
              
                <div className="category-card-name">{cat.category_name}</div>
              </div>
              
            ))}
          </div>
        </section>
      )}

      {results.products.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold mb-4">Matching Products</h3>
          <div className="product-grid">
            {results.products.map(product => (
              <ProductCard key={product.product_id} item={product} onAddToCart={addToCart} onAddToWishlist={toggleWishlist} />
            ))}
          </div>
        </section>
      )}

      {!loading && results.products.length === 0 && results.categories.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No results found for your search.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
import React, { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import api from '../api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import Loader from '../components/Loader';

// Fetching function for products, accepts a pageParam from React Query
const fetchProducts = async ({ pageParam = 1 }) => {
  const { data } = await api.get('/products', {
    params: { page: pageParam, limit: 12 }
  });
  return data.data;
};

// Fetching function for categories
const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    return data.data;
};

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const observer = useRef();

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingProducts,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.products.length ? allPages.length + 1 : undefined;
    },
  });

  const lastProductElementRef = useCallback((node) => {
    if (isLoadingProducts) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingProducts, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      <div className="sidebar-column">
        <h2>Shop by Category</h2>
        {isLoadingCategories ? <Loader /> : (
            <div className="category-grid">
            {categories?.map(cat => (
                <div key={cat.category_id} className="category-card" onClick={() => navigate(`/products?category=${cat.category_id}`)}>
                    <div className="category-card-name">{cat.category_name}</div>
                </div>
            ))}
            </div>
        )}
      </div>

      <div className="main-column">
        <h2>Featured Items</h2>
        <div className="product-grid">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {/* Defensive filter to skip any products with missing IDs */}
              {page.products.filter(p => p && p.product_id).map((product, index) => (
                <div 
                  ref={data.pages.length === i + 1 && page.products.length === index + 1 ? lastProductElementRef : null} 
                  key={product.product_id}
                >
                  <ProductCard item={product} onAddToCart={addToCart} onAddToWishlist={toggleWishlist} />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        {isFetchingNextPage && <Loader />}
        {!hasNextPage && !isLoadingProducts && <p className="text-center p-5">You've seen all the products!</p>}
      </div>
    </div>
  );
};

export default HomePage;
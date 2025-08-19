import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const fetchProductsByCategory = async (categoryId) => {
  const { data } = await api.get('/products', {
    params: { category_id: categoryId || undefined }
  });
  return data.data.products; 
};

const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    return data.data;
};

const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', categoryId], 
    queryFn: () => fetchProductsByCategory(categoryId)
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  // --- FIX ---
  // Use a non-strict (==) comparison to match the string from the URL with the number from the data.
  const currentCategory = categories?.find(cat => cat.category_id == categoryId);

  if (isLoadingProducts || isLoadingCategories) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">
       
        {currentCategory ? currentCategory.category_name : (categoryId ? `Category #${categoryId}` : 'All Products')}
      </h1>
      {products && products.length > 0 ? (
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
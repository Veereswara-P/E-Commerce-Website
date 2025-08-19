import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

// Define the fetching function outside the component for clarity and reusability.
const fetchProductById = async (productId) => {
  // The backend now returns a consistent success object with a 'data' property.
  const { data } = await api.get(`/products/${productId}`);
  return data.data; 
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isItemInWishlist } = useWishlist();

  // Use the useQuery hook to fetch and manage the data.
  const { data: product, isLoading, isError, error } = useQuery({
    // A unique key for this query. React Query uses this for caching.
    queryKey: ['product', id], 
    // The function that will be called to fetch the data.
    queryFn: () => fetchProductById(id) 
  });

  // 1. Handle the loading state
  if (isLoading) {
    return <Loader />;
  }

  // 2. Handle the error state
  if (isError) {
    return <div className="text-center p-10">Error: {error.message}</div>;
  }
  
  // 3. Handle the case where the product is not found
  if (!product) {
    return <div className="text-center p-10">Product not found.</div>;
  }

  const itemIsWishlisted = isItemInWishlist(product.product_id);

  // 4. Render the successful state
  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/2">
          <img 
            src={product.category_image_url} 
            alt={product.product_name} 
            className="w-full h-auto object-cover rounded-lg shadow-lg" 
          />
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
              title={itemIsWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <i 
                className={itemIsWishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart"} 
                style={{ color: itemIsWishlisted ? 'red' : 'black' }}
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
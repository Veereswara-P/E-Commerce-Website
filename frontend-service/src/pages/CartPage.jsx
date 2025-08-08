// src/pages/CartPage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.product_price) * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="px-6 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          {cartItems.map(item => (
            <div key={item.product_id} className="flex items-center border-b py-4">
              {/* --- FIX: Use the correct image property 'category_image_url' --- */}
              <img src={item.category_image_url} alt={item.product_name} className="w-24 h-24 object-cover rounded-md mr-4" />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{item.product_name}</h2>
                <p className="text-gray-600">${item.product_price}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value, 10))}
                  className="w-16 text-center border rounded-md mx-4"
                  min="1"
                />
                <button onClick={() => removeFromCart(item.product_id)} className="text-red-500 hover:text-red-700" title="Remove item">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <hr/>
          <div className="flex justify-between font-bold text-xl mt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="w-full mt-6 py-3 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

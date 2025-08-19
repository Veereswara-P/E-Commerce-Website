import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // <-- Import
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { AlertProvider } from './components/Alert.jsx';
import './index.css';

// Create a client
const queryClient = new QueryClient(); // <-- Create an instance

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrap your app in the provider */}
      <QueryClientProvider client={queryClient}> 
        <AlertProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </AlertProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
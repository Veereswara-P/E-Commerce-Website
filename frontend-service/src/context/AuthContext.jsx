import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAlert } from '../components/Alert';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const showAlert = useAlert();

  useEffect(() => {
    const checkLoggedIn = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Correctly parse the stored user JSON
          setUser(JSON.parse(storedUser));
        } catch (err) {
          // If parsing fails, clear the invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      // --- FIX: Access the nested data object ---
      const { token, user } = data.data;

      localStorage.setItem('token', token);
      // --- FIX: Store only the user object, and stringify it ---
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      showAlert('Login Successful!');
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
      showAlert(errorMsg, 'error');
    }
  };
  
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      // --- FIX: Access the nested data object ---
      const { token, user } = data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      showAlert('Account created successfully!');
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      showAlert(errorMsg, 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Also remove the user object
    setUser(null);
    showAlert('You have been logged out.');
    navigate('/auth');
  };
  
  // ... other functions like deleteUser

  const authContextValue = { user, setUser, loading, login, register, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
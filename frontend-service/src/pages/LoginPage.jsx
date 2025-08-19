import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const LoginPage = ({ onSwitchToRegister }) => {
  const { login, loading, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Login to your Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="form-input" required />
        </div>
        
        {loading && <Loader />}
        {error && !loading && <p className="auth-error-text">{error}</p>}

        <div className="form-group">
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>
      <p className="auth-switch-text">
        Don't have an account?{' '}
        <button onClick={onSwitchToRegister} className="auth-switch-link">
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginPage;
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const RegisterPage = ({ onSwitchToLogin }) => {
  const { register, loading, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', gender: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register({ name: formData.name, email: formData.email, password: formData.password, gender: formData.gender });
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Create your Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" type="text" onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" onChange={handleChange} value={formData.gender} className="form-select" required>
            <option value="" disabled>Select a gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {loading && <Loader />}
        {error && !loading && <p className="auth-error-text">{error}</p>}

        <div className="form-group">
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
      </form>
      <p className="auth-switch-text">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="auth-switch-link">
          Log in
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;
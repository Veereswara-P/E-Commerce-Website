// src/pages/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';

const RegisterPage = () => {
  const { register, loading, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', gender: '' });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Full name is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!formData.gender) errors.gender = 'Please select a gender';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    await register({ name: formData.name, email: formData.email, password: formData.password, gender: formData.gender });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <input id="name" name="name" type="text" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" />
            {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" name="email" type="email" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" />
            {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input id="password" name="password" type="password" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" />
            {formErrors.password && <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md" />
            {formErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{formErrors.confirmPassword}</p>}
          </div>
          <div>
            <label htmlFor="gender" className="text-sm font-medium">Gender</label>
            <select id="gender" name="gender" onChange={handleChange} value={formData.gender} className="w-full px-3 py-2 mt-1 border rounded-md">
              <option value="" disabled>Select a gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formErrors.gender && <p className="mt-1 text-xs text-red-600">{formErrors.gender}</p>}
          </div>

          {loading && <Loader />}
          {error && !loading && <p className="text-center text-sm text-red-600">{error}</p>}

          <div>
            <button type="submit" disabled={loading} className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

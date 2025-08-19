import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import api from '../api';

const ProfilePage = () => {
  // 1. Add 'deleteUser' from the context
  const { user, setUser, logout, deleteUser } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.customer_name || '',
        email: user.customer_email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.patch('/auth/profile', {
        name: formData.name,
        email: formData.email
      }); 
      setUser(data.user); 
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="flex justify-between items-center mb-8">
          <h2 className="auth-title" style={{ marginBottom: 0 }}>Your Profile</h2>
          
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              disabled
              className="form-input bg-gray-100"
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <input 
              type="text" 
              value={user.customer_gender || 'Not specified'} 
              disabled 
              className="form-input bg-gray-100"
            />
          </div>
          
          {loading && <Loader />}
          {error && <p className="auth-error-text">{error}</p>}
          {success && <p className="text-sm text-center text-green-600 mb-4">{success}</p>}

          <div className="form-group">
            <button 
              type="submit" 
              disabled={loading}
              className="auth-btn"
            >
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>

        {/* --- 2. ADD THE DELETE ACCOUNT SECTION HERE --- */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-bold text-red-700">Danger Zone</h3>
          <p className="text-sm text-gray-600 mt-2">Deleting your account is a permanent action and cannot be undone.</p>
          <button 
            onClick={deleteUser} 
            className="w-full mt-4 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete My Account
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ProfilePage;
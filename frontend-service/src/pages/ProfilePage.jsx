// src/pages/ProfilePage.jsx
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import api from '../api';

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);
  
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
      const { data } = await api.patch('/auth/profile', formData); 
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
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" id="name" name="name" value={formData.name} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" id="email" name="email" value={formData.email} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <input type="text" value={user.customer_gender || 'Not specified'} />
        </div>
        


      
      </form>
    </div>
  );
};

export default ProfilePage;

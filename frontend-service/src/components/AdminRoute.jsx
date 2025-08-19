import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <Loader />; // Show a loader while checking auth status
    }
     console.log("Checking user in AdminRoute:", user);

    // First, check if a user is logged in, then check if their role is 'admin'
    if (user && user.role === 'admin') {
        return <Outlet />; // If admin, render the child route (e.g., AdminDashboard)
    }

    // If not an admin, redirect to the home page
    return <Navigate to="/" />;
};

export default AdminRoute;
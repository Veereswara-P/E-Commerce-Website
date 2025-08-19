import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';

const AuthPage = () => {
  const { user } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);

  // --- ADD THIS LINE TO DEBUG ---
  console.log("User state in AuthPage:", user);

  if (user) {
    // If the user is logged in, show their profile page
    return <ProfilePage />;
  }

  // If the user is not logged in, show either the Login or Register form
  return (
    <div className="auth-container">
      {showLogin ? (
        <LoginPage onSwitchToRegister={() => setShowLogin(false)} />
      ) : (
        <RegisterPage onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;
import React, { useState, useContext, createContext } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 2000); // Alert disappears after 2 seconds
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      {alert && (
        <div 
          className={`alert-popup ${alert ? 'show' : ''} ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}
        >
          {alert.message}
        </div>
      )}
    </AlertContext.Provider>
  );
};
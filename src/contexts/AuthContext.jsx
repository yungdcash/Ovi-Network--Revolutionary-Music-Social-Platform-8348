import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    // Check if user is returning
    const savedUser = localStorage.getItem('ovi-user');
    const isReturningUser = localStorage.getItem('ovi-user-setup');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('ovi-user');
      }
    }
    
    if (isReturningUser) {
      setIsFirstTime(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsFirstTime(false);
    localStorage.setItem('ovi-user', JSON.stringify(userData));
    localStorage.setItem('ovi-user-setup', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ovi-user');
    localStorage.removeItem('ovi-user-setup');
    setIsFirstTime(true);
  };

  const completeSetup = () => {
    setIsFirstTime(false);
    localStorage.setItem('ovi-user-setup', 'true');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isFirstTime,
      login,
      logout,
      completeSetup
    }}>
      {children}
    </AuthContext.Provider>
  );
};
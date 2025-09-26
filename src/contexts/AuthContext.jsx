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
  const [sessionId, setSessionId] = useState(null);

  // Generate session ID on component mount
  useEffect(() => {
    const generateSessionId = () => {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };
    setSessionId(generateSessionId());
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ovi-user');
      const userSetup = localStorage.getItem('ovi-user-setup');
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setIsFirstTime(false);
      }
      
      if (userSetup) {
        setIsFirstTime(false);
      }
    } catch (error) {
      console.error('Error parsing saved user data:', error);
      localStorage.removeItem('ovi-user');
      localStorage.removeItem('ovi-user-setup');
    }
  }, []);

  // Listen for profile picture updates from other components
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail && event.detail.profilePhoto) {
        setUser(prevUser => {
          if (prevUser) {
            const updatedUser = { ...prevUser, profilePhoto: event.detail.profilePhoto };
            localStorage.setItem('ovi-user', JSON.stringify(updatedUser));
            return updatedUser;
          }
          return prevUser;
        });
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profilePhotoUpdated', handleProfileUpdate);
  }, []);

  /**
   * Log user action (mock implementation for development)
   * @param {string} actionType - Type of action
   * @param {object} actionData - Additional data related to the action
   * @returns {Promise<boolean>} - Returns true if successful
   */
  const logUserAction = async (actionType, actionData = {}) => {
    try {
      if (!user || !isAuthenticated) {
        console.warn('Cannot log action: User not authenticated');
        return false;
      }

      const actionRecord = {
        user_id: user.email || user.username || user.id || 'anonymous',
        action_type: actionType,
        action_data: {
          ...actionData,
          user_type: user.userType,
          theme: user.theme,
          timestamp: new Date().toISOString()
        },
        session_id: sessionId,
        user_agent: navigator.userAgent
      };

      // Mock logging - in production this would send to Supabase
      console.log('Mock: User action logged:', actionRecord);
      return true;
    } catch (error) {
      console.error('Mock: Error logging user action:', error);
      return false;
    }
  };

  const login = async (userData) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      setIsFirstTime(false);
      localStorage.setItem('ovi-user', JSON.stringify(userData));
      localStorage.setItem('ovi-user-setup', 'true');
      
      // Log the login action
      await logUserAction('login', {
        login_method: userData.isReturningUser ? 'sign_in' : 'registration',
        user_type: userData.userType,
        theme_selected: userData.theme,
        registration_step: userData.isReturningUser ? null : 'completed'
      });
      
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Log the logout action before clearing user data
      if (user && isAuthenticated) {
        await logUserAction('logout', {
          session_duration: sessionId ? `session_${sessionId}` : 'unknown',
          logout_method: 'manual'
        });
      }
      
      setUser(null);
      setIsAuthenticated(false);
      setIsFirstTime(true);
      localStorage.removeItem('ovi-user');
      localStorage.removeItem('ovi-user-setup');
      
      // Generate new session ID for next session
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      // Still perform logout even if logging fails
      setUser(null);
      setIsAuthenticated(false);
      setIsFirstTime(true);
      localStorage.removeItem('ovi-user');
      localStorage.removeItem('ovi-user-setup');
      return false;
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      setUser(newUserData);
      localStorage.setItem('ovi-user', JSON.stringify(newUserData));
      
      // If profile photo was updated, dispatch event to sync across components
      if (updatedUserData.profilePhoto) {
        window.dispatchEvent(new CustomEvent('profilePhotoUpdated', {
          detail: {
            profilePhoto: updatedUserData.profilePhoto,
            userId: newUserData.id || newUserData.email,
            username: newUserData.username,
            userType: newUserData.userType
          }
        }));
      }
      
      // Log the profile update action
      await logUserAction('profile_updated', {
        updated_fields: Object.keys(updatedUserData),
        previous_values: Object.keys(updatedUserData).reduce((acc, key) => {
          acc[key] = user[key];
          return acc;
        }, {}),
        new_values: updatedUserData
      });
      
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  // Log page navigation
  const logPageNavigation = async (fromPage, toPage) => {
    await logUserAction('page_navigation', {
      from_page: fromPage,
      to_page: toPage,
      navigation_time: new Date().toISOString()
    });
  };

  // Log interaction events
  const logInteraction = async (interactionType, targetData = {}) => {
    await logUserAction('user_interaction', {
      interaction_type: interactionType,
      target: targetData,
      interaction_time: new Date().toISOString()
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isFirstTime,
      sessionId,
      login,
      logout,
      updateUser,
      logUserAction,
      logPageNavigation,
      logInteraction
    }}>
      {children}
    </AuthContext.Provider>
  );
};
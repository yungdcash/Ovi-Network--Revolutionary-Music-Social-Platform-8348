import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

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
    const savedUser = localStorage.getItem('ovi-user');
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
  }, []);

  /**
   * Log user action to Supabase
   * @param {string} actionType - Type of action (e.g., 'login', 'logout', 'post_created', 'profile_updated')
   * @param {object} actionData - Additional data related to the action
   * @returns {Promise<boolean>} - Returns true if successful, false otherwise
   */
  const logUserAction = async (actionType, actionData = {}) => {
    try {
      // Don't log if user is not authenticated
      if (!user || !isAuthenticated) {
        console.warn('Cannot log action: User not authenticated');
        return false;
      }

      // Prepare the action record
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
        ip_address: null, // Will be handled by Supabase/server if needed
        user_agent: navigator.userAgent
      };

      // Insert the action into Supabase
      const { data, error } = await supabase
        .from('user_actions_7x9k2m1q8p')
        .insert([actionRecord])
        .select();

      if (error) {
        console.error('Error logging user action:', error);
        return false;
      }

      console.log('User action logged successfully:', data);
      return true;
    } catch (error) {
      console.error('Unexpected error logging user action:', error);
      return false;
    }
  };

  const login = async (userData) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('ovi-user', JSON.stringify(userData));

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
      localStorage.removeItem('ovi-user');

      // Generate new session ID for next session
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      // Still perform logout even if logging fails
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('ovi-user');
      return false;
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      setUser(newUserData);
      localStorage.setItem('ovi-user', JSON.stringify(newUserData));

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
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    // Listen for profile photo updates
    const handleProfilePhotoUpdate = (event) => {
      if (event.detail?.profilePhoto && profile) {
        setProfile(prev => ({
          ...prev,
          profile_photo: event.detail.profilePhoto
        }));
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    };
  }, [profile]);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles_ovi2024')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (userData) => {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || 'tempPassword123!',
        options: {
          data: {
            username: userData.username,
            full_name: userData.fullName
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        return;
      }

      if (authData.user) {
        // Create user profile
        const profileData = {
          user_id: authData.user.id,
          username: userData.username,
          full_name: userData.fullName,
          email: userData.email,
          user_type: userData.userType,
          bio: '',
          profile_photo: '',
          cover_photo: '',
          theme_preference: userData.theme || 'cosmic'
        };

        const { error: profileError } = await supabase
          .from('user_profiles_ovi2024')
          .insert([profileData]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        setUser(authData.user);
        await fetchUserProfile(authData.user.id);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      return { data };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateUser = async (updates) => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('user_profiles_ovi2024')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        console.error('Update error:', error);
        return;
      }

      setProfile(prev => ({ ...prev, ...updates }));

      // Dispatch profile photo update event if photo was updated
      if (updates.profile_photo) {
        window.dispatchEvent(new CustomEvent('profilePhotoUpdated', {
          detail: { profilePhoto: updates.profile_photo }
        }));
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const logUserAction = async (actionType, actionData) => {
    if (!user) return;

    try {
      await supabase
        .from('user_analytics_ovi2024')
        .insert([{
          user_id: user.id,
          action_type: actionType,
          action_data: actionData
        }]);
    } catch (error) {
      console.error('Error logging user action:', error);
    }
  };

  const value = {
    user,
    profile,
    loading,
    login,
    signIn,
    signOut,
    updateUser,
    logUserAction,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
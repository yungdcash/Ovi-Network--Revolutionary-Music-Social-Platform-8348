import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import { supabase } from '../../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiUser } = FiIcons;

const StoriesReel = () => {
  const { theme } = useTheme();
  const { user, profile } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories_ovi2024')
        .select(`
          *,
          user_profiles_ovi2024 (
            username,
            full_name,
            profile_photo
          )
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stories:', error);
        return;
      }

      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStory = () => {
    // In a real app, this would open a story creation modal
    console.log('Add story clicked');
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-smokey-700 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {/* Add Story */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddStory}
          className="flex-shrink-0 cursor-pointer"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-smokey-700 border-2 border-smokey-600 flex items-center justify-center overflow-hidden">
              {profile?.profile_photo ? (
                <img
                  src={profile.profile_photo}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <SafeIcon icon={FiUser} className="w-8 h-8 text-smokey-400" />
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center border-2 border-smokey-800`}>
              <SafeIcon icon={FiPlus} className="w-3 h-3 text-white" />
            </div>
          </div>
          <p className="text-xs text-smokey-300 text-center mt-2 w-16 truncate">Add Story</p>
        </motion.div>

        {/* Stories */}
        {stories.length === 0 ? (
          <div className="flex-shrink-0 flex items-center justify-center px-4">
            <p className="text-smokey-400 text-sm">No stories available</p>
          </div>
        ) : (
          stories.map((story) => (
            <motion.div
              key={story.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 cursor-pointer"
            >
              <div className="relative">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${theme.gradient} p-0.5`}>
                  <div className="w-full h-full rounded-full bg-smokey-800 flex items-center justify-center overflow-hidden">
                    {story.user_profiles_ovi2024?.profile_photo ? (
                      <img
                        src={story.user_profiles_ovi2024.profile_photo}
                        alt={story.user_profiles_ovi2024.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <SafeIcon icon={FiUser} className="w-8 h-8 text-smokey-400" />
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-smokey-300 text-center mt-2 w-16 truncate">
                {story.user_profiles_ovi2024?.username || 'User'}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default StoriesReel;
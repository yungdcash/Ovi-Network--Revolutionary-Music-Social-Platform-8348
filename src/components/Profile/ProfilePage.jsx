import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMusic, FiUsers, FiDollarSign, FiSettings, FiEdit3, FiPlay, FiHeart } = FiIcons;

const ProfilePage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tracks');

  const stats = [
    { label: 'Followers', value: '12.5K', icon: FiUsers },
    { label: 'Total Streams', value: '2.8M', icon: FiPlay },
    { label: 'Tracks', value: '47', icon: FiMusic },
    { label: 'Earnings', value: '$8,429', icon: FiDollarSign }
  ];

  const tracks = [
    {
      id: 1,
      title: 'Midnight Dreams',
      plays: '1.2M',
      likes: '45K',
      earnings: '$1,245',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop'
    },
    {
      id: 2,
      title: 'Electric Nights',
      plays: '890K',
      likes: '32K',
      earnings: '$892',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop'
    },
    {
      id: 3,
      title: 'Ocean Waves',
      plays: '654K',
      likes: '28K',
      earnings: '$654',
      thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150&h=150&fit=crop'
    }
  ];

  return (
    <div className="flex-1 p-4 max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8"
      >
        {/* Cover Photo */}
        <div className={`h-48 rounded-2xl bg-gradient-to-r ${theme.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white backdrop-blur-sm"
          >
            <SafeIcon icon={FiEdit3} className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Profile Info */}
        <div className="relative -mt-16 px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-smokey-900 overflow-hidden bg-smokey-800">
                <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                  <SafeIcon icon={FiUser} className="w-16 h-16 text-white" />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="absolute bottom-2 right-2 p-2 bg-smokey-900 rounded-full border-2 border-smokey-700"
              >
                <SafeIcon icon={FiEdit3} className="w-4 h-4 text-white" />
              </motion.button>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{user?.fullName || 'Your Name'}</h1>
              <p className="text-smokey-400 text-lg">@{user?.username || 'username'}</p>
              <p className="text-smokey-300 mt-2">
                🎵 {user?.userType === 'artist' ? 'Artist' : user?.userType === 'producer' ? 'Producer' : 'Music Fan'} | 
                Creating vibes since 2024 | Stream my latest tracks ✨
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full flex items-center space-x-2`}
            >
              <SafeIcon icon={FiSettings} className="w-5 h-5" />
              <span>Edit Profile</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700 text-center"
          >
            <SafeIcon icon={stat.icon} className={`w-6 h-6 text-${theme.primary} mx-auto mb-2`} />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-smokey-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex space-x-1 bg-smokey-800/50 rounded-xl p-1">
          {['tracks', 'playlists', 'followers', 'following'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab
                  ? `bg-gradient-to-r ${theme.gradient} text-white`
                  : 'text-smokey-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {activeTab === 'tracks' && (
          <div className="space-y-4">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700 flex items-center space-x-4"
              >
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{track.title}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-smokey-400">
                    <span>{track.plays} plays</span>
                    <span>{track.likes} likes</span>
                    <span className={`text-${theme.primary} font-bold`}>{track.earnings}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 bg-gradient-to-r ${theme.gradient} rounded-full text-white`}
                  >
                    <SafeIcon icon={FiPlay} className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-smokey-400 hover:text-red-400 transition-colors"
                  >
                    <SafeIcon icon={FiHeart} className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab !== 'tracks' && (
          <div className="text-center py-12">
            <div className="text-smokey-400 text-lg">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content coming soon...
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
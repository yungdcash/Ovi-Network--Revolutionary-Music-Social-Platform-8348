import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import FloatingElements from '../3D/FloatingElements';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiMusic, FiUsers, FiPlay, FiHeart, FiShare2, FiEye, FiArrowUp, FiDisc, FiHeadphones } = FiIcons;

const TrendingPage = () => {
  const { theme } = useTheme();
  const { user, logUserAction } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [timeframe, setTimeframe] = useState('24h');

  // Empty trending data initially
  const [trendingContent] = useState([]);

  useEffect(() => {
    // Log page view
    if (logUserAction) {
      logUserAction('page_view', {
        page: 'trending',
        user_type: user?.userType,
        filters: { active_filter: activeFilter, timeframe }
      });
    }
  }, [activeFilter, timeframe, logUserAction, user?.userType]);

  const filters = [
    { id: 'all', label: 'All', icon: FiTrendingUp },
    { id: 'music', label: 'Music', icon: FiMusic },
    { id: 'beats', label: 'Beats', icon: FiDisc },
    { id: 'artists', label: 'Artists', icon: FiUsers },
  ];

  const timeframes = [
    { id: '1h', label: 'Last Hour' },
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
  ];

  const handleFilterChange = async (filterId) => {
    setActiveFilter(filterId);
    
    if (logUserAction) {
      await logUserAction('trending_filter_changed', {
        previous_filter: activeFilter,
        new_filter: filterId,
        timeframe: timeframe,
        user_type: user?.userType
      });
    }
  };

  const handleTimeframeChange = async (timeframeId) => {
    setTimeframe(timeframeId);
    
    if (logUserAction) {
      await logUserAction('trending_timeframe_changed', {
        previous_timeframe: timeframe,
        new_timeframe: timeframeId,
        active_filter: activeFilter,
        user_type: user?.userType
      });
    }
  };

  return (
    <div className="flex-1 relative">
      <FloatingElements className="opacity-30" />
      
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Trending</h1>
          </div>
          <p className="text-smokey-400 text-lg">
            Discover what's hot in the Ovi Network community
          </p>
        </motion.div>

        {/* Filters and Timeframe */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          {/* Content Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange(filter.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeFilter === filter.id
                    ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
                    : 'bg-smokey-800/50 text-smokey-400 hover:text-white hover:bg-smokey-700'
                }`}
              >
                <SafeIcon icon={filter.icon} className="w-5 h-5" />
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-smokey-400 text-sm font-medium">Timeframe:</span>
            <select
              value={timeframe}
              onChange={(e) => handleTimeframeChange(e.target.value)}
              className={`px-4 py-2 bg-smokey-800 border border-smokey-700 rounded-lg text-white focus:outline-none focus:border-${theme.primary} transition-colors`}
            >
              {timeframes.map((tf) => (
                <option key={tf.id} value={tf.id}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Trending Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiEye} className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold">Total Views</h3>
                <p className="text-2xl font-bold text-blue-400">0</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiPlay} className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-white font-semibold">Plays</h3>
                <p className="text-2xl font-bold text-green-400">0</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiHeart} className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="text-white font-semibold">Likes</h3>
                <p className="text-2xl font-bold text-red-400">0</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUsers} className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-white font-semibold">Active Users</h3>
                <p className="text-2xl font-bold text-purple-400">0</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Empty State */}
        {trendingContent.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-smokey-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiTrendingUp} className="w-12 h-12 text-smokey-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No trending content yet</h3>
            <p className="text-smokey-400 mb-6 max-w-md mx-auto">
              {activeFilter === 'all' 
                ? 'Be the first to create content that trends in the community!'
                : user?.userType === 'artist'
                ? 'Upload your tracks and get them trending!'
                : user?.userType === 'producer'
                ? 'Share your beats and watch them climb the charts!'
                : 'Follow artists and producers to see trending content here!'
              }
            </p>
            
            {(user?.userType === 'artist' || user?.userType === 'producer') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-full font-medium`}
              >
                {user?.userType === 'artist' ? 'Upload Track' : 'Upload Beat'}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Trending Content Grid */}
        <div className="space-y-6">
          {trendingContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700 hover:border-smokey-600 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center text-white font-bold text-lg`}>
                    #{index + 1}
                  </div>

                  {/* Content Info */}
                  <div>
                    <h3 className="text-white font-semibold text-lg group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-smokey-400">
                      by {item.artist}
                    </p>
                  </div>
                </div>

                {/* Trending Indicator */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-green-400">
                    <SafeIcon icon={FiArrowUp} className="w-5 h-5" />
                    <span className="font-semibold">+{item.growth}%</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-smokey-400">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiPlay} className="w-4 h-4" />
                      <span className="text-sm">{item.plays}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiHeart} className="w-4 h-4" />
                      <span className="text-sm">{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {trendingContent.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center py-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-smokey-800/50 backdrop-blur-lg text-white rounded-2xl hover:bg-smokey-700 transition-colors border border-smokey-700"
            >
              Load More Trending
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage;
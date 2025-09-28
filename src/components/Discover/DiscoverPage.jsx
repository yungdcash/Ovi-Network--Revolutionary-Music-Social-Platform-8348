import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import FloatingElements from '../3D/FloatingElements';
import PostCard from '../Feed/PostCard';
import * as FiIcons from 'react-icons/fi';

const { FiHeadphones, FiSearch, FiFilter, FiTrendingUp, FiMusic, FiDisc, FiUsers, FiStar, FiPlay, FiHeart, FiUser, FiShoppingCart } = FiIcons;

const DiscoverPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Check user role for personalized content
  const isArtist = user?.userType === 'artist';
  const isProducer = user?.userType === 'producer';
  const isFan = user?.userType === 'fan';

  // Empty content initially
  const [discoverContent] = useState([]);

  // Empty creators data initially
  const [talentedCreators] = useState({
    artists: [],
    producers: []
  });

  // Get role-specific filters
  const getFilters = () => {
    const baseFilters = [
      { id: 'all', label: 'All Content', icon: FiHeadphones },
      { id: 'trending', label: 'Trending', icon: FiTrendingUp }
    ];

    if (isArtist) {
      return [
        ...baseFilters,
        { id: 'music', label: 'Music', icon: FiMusic },
        { id: 'beats', label: 'Beats to Buy', icon: FiDisc },
        { id: 'producers', label: 'Producers', icon: FiUsers }
      ];
    } else if (isProducer) {
      return [
        ...baseFilters,
        { id: 'beats', label: 'Beats', icon: FiDisc },
        { id: 'music', label: 'Music', icon: FiMusic },
        { id: 'artists', label: 'Artists', icon: FiUsers }
      ];
    } else {
      return [
        ...baseFilters,
        { id: 'music', label: 'Music', icon: FiMusic },
        { id: 'beats', label: 'Beats', icon: FiDisc },
        { id: 'artists', label: 'Artists', icon: FiUsers },
        { id: 'producers', label: 'Producers', icon: FiUsers }
      ];
    }
  };

  const filters = getFilters();

  // Get role-specific header content
  const getHeaderContent = () => {
    if (isArtist) {
      return {
        title: 'Discover Talent',
        description: 'Find amazing producers and beats for your next collaboration'
      };
    } else if (isProducer) {
      return {
        title: 'Discover Artists',
        description: 'Connect with talented artists and showcase your beats'
      };
    } else {
      return {
        title: 'Discover',
        description: 'Explore amazing music and beats from talented creators'
      };
    }
  };

  const headerContent = getHeaderContent();

  // Render talented creators section based on user role
  const renderTalentedCreators = () => {
    let creatorsToShow = [];
    let sectionTitle = '';

    if (isArtist) {
      creatorsToShow = talentedCreators.producers;
      sectionTitle = 'Trending Producers';
    } else if (isProducer) {
      creatorsToShow = talentedCreators.artists;
      sectionTitle = 'Trending Artists';
    } else {
      // Fans see both artists and producers
      creatorsToShow = [...talentedCreators.artists, ...talentedCreators.producers];
      sectionTitle = 'Trending Creators';
    }

    if (creatorsToShow.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-smokey-800/30 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiStar} className="w-6 h-6" />
            <span>{sectionTitle}</span>
          </h3>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-smokey-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiUsers} className="w-8 h-8 text-smokey-400" />
            </div>
            <h4 className="text-white text-lg font-semibold mb-2">No creators found</h4>
            <p className="text-smokey-400">Check back later for trending creators</p>
          </div>
        </motion.div>
      );
    }

    return null; // This won't render since creatorsToShow is empty
  };

  return (
    <div className="flex-1 relative">
      <FloatingElements className="opacity-30" />
      
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-3">{headerContent.title}</h1>
          <p className="text-smokey-400 text-lg">
            {headerContent.description}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6"
        >
          <div className="relative">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-smokey-400" 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArtist 
                  ? "Search for producers, beats, or collaborators..."
                  : isProducer 
                  ? "Search for artists, music, or opportunities..."
                  : "Search for artists, beats, or genres..."
              }
              className="w-full pl-12 pr-4 py-4 bg-smokey-800/50 backdrop-blur-lg border border-smokey-700 rounded-2xl text-white placeholder-smokey-400 focus:border-emerald-primary focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter.id)}
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
        </motion.div>

        {/* Genre Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {['Pop', 'Hip Hop', 'Trap', 'R&B', 'Electronic', 'Rock', 'Jazz', 'Country'].map((genre) => (
            <motion.button
              key={genre}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-smokey-700/50 text-smokey-300 rounded-full text-sm hover:bg-smokey-600 hover:text-white transition-all"
            >
              #{genre}
            </motion.button>
          ))}
        </motion.div>

        {/* Empty State */}
        {discoverContent.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-smokey-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiHeadphones} className="w-12 h-12 text-smokey-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Nothing to discover yet</h3>
            <p className="text-smokey-400 mb-6">
              {isArtist 
                ? "Follow producers and other artists to discover their latest content"
                : isProducer 
                ? "Follow artists and other producers to see what's trending"
                : "Follow artists and producers to see their content here"
              }
            </p>
          </motion.div>
        )}

        {/* Content Feed */}
        <div className="space-y-6">
          {discoverContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={item} />
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {discoverContent.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-smokey-800/50 backdrop-blur-lg text-white rounded-2xl hover:bg-smokey-700 transition-colors border border-smokey-700"
            >
              Load More Content
            </motion.button>
          </motion.div>
        )}

        {/* Role-specific talented creators section */}
        {renderTalentedCreators()}
      </div>
    </div>
  );
};

export default DiscoverPage;
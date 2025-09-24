import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import FloatingElements from '../3D/FloatingElements';
import PostCard from '../Feed/PostCard';
import * as FiIcons from 'react-icons/fi';

const { FiHeadphones, FiSearch, FiFilter, FiTrendingUp, FiMusic, FiDisc } = FiIcons;

const DiscoverPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock discovery content
  const [discoverContent] = useState([
    {
      id: 1,
      user: {
        name: 'The Weeknd',
        username: 'theweeknd',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'artist',
        verified: true
      },
      content: 'New track from my upcoming album. This one hits different 🔥',
      type: 'music',
      media: {
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
        duration: '3:20',
        genre: 'Pop'
      },
      likes: 2847,
      comments: 432,
      shares: 189,
      timestamp: '1 hour ago'
    },
    {
      id: 2,
      user: {
        name: 'Mike WiLL Made-It',
        username: 'mikewillmadeit',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'producer',
        verified: true
      },
      content: '🔥 EXCLUSIVE BEAT FOR SALE 🔥\n\nTrap beat with dark vibes. Perfect for your next hit!\n\n#BeatForSale #TrapBeats',
      type: 'beat_sale',
      media: {
        title: 'Dark Energy (Beat)',
        artist: 'Mike WiLL Made-It',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
        duration: '3:45',
        genre: 'Trap',
        bpm: 145,
        key: 'F minor'
      },
      beatInfo: {
        price: 59.99,
        leaseType: 'Premium Lease',
        usageRights: 'Commercial Use, Streaming, Radio',
        sold: false,
        exclusivePrice: 399.99,
        downloads: 34,
        previews: 267
      },
      likes: 1234,
      comments: 89,
      shares: 67,
      timestamp: '3 hours ago',
      tags: ['trap', 'dark', 'energy']
    }
  ]);

  const filters = [
    { id: 'all', label: 'All Content', icon: FiHeadphones },
    { id: 'music', label: 'Music', icon: FiMusic },
    { id: 'beats', label: 'Beats', icon: FiDisc },
    { id: 'trending', label: 'Trending', icon: FiTrendingUp }
  ];

  const filteredContent = discoverContent.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'music') return item.type === 'music';
    if (activeFilter === 'beats') return item.type === 'beat_sale' || item.type === 'beat_pack_sale';
    if (activeFilter === 'trending') return item.likes > 1000;
    return true;
  });

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
          <h1 className="text-4xl font-bold text-white mb-3">Discover</h1>
          <p className="text-smokey-400 text-lg">
            Explore amazing music and beats from talented creators
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
              placeholder="Search for artists, beats, or genres..."
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

        {/* Content Feed */}
        <div className="space-y-6">
          {filteredContent.map((item, index) => (
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

        {/* Fan-specific suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-smokey-800/30 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <SafeIcon icon={FiHeadphones} className="w-6 h-6" />
            <span>Recommended for You</span>
          </h3>
          <p className="text-smokey-400 mb-4">
            Based on your listening history and preferences, here are some artists and producers you might like:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Drake', 'Metro Boomin', 'Billie Eilish', 'DJ Khaled'].map((name, i) => (
              <motion.button
                key={name}
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-smokey-700 rounded-lg hover:bg-smokey-600 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mx-auto mb-2"></div>
                <p className="text-white font-medium text-sm">{name}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DiscoverPage;
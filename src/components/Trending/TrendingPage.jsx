import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiPlay, FiHeart, FiUser } = FiIcons;

const TrendingPage = () => {
  const { theme } = useTheme();
  const [trendingArtists, setTrendingArtists] = useState([]);
  const [trendingTracks, setTrendingTracks] = useState([]);

  useEffect(() => {
    // Simulate loading data
    setTrendingArtists([
      {
        id: 1,
        name: 'Travis Scott',
        followers: '2.1M',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        growth: '+15%'
      },
      {
        id: 2,
        name: 'Dua Lipa',
        followers: '1.8M',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
        growth: '+12%'
      },
      {
        id: 3,
        name: 'Drake',
        followers: '3.2M',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        growth: '+8%'
      },
      {
        id: 4,
        name: 'Billie Eilish',
        followers: '2.5M',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        growth: '+18%'
      }
    ]);

    setTrendingTracks([
      {
        id: 1,
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        plays: '45.2M',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
        earnings: '$12,450'
      },
      {
        id: 2,
        title: 'drivers license',
        artist: 'Olivia Rodrigo',
        plays: '38.7M',
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop',
        earnings: '$9,890'
      },
      {
        id: 3,
        title: 'Good 4 U',
        artist: 'Olivia Rodrigo',
        plays: '32.1M',
        thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150&h=150&fit=crop',
        earnings: '$8,234'
      }
    ]);
  }, []);

  return (
    <div className="flex-1 p-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <SafeIcon icon={FiTrendingUp} className={`w-8 h-8 text-${theme.primary}`} />
          <h1 className="text-3xl font-bold text-white">Trending</h1>
        </div>
        <p className="text-smokey-400">Discover what's hot on Ovi Network</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trending Artists */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Trending Artists</h2>
          <div className="space-y-3">
            {trendingArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700 flex items-center space-x-4"
              >
                <div className="relative">
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className={`absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{artist.name}</h3>
                  <p className="text-smokey-400 text-sm">{artist.followers} followers</p>
                </div>
                
                <div className="text-right">
                  <div className={`text-${theme.primary} font-bold text-sm`}>{artist.growth}</div>
                  <div className="text-smokey-400 text-xs">growth</div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 bg-gradient-to-r ${theme.gradient} rounded-full text-white`}
                >
                  <SafeIcon icon={FiUser} className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trending Tracks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Trending Tracks</h2>
          <div className="space-y-3">
            {trendingTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <SafeIcon icon={FiPlay} className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{track.title}</h3>
                    <p className="text-smokey-400 text-sm">{track.artist}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-smokey-400">
                      <span>{track.plays} plays</span>
                      <span className={`text-${theme.primary} font-bold`}>{track.earnings}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
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
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Real-time Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-6 bg-gradient-to-r from-smokey-800/50 to-smokey-700/50 backdrop-blur-lg rounded-2xl border border-smokey-600"
      >
        <h3 className="text-xl font-bold text-white mb-4">Real-time Network Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold text-${theme.primary}`}>2.8M</div>
            <div className="text-smokey-400 text-sm">Active Users</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-${theme.primary}`}>156K</div>
            <div className="text-smokey-400 text-sm">Songs Streaming</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-${theme.primary}`}>$847K</div>
            <div className="text-smokey-400 text-sm">Earned Today</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold text-${theme.primary}`}>89K</div>
            <div className="text-smokey-400 text-sm">New Connections</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrendingPage;
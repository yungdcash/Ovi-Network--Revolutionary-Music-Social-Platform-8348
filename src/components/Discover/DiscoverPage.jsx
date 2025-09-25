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

  // Mock discovery content with role-specific data
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
    },
    {
      id: 3,
      user: {
        name: 'Dua Lipa',
        username: 'dualipa',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
        role: 'artist',
        verified: true
      },
      content: 'Working on something special with an amazing producer. Can\'t wait to share! 🎵',
      type: 'music',
      media: {
        title: 'Future Nostalgia (Demo)',
        artist: 'Dua Lipa',
        thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop',
        duration: '2:58',
        genre: 'Pop'
      },
      likes: 3421,
      comments: 567,
      shares: 234,
      timestamp: '5 hours ago'
    },
    {
      id: 4,
      user: {
        name: 'Metro Boomin',
        username: 'metroboomin',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        role: 'producer',
        verified: true
      },
      content: 'Fresh beat pack dropped! 5 beats, all different vibes 🎹\n\n#BeatPack #MetroMade',
      type: 'beat_pack_sale',
      media: {
        title: 'Metro Pack Vol. 3',
        artist: 'Metro Boomin',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
        duration: '15:20',
        genre: 'Hip Hop'
      },
      beatInfo: {
        price: 149.99,
        leaseType: 'Beat Pack (5 Beats)',
        usageRights: 'Commercial Use, Unlimited Streams',
        sold: false,
        exclusivePrice: 799.99,
        downloads: 67,
        previews: 445
      },
      likes: 1567,
      comments: 123,
      shares: 89,
      timestamp: '8 hours ago',
      tags: ['hip-hop', 'trap', 'metro', 'pack']
    }
  ]);

  // Role-specific talented creators data
  const [talentedCreators] = useState({
    artists: [
      {
        id: 1,
        name: 'Olivia Rodrigo',
        username: 'oliviarodrigo',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        followers: '1.2M',
        genre: 'Pop',
        verified: true,
        recentTrack: 'drivers license',
        monthlyListeners: '45.2M'
      },
      {
        id: 2,
        name: 'Lil Nas X',
        username: 'lilnasx',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        followers: '2.8M',
        genre: 'Hip Hop',
        verified: true,
        recentTrack: 'MONTERO',
        monthlyListeners: '52.1M'
      },
      {
        id: 3,
        name: 'Billie Eilish',
        username: 'billieeilish',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        followers: '3.5M',
        genre: 'Alternative',
        verified: true,
        recentTrack: 'Happier Than Ever',
        monthlyListeners: '67.3M'
      }
    ],
    producers: [
      {
        id: 1,
        name: 'Southside',
        username: 'southside808',
        avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
        followers: '890K',
        genre: 'Trap',
        verified: true,
        beatsSold: '2.3K',
        topBeat: 'Dark Vibes'
      },
      {
        id: 2,
        name: 'Wheezy',
        username: 'wheezybeats',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        followers: '654K',
        genre: 'Hip Hop',
        verified: true,
        beatsSold: '1.8K',
        topBeat: 'Melodic Trap'
      },
      {
        id: 3,
        name: 'TM88',
        username: 'tm88',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        followers: '445K',
        genre: 'Trap',
        verified: true,
        beatsSold: '1.1K',
        topBeat: '808 Madness'
      }
    ]
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

  const filteredContent = discoverContent.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'music') return item.type === 'music';
    if (activeFilter === 'beats') return item.type === 'beat_sale' || item.type === 'beat_pack_sale';
    if (activeFilter === 'trending') return item.likes > 1000;
    if (activeFilter === 'artists') return item.user.role === 'artist';
    if (activeFilter === 'producers') return item.user.role === 'producer';
    return true;
  });

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
      creatorsToShow = [...talentedCreators.artists.slice(0, 2), ...talentedCreators.producers.slice(0, 2)];
      sectionTitle = 'Trending Creators';
    }

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
        <p className="text-smokey-400 mb-6">
          {isArtist 
            ? "Connect with top producers and find the perfect beats for your tracks"
            : isProducer 
            ? "Collaborate with rising artists and get your beats heard"
            : "Discover the most talented creators in the music industry"
          }
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {creatorsToShow.map((creator) => (
            <motion.div
              key={creator.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-smokey-700/50 rounded-xl hover:bg-smokey-600/50 transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {creator.verified && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiStar} className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <h4 className="text-white font-semibold text-sm mb-1">{creator.name}</h4>
                <p className="text-smokey-400 text-xs mb-2">@{creator.username}</p>
                <p className="text-smokey-300 text-xs mb-2">{creator.genre}</p>
                
                <div className="flex items-center justify-between w-full text-xs text-smokey-400 mb-3">
                  <span>{creator.followers} followers</span>
                  {creator.monthlyListeners && (
                    <span>{creator.monthlyListeners} monthly</span>
                  )}
                  {creator.beatsSold && (
                    <span>{creator.beatsSold} beats sold</span>
                  )}
                </div>
                
                <div className="flex space-x-2 w-full">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-2 px-3 bg-gradient-to-r ${theme.gradient} rounded-lg text-white text-xs font-medium`}
                  >
                    <SafeIcon icon={FiUser} className="w-3 h-3 mx-auto" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-2 px-3 bg-smokey-600 rounded-lg text-white text-xs font-medium hover:bg-smokey-500 transition-colors"
                  >
                    <SafeIcon icon={creator.monthlyListeners ? FiPlay : FiShoppingCart} className="w-3 h-3 mx-auto" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
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

        {/* Role-specific talented creators section */}
        {renderTalentedCreators()}
      </div>
    </div>
  );
};

export default DiscoverPage;
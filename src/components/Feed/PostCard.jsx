import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal, FiPlay, FiPause, 
  FiDollarSign, FiShoppingCart, FiDownload, FiEye, FiTag, FiMusic,
  FiStar, FiFlag, FiCopy, FiExternalLink, FiBookmark, FiTrendingUp
} = FiIcons;

const PostCard = ({ post }) => {
  const { theme } = useTheme();
  const { user, logUserAction } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBeatDetails, setShowBeatDetails] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Check if current user is an artist or producer (both should see earnings/dollar signs)
  const canViewEarnings = user?.userType === 'artist' || user?.userType === 'producer';

  const handleLike = async () => {
    const previousLikeState = isLiked;
    const newLikeState = !isLiked;
    
    setIsLiked(newLikeState);

    try {
      await logUserAction('like', {
        post_id: post.id,
        post_author: post.user.username,
        post_author_name: post.user.name,
        post_type: post.type,
        post_content_preview: post.content?.substring(0, 100) || '',
        media_title: post.media?.title || null,
        media_artist: post.media?.artist || null,
        action: newLikeState ? 'liked' : 'unliked',
        previous_like_count: post.likes,
        new_like_count: post.likes + (newLikeState ? 1 : 0),
        has_earnings: !!post.earnings,
        earnings_total: post.earnings?.total || null,
        timestamp: post.timestamp
      });
    } catch (error) {
      console.error('Error logging like action:', error);
    }
  };

  const handlePlay = async () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);

    try {
      await logUserAction('music_interaction', {
        post_id: post.id,
        action: newPlayState ? 'play' : 'pause',
        media_title: post.media?.title || 'Unknown',
        media_artist: post.media?.artist || 'Unknown',
        post_author: post.user.username,
        interaction_time: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging music interaction:', error);
    }
  };

  const handleBuyBeat = async () => {
    try {
      await logUserAction('beat_purchase_initiated', {
        beat_id: post.id,
        beat_title: post.media?.title,
        producer: post.user.username,
        price: post.beatInfo?.price,
        lease_type: post.beatInfo?.leaseType
      });
      
      // Simulate purchase flow
      alert(`Redirecting to purchase ${post.media?.title} for $${post.beatInfo?.price}`);
    } catch (error) {
      console.error('Error logging beat purchase:', error);
    }
  };

  const handleDropdownAction = async (action) => {
    setShowDropdown(false);
    
    try {
      await logUserAction('post_action', {
        action_type: action,
        post_id: post.id,
        post_author: post.user.username
      });

      switch (action) {
        case 'bookmark':
          setIsBookmarked(!isBookmarked);
          break;
        case 'copy_link':
          navigator.clipboard.writeText(`https://ovi-network.com/post/${post.id}`);
          alert('Link copied to clipboard!');
          break;
        case 'report':
          alert('Post reported. Thank you for keeping our community safe.');
          break;
        case 'share_external':
          alert('Opening share options...');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling dropdown action:', error);
    }
  };

  const DropdownMenu = () => (
    <AnimatePresence>
      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute right-0 top-full mt-2 w-48 bg-smokey-800 border border-smokey-700 rounded-lg shadow-xl z-20"
        >
          <div className="py-2">
            <button
              onClick={() => handleDropdownAction('bookmark')}
              className="w-full px-4 py-2 text-left text-white hover:bg-smokey-700 flex items-center space-x-3"
            >
              <SafeIcon icon={FiBookmark} className="w-4 h-4" />
              <span>{isBookmarked ? 'Remove Bookmark' : 'Bookmark'}</span>
            </button>
            
            <button
              onClick={() => handleDropdownAction('copy_link')}
              className="w-full px-4 py-2 text-left text-white hover:bg-smokey-700 flex items-center space-x-3"
            >
              <SafeIcon icon={FiCopy} className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
            
            <button
              onClick={() => handleDropdownAction('share_external')}
              className="w-full px-4 py-2 text-left text-white hover:bg-smokey-700 flex items-center space-x-3"
            >
              <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
              <span>Share Externally</span>
            </button>
            
            <hr className="my-2 border-smokey-700" />
            
            <button
              onClick={() => handleDropdownAction('report')}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-smokey-700 flex items-center space-x-3"
            >
              <SafeIcon icon={FiFlag} className="w-4 h-4" />
              <span>Report Post</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl border border-smokey-700 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={post.user.avatar}
              alt={post.user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-semibold">{post.user.name}</h3>
              {post.user.verified && (
                <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400" />
              )}
              <span className={`px-2 py-1 text-xs rounded-full ${
                post.user.role === 'producer' 
                  ? 'bg-purple-500/20 text-purple-300' 
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {post.user.role}
              </span>
            </div>
            <p className="text-smokey-400 text-sm">@{post.user.username}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Show earnings button for both artists and producers, but not for fans */}
          {post.earnings && canViewEarnings && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowEarnings(!showEarnings)}
              className={`p-2 rounded-full bg-gradient-to-r ${theme.gradient} text-white`}
            >
              <SafeIcon icon={FiDollarSign} className="w-4 h-4" />
            </motion.button>
          )}
          
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-smokey-400 hover:text-white transition-colors"
            >
              <SafeIcon icon={FiMoreHorizontal} className="w-5 h-5" />
            </motion.button>
            <DropdownMenu />
          </div>
        </div>
      </div>

      {/* Earnings Display - Only for artists and producers */}
      {showEarnings && post.earnings && canViewEarnings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-2"
        >
          <div className={`p-3 rounded-lg bg-gradient-to-r ${theme.gradient} bg-opacity-20 border border-${theme.primary} border-opacity-30`}>
            <div className="flex justify-between items-center text-sm">
              <span className="text-white">Real-time Earnings:</span>
              <span className={`text-${theme.primary} font-bold`}>${post.earnings.total}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-smokey-300">
              <div>Streams: ${post.earnings.streams}</div>
              <div>Tips: ${post.earnings.tips}</div>
              <div>Shares: ${post.earnings.shares}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-white mb-3 whitespace-pre-line">{post.content}</p>
        
        {/* Tags for beat posts */}
        {post.tags && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-smokey-700 text-smokey-300 rounded-full flex items-center space-x-1"
              >
                <SafeIcon icon={FiTag} className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}
        
        {/* Media Player */}
        <div className="relative">
          <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-smokey-700 to-smokey-800 flex items-center justify-center relative">
            <img
              src={post.media.thumbnail}
              alt={post.media.title}
              className="w-full h-full object-cover"
            />
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center shadow-2xl`}>
                <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-8 h-8 text-white ml-1" />
              </div>
            </motion.button>

            {/* Beat Sale Badge */}
            {(post.type === 'beat_sale' || post.type === 'beat_pack_sale') && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {post.type === 'beat_pack_sale' ? 'BEAT PACK' : 'FOR SALE'}
              </div>
            )}
          </div>
          
          <div className="mt-3 p-3 rounded-lg bg-smokey-700/50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-white font-semibold">{post.media.title}</h4>
                <p className="text-smokey-400 text-sm">{post.media.artist}</p>
                
                {/* Beat Details */}
                {post.beatInfo && (
                  <div className="mt-2 space-y-1 text-xs text-smokey-300">
                    <div className="flex items-center space-x-4">
                      <span>Duration: {post.media.duration}</span>
                      {post.media.bpm && <span>BPM: {post.media.bpm}</span>}
                      {post.media.key && <span>Key: {post.media.key}</span>}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <SafeIcon icon={FiEye} className="w-3 h-3" />
                        <span>{post.beatInfo.previews} previews</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <SafeIcon icon={FiDownload} className="w-3 h-3" />
                        <span>{post.beatInfo.downloads} downloads</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Beat Purchase Section - Show prices for all users but earnings only for artists and producers */}
              {post.beatInfo && (
                <div className="ml-4 text-right">
                  <div className="space-y-2">
                    {post.beatInfo.originalPrice && (
                      <div className="text-sm text-smokey-400 line-through">
                        ${post.beatInfo.originalPrice}
                      </div>
                    )}
                    <div className={`text-2xl font-bold text-${theme.primary}`}>
                      ${post.beatInfo.price}
                    </div>
                    <div className="text-xs text-smokey-400">
                      {post.beatInfo.leaseType}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBuyBeat}
                      className={`w-full px-4 py-2 bg-gradient-to-r ${theme.gradient} text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2`}
                    >
                      <SafeIcon icon={FiShoppingCart} className="w-4 h-4" />
                      <span>Buy Now</span>
                    </motion.button>
                    
                    <button
                      onClick={() => setShowBeatDetails(!showBeatDetails)}
                      className="w-full px-4 py-2 bg-smokey-600 text-white rounded-lg text-sm hover:bg-smokey-500 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Beat Details Expansion */}
            <AnimatePresence>
              {showBeatDetails && post.beatInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-smokey-600"
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="text-white font-medium mb-2">Usage Rights</h5>
                      <p className="text-smokey-300 text-xs">{post.beatInfo.usageRights}</p>
                    </div>
                    <div>
                      <h5 className="text-white font-medium mb-2">Exclusive Price</h5>
                      <p className={`text-${theme.primary} font-bold`}>${post.beatInfo.exclusivePrice}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Waveform Visualization */}
            <div className="mt-3 flex items-center space-x-1">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-gradient-to-t ${theme.gradient} rounded-full transition-all duration-300`}
                  style={{
                    height: `${Math.random() * 20 + 5}px`,
                    opacity: isPlaying ? Math.random() * 0.8 + 0.2 : 0.3
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-smokey-700 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className="flex items-center space-x-2 group"
          >
            <SafeIcon 
              icon={FiHeart} 
              className={`w-5 h-5 transition-colors ${
                isLiked ? `text-${theme.primary} fill-current` : 'text-smokey-400 group-hover:text-red-400'
              }`} 
            />
            <span className="text-smokey-400 text-sm">{post.likes + (isLiked ? 1 : 0)}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 text-smokey-400 hover:text-white transition-colors"
          >
            <SafeIcon icon={FiMessageCircle} className="w-5 h-5" />
            <span className="text-sm">{post.comments}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 text-smokey-400 hover:text-white transition-colors"
          >
            <SafeIcon icon={FiShare2} className="w-5 h-5" />
            <span className="text-sm">{post.shares}</span>
          </motion.button>

          {/* Trending Indicator for Popular Beats */}
          {post.beatInfo && post.beatInfo.previews > 100 && (
            <div className="flex items-center space-x-1 text-yellow-400">
              <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
              <span className="text-xs font-medium">Trending</span>
            </div>
          )}
        </div>
        
        <div className="text-smokey-400 text-sm">
          {post.timestamp}
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
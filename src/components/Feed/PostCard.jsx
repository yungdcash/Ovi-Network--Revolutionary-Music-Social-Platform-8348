import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiMessageCircle, FiShare2, FiMoreHorizontal, FiPlay, FiPause, FiDollarSign } = FiIcons;

const PostCard = ({ post }) => {
  const { theme } = useTheme();
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

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
            <h3 className="text-white font-semibold">{post.user.name}</h3>
            <p className="text-smokey-400 text-sm">@{post.user.username}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {post.earnings && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowEarnings(!showEarnings)}
              className={`p-2 rounded-full bg-gradient-to-r ${theme.gradient} text-white`}
            >
              <SafeIcon icon={FiDollarSign} className="w-4 h-4" />
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 text-smokey-400 hover:text-white transition-colors"
          >
            <SafeIcon icon={FiMoreHorizontal} className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Earnings Display */}
      {showEarnings && post.earnings && (
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
        <p className="text-white mb-3">{post.content}</p>
        
        {post.type === 'music' && (
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
                className={`absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center shadow-2xl`}>
                  <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-8 h-8 text-white ml-1" />
                </div>
              </motion.button>
            </div>
            
            <div className="mt-3 p-3 rounded-lg bg-smokey-700/50">
              <h4 className="text-white font-semibold">{post.media.title}</h4>
              <p className="text-smokey-400 text-sm">{post.media.artist}</p>
              
              {/* Waveform Visualization */}
              <div className="mt-2 flex items-center space-x-1">
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
        )}
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
        </div>
        
        <div className="text-smokey-400 text-sm">
          {post.timestamp}
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
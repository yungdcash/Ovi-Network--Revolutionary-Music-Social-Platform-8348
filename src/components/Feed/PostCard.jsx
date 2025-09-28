import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHeart, FiMessageCircle, FiShare2, FiPlay, FiPause, FiUser,
  FiMoreHorizontal, FiDownload, FiFlag, FiEye, FiMusic
} = FiIcons;

const PostCard = ({ post }) => {
  const { theme } = useTheme();
  const { user, logUserAction } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes || 0);
  const [showOptions, setShowOptions] = useState(false);

  const handlePlay = async () => {
    setIsPlaying(!isPlaying);
    
    if (logUserAction) {
      await logUserAction('audio_interaction', {
        action: isPlaying ? 'pause' : 'play',
        post_id: post?.id,
        post_type: post?.type,
        artist: post?.user?.username,
        track_title: post?.title
      });
    }
  };

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    if (logUserAction) {
      await logUserAction('post_interaction', {
        action: newLikedState ? 'like' : 'unlike',
        post_id: post?.id,
        post_type: post?.type,
        post_owner: post?.user?.username,
        interaction_timestamp: new Date().toISOString()
      });
    }
  };

  const handleComment = async () => {
    if (logUserAction) {
      await logUserAction('post_interaction', {
        action: 'comment_open',
        post_id: post?.id,
        post_type: post?.type,
        post_owner: post?.user?.username
      });
    }
  };

  const handleShare = async () => {
    if (logUserAction) {
      await logUserAction('post_interaction', {
        action: 'share',
        post_id: post?.id,
        post_type: post?.type,
        post_owner: post?.user?.username
      });
    }
  };

  // If no post data provided, return placeholder
  if (!post) {
    return (
      <div className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-smokey-700 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-smokey-700 rounded w-32"></div>
              <div className="h-3 bg-smokey-700 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-smokey-700 rounded mb-4"></div>
          <div className="h-32 bg-smokey-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-smokey-700 hover:border-smokey-600 transition-all"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Profile Picture */}
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-smokey-600">
              {post.user?.profilePicture ? (
                <img 
                  src={post.user.profilePicture} 
                  alt={post.user?.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                  <SafeIcon icon={FiUser} className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div>
              <h3 className="font-semibold text-white">{post.user?.name || 'Unknown Artist'}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-smokey-400 text-sm">@{post.user?.username || 'unknown'}</span>
                {post.user?.userType && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    post.user.userType === 'artist' 
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : post.user.userType === 'producer'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {post.user.userType}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-smokey-400 hover:text-white transition-colors rounded-full hover:bg-smokey-700"
            >
              <SafeIcon icon={FiMoreHorizontal} className="w-5 h-5" />
            </button>

            {showOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-2 bg-smokey-800 border border-smokey-700 rounded-lg shadow-xl z-10 w-48"
              >
                <button className="w-full px-4 py-2 text-left text-smokey-300 hover:text-white hover:bg-smokey-700 transition-colors flex items-center space-x-2">
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-smokey-300 hover:text-white hover:bg-smokey-700 transition-colors flex items-center space-x-2">
                  <SafeIcon icon={FiFlag} className="w-4 h-4" />
                  <span>Report</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-white mb-2">
            {post.title || 'Untitled Track'}
          </h4>
          {post.description && (
            <p className="text-smokey-300 text-sm mb-4">{post.description}</p>
          )}
        </div>
      </div>

      {/* Audio Player / Media */}
      <div className="px-6 pb-4">
        <div className={`bg-gradient-to-r ${theme.gradient} rounded-xl p-4 flex items-center justify-between`}>
          <div className="flex items-center space-x-4">
            {/* Play Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-6 h-6" />
            </motion.button>

            {/* Track Info */}
            <div>
              <h5 className="text-white font-medium">{post.title || 'Untitled'}</h5>
              <div className="flex items-center space-x-4 text-white/80 text-sm">
                {post.duration && <span>{post.duration}</span>}
                {post.genre && <span>{post.genre}</span>}
              </div>
            </div>
          </div>

          {/* Waveform Visualization */}
          <div className="flex items-center space-x-1">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-white/60 rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{ 
                  height: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="px-6 py-4 border-t border-smokey-700">
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center space-x-6 text-smokey-400 text-sm">
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiEye} className="w-4 h-4" />
              <span>{post.views || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiHeart} className="w-4 h-4" />
              <span>{likesCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiMessageCircle} className="w-4 h-4" />
              <span>{post.comments || 0}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                isLiked 
                  ? 'text-red-500 bg-red-500/20' 
                  : 'text-smokey-400 hover:text-red-500 hover:bg-red-500/20'
              }`}
            >
              <SafeIcon icon={FiHeart} className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleComment}
              className="p-2 rounded-full text-smokey-400 hover:text-blue-500 hover:bg-blue-500/20 transition-colors"
            >
              <SafeIcon icon={FiMessageCircle} className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 rounded-full text-smokey-400 hover:text-green-500 hover:bg-green-500/20 transition-colors"
            >
              <SafeIcon icon={FiShare2} className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import PostCard from './PostCard';
import StoriesReel from './StoriesReel';
import FloatingElements from '../3D/FloatingElements';
import { supabase } from '../../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiMusic, FiImage, FiVideo, FiX, FiUpload } = FiIcons;

const FeedPage = () => {
  const { theme } = useTheme();
  const { user, profile, logUserAction } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
    
    // Set up real-time subscription for new posts
    const subscription = supabase
      .channel('posts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'posts_ovi2024'
      }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts_ovi2024')
        .select(`
          *,
          user_profiles_ovi2024 (
            username,
            full_name,
            profile_photo,
            user_type,
            verified
          ),
          music_tracks_ovi2024 (
            id,
            title,
            file_url,
            cover_image
          ),
          beats_ovi2024 (
            id,
            title,
            file_url,
            cover_image
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && !selectedMedia) return;

    setIsPosting(true);

    try {
      const postData = {
        user_id: user.id,
        content: postContent.trim(),
        media_url: selectedMedia ? `https://example.com/media/${Date.now()}` : null,
        media_type: mediaType
      };

      const { error } = await supabase
        .from('posts_ovi2024')
        .insert([postData]);

      if (error) {
        console.error('Error creating post:', error);
        return;
      }

      // Log post creation
      await logUserAction('post_created', {
        post_content: postContent,
        has_media: !!selectedMedia,
        media_type: mediaType,
        user_type: profile?.user_type,
        post_timestamp: new Date().toISOString()
      });

      // Reset form
      setPostContent('');
      setSelectedMedia(null);
      setMediaType(null);
      setShowCreatePost(false);
      
      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type.split('/')[0];
    if (['image', 'video', 'audio'].includes(fileType)) {
      setSelectedMedia(file);
      setMediaType(fileType);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.primary} mx-auto mb-4`}></div>
          <p className="text-smokey-300">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800 relative">
      <FloatingElements />
      
      <div className="relative z-10 max-w-2xl mx-auto p-4 md:p-6">
        {/* Stories Reel */}
        <StoriesReel />

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-smokey-800/50 backdrop-blur-sm rounded-2xl p-6 border border-smokey-700 mb-6"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
              {profile?.profile_photo ? (
                <img
                  src={profile.profile_photo}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold">
                  {profile?.full_name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreatePost(true)}
              className="flex-1 px-4 py-3 bg-smokey-700 hover:bg-smokey-600 text-smokey-300 text-left rounded-full transition-colors"
            >
              What's on your mind, {profile?.full_name?.split(' ')[0]}?
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCreatePost(true)}
              className={`p-3 rounded-full bg-gradient-to-r ${theme.gradient} text-white shadow-lg`}
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className={`inline-block p-6 rounded-full bg-gradient-to-r ${theme.gradient} mb-6`}>
                <SafeIcon icon={FiMusic} className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No posts yet</h3>
              <p className="text-smokey-400 mb-8 max-w-md mx-auto">
                Be the first to share something with the community. Create your first post to get started.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreatePost(true)}
                className={`px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                Create Your First Post
              </motion.button>
            </motion.div>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-smokey-800 rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Create Post</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 rounded-full hover:bg-smokey-700 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6 text-smokey-400" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                    {profile?.profile_photo ? (
                      <img
                        src={profile.profile_photo}
                        alt={profile.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {profile?.full_name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{profile?.full_name}</p>
                    <p className="text-smokey-400 text-sm">@{profile?.username}</p>
                  </div>
                </div>

                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's happening in your music world?"
                  rows={4}
                  className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 resize-none"
                />

                {selectedMedia && (
                  <div className="relative">
                    <div className="p-4 bg-smokey-700 rounded-lg border border-smokey-600">
                      <div className="flex items-center space-x-3">
                        <SafeIcon 
                          icon={mediaType === 'image' ? FiImage : mediaType === 'video' ? FiVideo : FiMusic} 
                          className="w-8 h-8 text-purple-400" 
                        />
                        <div>
                          <p className="text-white font-medium">{selectedMedia.name}</p>
                          <p className="text-smokey-400 text-sm">{mediaType} file</p>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setSelectedMedia(null);
                        setMediaType(null);
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                    >
                      <SafeIcon icon={FiX} className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-smokey-700">
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      accept="image/*,video/*,audio/*"
                      onChange={handleMediaSelect}
                      className="hidden"
                      id="media-upload"
                    />
                    <motion.label
                      htmlFor="media-upload"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-smokey-700 transition-colors cursor-pointer"
                    >
                      <SafeIcon icon={FiImage} className="w-5 h-5 text-smokey-400" />
                    </motion.label>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-smokey-700 transition-colors"
                    >
                      <SafeIcon icon={FiMusic} className="w-5 h-5 text-smokey-400" />
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreatePost}
                    disabled={(!postContent.trim() && !selectedMedia) || isPosting}
                    className={`px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full ${
                      (!postContent.trim() && !selectedMedia) || isPosting ? 'opacity-50 cursor-not-allowed' : ''
                    } flex items-center space-x-2`}
                  >
                    <SafeIcon icon={isPosting ? FiUpload : FiPlus} className={`w-5 h-5 ${isPosting ? 'animate-pulse' : ''}`} />
                    <span>{isPosting ? 'Posting...' : 'Post'}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedPage;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import FloatingElements from '../3D/FloatingElements';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading posts
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          user: {
            name: 'Olivia Rodrigo',
            username: 'oliviarodrigo',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face'
          },
          content: 'Just dropped my latest track! This one\'s been in the works for months and I can\'t wait for you all to hear it. The emotions in this song run deep 🎵',
          type: 'music',
          media: {
            title: 'drivers license',
            artist: 'Olivia Rodrigo',
            thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop'
          },
          likes: 386,
          comments: 133,
          shares: 64,
          timestamp: '2 hours ago',
          earnings: {
            total: 1247.50,
            streams: 890.30,
            tips: 245.20,
            shares: 112.00
          }
        },
        {
          id: 2,
          user: {
            name: 'The Weeknd',
            username: 'theweeknd',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          },
          content: 'Working on something special in the studio tonight. The creative process never stops 🌙',
          type: 'music',
          media: {
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'
          },
          likes: 892,
          comments: 234,
          shares: 156,
          timestamp: '4 hours ago',
          earnings: {
            total: 2156.75,
            streams: 1670.50,
            tips: 386.25,
            shares: 100.00
          }
        },
        {
          id: 3,
          user: {
            name: 'Circles',
            username: 'circlesmusic',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
          },
          content: 'Collaboration is the heart of music. Excited to share this new project with @RestyvBloce 🎶',
          type: 'music',
          media: {
            title: 'Eternal Vibes',
            artist: 'Circles x RestyvBloce',
            thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop'
          },
          likes: 445,
          comments: 87,
          shares: 92,
          timestamp: '6 hours ago',
          earnings: {
            total: 567.25,
            streams: 412.75,
            tips: 154.50,
            shares: 0.00
          }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <FloatingElements className="opacity-30" />
      
      <div className="relative z-10 max-w-2xl mx-auto p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Your Feed</h1>
          <p className="text-smokey-400">Discover the latest from artists you follow</p>
        </motion.div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={post} />
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
            className="px-6 py-3 bg-smokey-800 text-white rounded-full hover:bg-smokey-700 transition-colors"
          >
            Load More Posts
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedPage;
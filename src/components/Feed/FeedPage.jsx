import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostCard from './PostCard';
import FloatingElements from '../3D/FloatingElements';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiMusic, FiHeadphones, FiUpload, FiMic, FiDisc } = FiIcons;

const FeedPage = () => {
  const { user, logUserAction } = useAuth();
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('');

  useEffect(() => {
    // Simulate loading posts with role-based content
    setTimeout(() => {
      const mockPosts = [
        // Artist posts
        {
          id: 1,
          user: {
            name: 'Olivia Rodrigo',
            username: 'oliviarodrigo',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=150&h=150&fit=crop&crop=face',
            role: 'artist',
            verified: true
          },
          content: 'Just dropped my latest track! This one\'s been in the works for months and I can\'t wait for you all to hear it. The emotions in this song run deep 🎵',
          type: 'music',
          media: {
            title: 'drivers license',
            artist: 'Olivia Rodrigo',
            thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
            duration: '4:02',
            genre: 'Pop'
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
        // Producer beat-selling post
        {
          id: 2,
          user: {
            name: 'Metro Boomin',
            username: 'metroboomin',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            role: 'producer',
            verified: true
          },
          content: '🔥 NEW BEAT AVAILABLE FOR PURCHASE 🔥\n\nTrap/Hip-Hop beat with dark melodies and hard-hitting drums. Perfect for your next hit! 💰\n\n#BeatForSale #TrapBeats #HipHop',
          type: 'beat_sale',
          media: {
            title: 'Dark Nights (Beat)',
            artist: 'Metro Boomin',
            thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
            duration: '3:15',
            genre: 'Trap',
            bpm: 140,
            key: 'A minor'
          },
          beatInfo: {
            price: 49.99,
            leaseType: 'Standard Lease',
            usageRights: 'Radio Play, Streaming, Performances',
            sold: false,
            exclusivePrice: 299.99,
            downloads: 23,
            previews: 156
          },
          likes: 234,
          comments: 67,
          shares: 45,
          timestamp: '4 hours ago',
          tags: ['trap', 'dark', 'melodic', 'hiphop']
        },
        // Another artist post
        {
          id: 3,
          user: {
            name: 'Billie Eilish',
            username: 'billieeilish',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            role: 'artist',
            verified: true
          },
          content: 'Working on something special in the studio tonight. The creative process never stops 🌙✨ Thank you to all my fans for the incredible support!',
          type: 'music',
          media: {
            title: 'bad guy (Demo)',
            artist: 'Billie Eilish',
            thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop',
            duration: '3:45',
            genre: 'Alternative'
          },
          likes: 892,
          comments: 234,
          shares: 156,
          timestamp: '6 hours ago',
          earnings: {
            total: 2156.75,
            streams: 1670.50,
            tips: 386.25,
            shares: 100.00
          }
        },
        // Producer collaboration post
        {
          id: 4,
          user: {
            name: 'DJ Snake',
            username: 'djsnake',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            role: 'producer',
            verified: true
          },
          content: '🎵 EXCLUSIVE BEAT PACK AVAILABLE! 🎵\n\n5 EDM/Electronic beats ready for your next project. Limited time offer - 30% off!\n\n🔥 Perfect for festivals and clubs\n💎 High-quality stems included',
          type: 'beat_pack_sale',
          media: {
            title: 'Festival Vibes Pack',
            artist: 'DJ Snake',
            thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
            duration: '15:30',
            genre: 'EDM'
          },
          beatInfo: {
            price: 89.99,
            originalPrice: 129.99,
            leaseType: 'Premium Pack',
            usageRights: 'Commercial Use, Streaming, Radio',
            sold: false,
            exclusivePrice: 499.99,
            downloads: 45,
            previews: 289,
            packSize: 5
          },
          likes: 445,
          comments: 87,
          shares: 92,
          timestamp: '8 hours ago',
          tags: ['edm', 'festival', 'electronic', 'pack']
        },
        // Additional posts for scrolling demonstration
        {
          id: 5,
          user: {
            name: 'The Weeknd',
            username: 'theweeknd',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            role: 'artist',
            verified: true
          },
          content: 'Late night studio sessions hit different. Working on something that\'s going to change everything 🌃✨',
          type: 'music',
          media: {
            title: 'Blinding Lights (Remix)',
            artist: 'The Weeknd',
            thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=400&fit=crop',
            duration: '4:15',
            genre: 'R&B'
          },
          likes: 1245,
          comments: 387,
          shares: 234,
          timestamp: '12 hours ago',
          earnings: {
            total: 3456.80,
            streams: 2890.30,
            tips: 456.50,
            shares: 110.00
          }
        },
        {
          id: 6,
          user: {
            name: 'Zaytoven',
            username: 'zaytoven',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
            role: 'producer',
            verified: true
          },
          content: '🎹 PIANO TRAP BEAT SPECIAL 🎹\n\nClassic Zaytoven style with modern twist. This one\'s for the real ones who appreciate the craft 💎\n\n#PianoTrap #ZaytovenBeats',
          type: 'beat_sale',
          media: {
            title: 'Piano Dreams (Beat)',
            artist: 'Zaytoven',
            thumbnail: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&h=400&fit=crop',
            duration: '3:45',
            genre: 'Trap',
            bpm: 145,
            key: 'C major'
          },
          beatInfo: {
            price: 75.99,
            leaseType: 'Premium Lease',
            usageRights: 'Commercial Use, Radio, Streaming',
            sold: false,
            exclusivePrice: 450.99,
            downloads: 67,
            previews: 234
          },
          likes: 567,
          comments: 123,
          shares: 89,
          timestamp: '1 day ago',
          tags: ['trap', 'piano', 'classic', 'zaytoven']
        }
      ];
      
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpload = (type) => {
    setUploadType(type);
    setShowUploadModal(true);
    logUserAction('upload_initiated', { upload_type: type, user_role: user?.userType });
  };

  const UploadModal = () => (
    <AnimatePresence>
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-smokey-800 rounded-2xl p-6 max-w-md w-full border border-smokey-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                <SafeIcon 
                  icon={uploadType === 'track' ? FiMusic : uploadType === 'beat' ? FiDisc : FiUpload} 
                  className="w-8 h-8 text-white" 
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Upload {uploadType === 'track' ? 'Track' : uploadType === 'beat' ? 'Beat' : 'Content'}
              </h3>
              <p className="text-smokey-400">
                {uploadType === 'track' 
                  ? 'Share your latest musical creation with fans'
                  : uploadType === 'beat'
                  ? 'List your beat for sale on the marketplace'
                  : 'Upload your content'
                }
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  {uploadType === 'track' ? 'Track Title' : 'Beat Title'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-emerald-primary focus:outline-none"
                  placeholder={`Enter ${uploadType} title...`}
                />
              </div>

              {uploadType === 'beat' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Price ($)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-emerald-primary focus:outline-none"
                        placeholder="49.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">BPM</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-emerald-primary focus:outline-none"
                        placeholder="140"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Key</label>
                    <select className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:border-emerald-primary focus:outline-none">
                      <option value="">Select Key</option>
                      <option value="C major">C major</option>
                      <option value="A minor">A minor</option>
                      <option value="G major">G major</option>
                      <option value="E minor">E minor</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-emerald-primary focus:outline-none resize-none"
                  placeholder="Describe your creation..."
                />
              </div>

              <div className="border-2 border-dashed border-smokey-600 rounded-lg p-6 text-center">
                <SafeIcon icon={FiUpload} className="w-8 h-8 text-smokey-400 mx-auto mb-2" />
                <p className="text-smokey-400 mb-2">Drop your audio file here or click to browse</p>
                <p className="text-xs text-smokey-500">Supports MP3, WAV, FLAC (Max 100MB)</p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-3 px-4 bg-smokey-700 text-white rounded-lg hover:bg-smokey-600 transition-colors"
              >
                Cancel
              </button>
              <button
                className={`flex-1 py-3 px-4 bg-gradient-to-r ${theme.gradient} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                Upload {uploadType === 'track' ? 'Track' : 'Beat'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-full">
      <FloatingElements className="opacity-30" />
      
      <div className="relative z-10 max-w-2xl mx-auto p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.userType === 'producer' ? 'Beat Marketplace' : 'Your Feed'}
          </h1>
          <p className="text-smokey-400">
            {user?.userType === 'producer' 
              ? 'Sell your beats to artists worldwide' 
              : 'Discover the latest from artists you follow'
            }
          </p>
        </motion.div>

        {/* Upload Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center space-x-4 mb-6"
        >
          {user?.userType === 'artist' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUpload('track')}
              className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-full font-medium shadow-lg`}
            >
              <SafeIcon icon={FiMusic} className="w-5 h-5" />
              <span>Upload Track</span>
            </motion.button>
          )}
          
          {user?.userType === 'producer' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUpload('beat')}
              className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-full font-medium shadow-lg`}
            >
              <SafeIcon icon={FiDisc} className="w-5 h-5" />
              <span>Sell Beat</span>
            </motion.button>
          )}
        </motion.div>

        {/* Posts Feed */}
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

        {/* Bottom padding for mobile navigation */}
        <div className="h-20 md:h-0" />
      </div>

      <UploadModal />
    </div>
  );
};

export default FeedPage;
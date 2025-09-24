import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import FloatingElements from '../3D/FloatingElements';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiMusic, FiUpload, FiX, FiPlay, FiPause, FiDownload, FiShare2, FiHeart, FiEye } = FiIcons;

const MusicPage = () => {
  const { theme } = useTheme();
  const { user, logUserAction } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Mock user's tracks
  const [userTracks] = useState([
    {
      id: 1,
      title: 'Midnight Dreams',
      duration: '3:45',
      genre: 'Pop',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      plays: 1247,
      likes: 89,
      shares: 23,
      earnings: 156.78,
      uploadDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Electric Vibes',
      duration: '4:12',
      genre: 'Electronic',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      plays: 892,
      likes: 67,
      shares: 34,
      earnings: 234.50,
      uploadDate: '2024-01-10'
    }
  ]);

  const handleUpload = async (formData) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowUploadModal(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      await logUserAction('track_upload', {
        track_title: formData.title,
        genre: formData.genre,
        description: formData.description
      });
    } catch (error) {
      console.error('Error logging upload:', error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log('File dropped:', e.dataTransfer.files[0]);
    }
  };

  const UploadModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      genre: '',
      description: '',
      file: null
    });

    return (
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
              className="bg-smokey-800 rounded-2xl p-6 max-w-lg w-full border border-smokey-700 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                    <SafeIcon icon={FiMusic} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Upload Track</h3>
                    <p className="text-smokey-400 text-sm">Share your music with the world</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-smokey-400 hover:text-white transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpload(formData);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Track Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-emerald-primary focus:outline-none"
                      placeholder="Enter track title..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Genre</label>
                      <select
                        value={formData.genre}
                        onChange={(e) => setFormData({...formData, genre: e.target.value})}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:border-emerald-primary focus:outline-none"
                      >
                        <option value="">Select Genre</option>
                        <option value="pop">Pop</option>
                        <option value="rock">Rock</option>
                        <option value="hip-hop">Hip Hop</option>
                        <option value="electronic">Electronic</option>
                        <option value="r&b">R&B</option>
                        <option value="country">Country</option>
                        <option value="indie">Indie</option>
                        <option value="jazz">Jazz</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Mood</label>
                      <select className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:border-emerald-primary focus:outline-none">
                        <option value="">Select Mood</option>
                        <option value="happy">Happy</option>
                        <option value="sad">Sad</option>
                        <option value="energetic">Energetic</option>
                        <option value="chill">Chill</option>
                        <option value="romantic">Romantic</option>
                        <option value="aggressive">Aggressive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Description</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-emerald-primary focus:outline-none resize-none"
                      placeholder="Tell your fans about this track..."
                    />
                  </div>

                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      dragActive 
                        ? 'border-emerald-primary bg-emerald-primary/10' 
                        : 'border-smokey-600 hover:border-smokey-500'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <SafeIcon icon={FiUpload} className="w-12 h-12 text-smokey-400 mx-auto mb-4" />
                    <p className="text-white mb-2 font-medium">Drop your audio file here</p>
                    <p className="text-smokey-400 text-sm mb-4">or click to browse</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          setFormData({...formData, file: e.target.files[0]});
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-smokey-700 text-white rounded-lg hover:bg-smokey-600 transition-colors"
                    >
                      Choose File
                    </button>
                    <p className="text-xs text-smokey-500 mt-2">
                      Supports MP3, WAV, FLAC (Max 100MB)
                    </p>
                    {formData.file && (
                      <p className="text-emerald-400 text-sm mt-2">
                        Selected: {formData.file.name}
                      </p>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">Uploading...</span>
                        <span className="text-emerald-400">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-smokey-700 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${theme.gradient} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 py-3 px-4 bg-smokey-700 text-white rounded-lg hover:bg-smokey-600 transition-colors"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.title || !formData.file || isUploading}
                    className={`flex-1 py-3 px-4 bg-gradient-to-r ${theme.gradient} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Track'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="flex-1 relative">
      <FloatingElements className="opacity-30" />
      
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-3">Your Music</h1>
          <p className="text-smokey-400 text-lg">
            Manage and share your musical creations
          </p>
        </motion.div>

        {/* Upload Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadModal(true)}
            className={`flex items-center space-x-3 px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white rounded-2xl font-medium shadow-xl`}
          >
            <SafeIcon icon={FiPlus} className="w-6 h-6" />
            <span className="text-lg">Upload New Track</span>
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3 mb-3">
              <SafeIcon icon={FiPlay} className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="text-white font-semibold">Total Plays</h3>
                <p className="text-2xl font-bold text-emerald-400">2,139</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3 mb-3">
              <SafeIcon icon={FiHeart} className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="text-white font-semibold">Total Likes</h3>
                <p className="text-2xl font-bold text-red-400">156</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3 mb-3">
              <SafeIcon icon={FiDownload} className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold">Earnings</h3>
                <p className="text-2xl font-bold text-blue-400">$391.28</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-smokey-700 hover:border-smokey-600 transition-all group"
            >
              <div className="aspect-square relative">
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center shadow-2xl`}
                  >
                    <SafeIcon icon={FiPlay} className="w-8 h-8 text-white ml-1" />
                  </motion.button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-1">{track.title}</h3>
                <p className="text-smokey-400 text-sm mb-3">{track.genre} • {track.duration}</p>

                <div className="flex justify-between items-center text-sm text-smokey-400 mb-3">
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                    <span>{track.plays}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiHeart} className="w-4 h-4" />
                    <span>{track.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiShare2} className="w-4 h-4" />
                    <span>{track.shares}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`text-${theme.primary} font-bold`}>
                    ${track.earnings}
                  </span>
                  <span className="text-smokey-500 text-xs">
                    {new Date(track.uploadDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <UploadModal />
    </div>
  );
};

export default MusicPage;
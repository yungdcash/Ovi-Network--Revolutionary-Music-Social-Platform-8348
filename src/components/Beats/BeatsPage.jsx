import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import FloatingElements from '../3D/FloatingElements';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiDisc, FiUpload, FiX, FiPlay, FiPause, FiDollarSign, FiShoppingCart, FiTrendingUp, FiEye, FiDownload } = FiIcons;

const BeatsPage = () => {
  const { theme } = useTheme();
  const { user, logUserAction } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Mock user's beats
  const [userBeats] = useState([
    {
      id: 1,
      title: 'Dark Trap Vibes',
      duration: '3:15',
      genre: 'Trap',
      bpm: 140,
      key: 'A minor',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      price: 49.99,
      exclusivePrice: 299.99,
      leaseType: 'Standard Lease',
      sold: false,
      previews: 234,
      downloads: 12,
      earnings: 599.88,
      uploadDate: '2024-01-15',
      tags: ['trap', 'dark', 'melodic']
    },
    {
      id: 2,
      title: 'Summer Pop Beat',
      duration: '3:45',
      genre: 'Pop',
      bpm: 120,
      key: 'C major',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      price: 39.99,
      exclusivePrice: 199.99,
      leaseType: 'Premium Lease',
      sold: false,
      previews: 456,
      downloads: 23,
      earnings: 919.77,
      uploadDate: '2024-01-12',
      tags: ['pop', 'upbeat', 'summer']
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
      await logUserAction('beat_upload', {
        beat_title: formData.title,
        genre: formData.genre,
        bpm: formData.bpm,
        key: formData.key,
        price: formData.price
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
      console.log('File dropped:', e.dataTransfer.files[0]);
    }
  };

  const UploadModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      genre: '',
      bpm: '',
      key: '',
      price: '',
      exclusivePrice: '',
      leaseType: 'Standard Lease',
      description: '',
      tags: '',
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
              className="bg-smokey-800 rounded-2xl p-6 max-w-2xl w-full border border-smokey-700 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                    <SafeIcon icon={FiDisc} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Sell Beat</h3>
                    <p className="text-smokey-400 text-sm">List your beat on the marketplace</p>
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
                      Beat Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-purple-primary focus:outline-none"
                      placeholder="Enter beat title..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Genre *</label>
                      <select
                        required
                        value={formData.genre}
                        onChange={(e) => setFormData({...formData, genre: e.target.value})}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:border-purple-primary focus:outline-none"
                      >
                        <option value="">Select Genre</option>
                        <option value="trap">Trap</option>
                        <option value="hip-hop">Hip Hop</option>
                        <option value="pop">Pop</option>
                        <option value="r&b">R&B</option>
                        <option value="drill">Drill</option>
                        <option value="electronic">Electronic</option>
                        <option value="afrobeat">Afrobeat</option>
                        <option value="reggaeton">Reggaeton</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">BPM *</label>
                      <input
                        type="number"
                        required
                        min="60"
                        max="200"
                        value={formData.bpm}
                        onChange={(e) => setFormData({...formData, bpm: e.target.value})}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-purple-primary focus:outline-none"
                        placeholder="140"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Key</label>
                      <select
                        value={formData.key}
                        onChange={(e) => setFormData({...formData, key: e.target.value})}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:border-purple-primary focus:outline-none"
                      >
                        <option value="">Select Key</option>
                        <option value="C major">C major</option>
                        <option value="C minor">C minor</option>
                        <option value="G major">G major</option>
                        <option value="G minor">G minor</option>
                        <option value="A major">A major</option>
                        <option value="A minor">A minor</option>
                        <option value="E major">E major</option>
                        <option value="E minor">E minor</option>
                        <option value="F major">F major</option>
                        <option value="F minor">F minor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Lease Type</label>
                      <select
                        value={formData.leaseType}
                        onChange={(e) => setFormData({...formData, leaseType: e.target.value})}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:border-purple-primary focus:outline-none"
                      >
                        <option value="Standard Lease">Standard Lease</option>
                        <option value="Premium Lease">Premium Lease</option>
                        <option value="Unlimited Lease">Unlimited Lease</option>
                        <option value="Exclusive Rights">Exclusive Rights</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Price ($) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-purple-primary focus:outline-none"
                        placeholder="49.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Exclusive Price ($)</label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={formData.exclusivePrice}
                        onChange={(e) => setFormData({...formData, exclusivePrice: e.target.value})}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-purple-primary focus:outline-none"
                        placeholder="299.99"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Tags</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-purple-primary focus:outline-none"
                      placeholder="trap, dark, melodic (separate with commas)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Description</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:border-purple-primary focus:outline-none resize-none"
                      placeholder="Describe your beat and what makes it special..."
                    />
                  </div>

                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      dragActive 
                        ? 'border-purple-primary bg-purple-primary/10' 
                        : 'border-smokey-600 hover:border-smokey-500'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <SafeIcon icon={FiUpload} className="w-12 h-12 text-smokey-400 mx-auto mb-4" />
                    <p className="text-white mb-2 font-medium">Drop your beat file here</p>
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
                      <p className="text-purple-400 text-sm mt-2">
                        Selected: {formData.file.name}
                      </p>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">Uploading beat...</span>
                        <span className="text-purple-400">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-smokey-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
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
                    disabled={!formData.title || !formData.genre || !formData.bpm || !formData.price || !formData.file || isUploading}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Uploading...' : 'List Beat'}
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
          <h1 className="text-4xl font-bold text-white mb-3">Beat Marketplace</h1>
          <p className="text-smokey-400 text-lg">
            Sell your beats to artists worldwide
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
            className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium shadow-xl"
          >
            <SafeIcon icon={FiPlus} className="w-6 h-6" />
            <span className="text-lg">Sell New Beat</span>
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3 mb-3">
              <SafeIcon icon={FiEye} className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold">Total Views</h3>
                <p className="text-2xl font-bold text-blue-400">690</p>
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
              <SafeIcon icon={FiDownload} className="w-8 h-8 text-green-400" />
              <div>
                <h3 className="text-white font-semibold">Downloads</h3>
                <p className="text-2xl font-bold text-green-400">35</p>
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
              <SafeIcon icon={FiShoppingCart} className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="text-white font-semibold">Sales</h3>
                <p className="text-2xl font-bold text-yellow-400">35</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3 mb-3">
              <SafeIcon icon={FiDollarSign} className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-white font-semibold">Total Earnings</h3>
                <p className="text-2xl font-bold text-purple-400">$1,519.65</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Beats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBeats.map((beat, index) => (
            <motion.div
              key={beat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-smokey-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-smokey-700 hover:border-smokey-600 transition-all group"
            >
              <div className="aspect-square relative">
                <img
                  src={beat.thumbnail}
                  alt={beat.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl"
                  >
                    <SafeIcon icon={FiPlay} className="w-8 h-8 text-white ml-1" />
                  </motion.button>
                </div>
                
                {/* For Sale Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  FOR SALE
                </div>
                
                {/* Trending Badge */}
                {beat.previews > 200 && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <SafeIcon icon={FiTrendingUp} className="w-3 h-3" />
                    <span>HOT</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold text-lg mb-1">{beat.title}</h3>
                <p className="text-smokey-400 text-sm mb-2">
                  {beat.genre} • {beat.bpm} BPM • {beat.key}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {beat.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-smokey-700 text-smokey-300 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-smokey-400 mb-3">
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                    <span>{beat.previews}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                    <span>{beat.downloads}</span>
                  </span>
                  <span className={`text-${beat.sold ? 'red' : 'green'}-400 font-medium`}>
                    {beat.sold ? 'SOLD' : 'AVAILABLE'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-purple-400 font-bold text-xl">
                      ${beat.price}
                    </div>
                    <div className="text-smokey-500 text-xs">
                      Exclusive: ${beat.exclusivePrice}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">
                      ${beat.earnings}
                    </div>
                    <div className="text-smokey-500 text-xs">
                      earned
                    </div>
                  </div>
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

export default BeatsPage;
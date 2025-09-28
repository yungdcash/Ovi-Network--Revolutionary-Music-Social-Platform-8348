import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import FloatingElements from '../3D/FloatingElements';
import { supabase } from '../../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiMusic, FiUpload, FiPlay, FiPause, FiHeart, FiDownload, FiShare2, FiX, FiCheck, FiDollarSign, FiShoppingCart, FiTrendingUp } = FiIcons;

const BeatsPage = () => {
  const { theme } = useTheme();
  const { user, profile, logUserAction } = useAuth();
  const [beats, setBeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    bpm: '',
    keySignature: '',
    genre: '',
    tags: '',
    price: '9.99',
    licenseType: 'basic',
    file: null,
    coverImage: null
  });

  useEffect(() => {
    if (user) {
      fetchBeats();
    }
  }, [user]);

  const fetchBeats = async () => {
    try {
      const { data, error } = await supabase
        .from('beats_ovi2024')
        .select(`
          *,
          user_profiles_ovi2024 (
            username,
            full_name,
            profile_photo
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching beats:', error);
        return;
      }

      setBeats(data || []);
    } catch (error) {
      console.error('Error fetching beats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
    logUserAction('beat_upload_modal_opened', {
      user_type: profile?.user_type,
      timestamp: new Date().toISOString()
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title || !uploadForm.price) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // In a real app, you would upload files to storage first
      const fileUrl = `https://example.com/beats/${Date.now()}.mp3`;
      const coverImageUrl = uploadForm.coverImage ? `https://example.com/covers/${Date.now()}.jpg` : null;

      const beatData = {
        user_id: user.id,
        title: uploadForm.title,
        description: uploadForm.description,
        file_url: fileUrl,
        cover_image: coverImageUrl,
        bpm: parseInt(uploadForm.bpm) || null,
        key_signature: uploadForm.keySignature,
        genre: uploadForm.genre,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        price: parseFloat(uploadForm.price),
        license_type: uploadForm.licenseType
      };

      const { error } = await supabase
        .from('beats_ovi2024')
        .insert([beatData]);

      if (error) {
        console.error('Error uploading beat:', error);
        return;
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Log upload action
      await logUserAction('beat_uploaded', {
        beat_title: uploadForm.title,
        beat_genre: uploadForm.genre,
        beat_price: uploadForm.price,
        beat_bpm: uploadForm.bpm,
        license_type: uploadForm.licenseType,
        user_type: profile?.user_type,
        upload_timestamp: new Date().toISOString()
      });

      setTimeout(() => {
        setShowUploadModal(false);
        setIsUploading(false);
        setUploadProgress(0);
        setUploadForm({
          title: '',
          description: '',
          bpm: '',
          keySignature: '',
          genre: '',
          tags: '',
          price: '9.99',
          licenseType: 'basic',
          file: null,
          coverImage: null
        });
        fetchBeats();
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handlePlay = (beatId) => {
    if (currentlyPlaying === beatId) {
      setCurrentlyPlaying(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setCurrentlyPlaying(beatId);
      logUserAction('beat_played', {
        beat_id: beatId,
        user_type: profile?.user_type
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.primary} mx-auto mb-4`}></div>
          <p className="text-smokey-300">Loading your beats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800 relative">
      <FloatingElements />
      
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Beat Marketplace</h1>
            <p className="text-smokey-300">Sell your beats and collaborate with artists</p>
          </div>
          
          {profile?.user_type === 'producer' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUploadClick}
              className={`mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2`}
            >
              <SafeIcon icon={FiUpload} className="w-5 h-5" />
              <span>Upload Beat</span>
            </motion.button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-smokey-800/50 backdrop-blur-sm rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full bg-gradient-to-r ${theme.gradient}`}>
                <SafeIcon icon={FiMusic} className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-smokey-300 text-sm">Total Beats</p>
                <p className="text-2xl font-bold text-white">{beats.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-smokey-800/50 backdrop-blur-sm rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full bg-gradient-to-r ${theme.gradient}`}>
                <SafeIcon icon={FiShoppingCart} className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-smokey-300 text-sm">Total Sales</p>
                <p className="text-2xl font-bold text-white">{beats.reduce((sum, beat) => sum + beat.purchases_count, 0)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-smokey-800/50 backdrop-blur-sm rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full bg-gradient-to-r ${theme.gradient}`}>
                <SafeIcon icon={FiPlay} className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-smokey-300 text-sm">Total Plays</p>
                <p className="text-2xl font-bold text-white">{beats.reduce((sum, beat) => sum + beat.plays_count, 0)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-smokey-800/50 backdrop-blur-sm rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full bg-gradient-to-r ${theme.gradient}`}>
                <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-smokey-300 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-white">${profile?.total_earnings?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Beats Grid */}
        {beats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className={`inline-block p-6 rounded-full bg-gradient-to-r ${theme.gradient} mb-6`}>
              <SafeIcon icon={FiMusic} className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {profile?.user_type === 'producer' ? 'No beats uploaded yet' : 'No beats available'}
            </h3>
            <p className="text-smokey-400 mb-8 max-w-md mx-auto">
              {profile?.user_type === 'producer' 
                ? 'Start monetizing your beats. Upload your first beat to get started.'
                : 'Browse beats from talented producers in the marketplace.'
              }
            </p>
            {profile?.user_type === 'producer' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadClick}
                className={`px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                Upload Your First Beat
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beats.map((beat, index) => (
              <motion.div
                key={beat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-smokey-800/50 backdrop-blur-sm rounded-2xl p-6 border border-smokey-700 hover:border-smokey-600 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white truncate">{beat.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-smokey-400 mt-1">
                      {beat.bpm && <span>{beat.bpm} BPM</span>}
                      {beat.key_signature && <span>• {beat.key_signature}</span>}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePlay(beat.id)}
                    className={`p-3 rounded-full bg-gradient-to-r ${theme.gradient} text-white shadow-lg`}
                  >
                    <SafeIcon icon={currentlyPlaying === beat.id ? FiPause : FiPlay} className="w-5 h-5" />
                  </motion.button>
                </div>

                {beat.description && (
                  <p className="text-smokey-300 text-sm mb-4 line-clamp-2">{beat.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-smokey-400 mb-4">
                  <span>{beat.genre}</span>
                  <span className="text-green-400 font-semibold">${beat.price}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-smokey-400">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiPlay} className="w-4 h-4" />
                      <span>{beat.plays_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiShoppingCart} className="w-4 h-4" />
                      <span>{beat.purchases_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiHeart} className="w-4 h-4" />
                      <span>{beat.likes_count}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-smokey-700 transition-colors"
                    >
                      <SafeIcon icon={FiHeart} className="w-4 h-4 text-smokey-400 hover:text-red-400" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full hover:bg-smokey-700 transition-colors"
                    >
                      <SafeIcon icon={FiShare2} className="w-4 h-4 text-smokey-400 hover:text-white" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
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
              className="bg-smokey-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Upload Beat</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 rounded-full hover:bg-smokey-700 transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6 text-smokey-400" />
                </motion.button>
              </div>

              {isUploading ? (
                <div className="text-center py-12">
                  <div className={`inline-block p-6 rounded-full bg-gradient-to-r ${theme.gradient} mb-6`}>
                    <SafeIcon icon={FiUpload} className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Uploading Beat...</h3>
                  <div className="w-full bg-smokey-700 rounded-full h-3 mb-4">
                    <div 
                      className={`h-3 bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-300`}
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-smokey-300">{Math.round(uploadProgress)}% complete</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Beat File</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-4 border-2 border-dashed border-smokey-600 rounded-lg text-smokey-300 hover:border-smokey-500 transition-colors"
                    >
                      {uploadForm.file ? uploadForm.file.name : 'Click to select beat file'}
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-smokey-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
                        placeholder="Enter beat title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-smokey-300 mb-2">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={uploadForm.price}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
                        placeholder="9.99"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-smokey-300 mb-2">BPM</label>
                      <input
                        type="number"
                        value={uploadForm.bpm}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, bpm: e.target.value }))}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
                        placeholder="120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-smokey-300 mb-2">Key</label>
                      <input
                        type="text"
                        value={uploadForm.keySignature}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, keySignature: e.target.value }))}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
                        placeholder="C Major"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-smokey-300 mb-2">Genre</label>
                      <input
                        type="text"
                        value={uploadForm.genre}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, genre: e.target.value }))}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
                        placeholder="Hip Hop"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Description</label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
                      placeholder="Describe your beat..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Tags</label>
                    <input
                      type="text"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
                      placeholder="trap, dark, melodic"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">License Type</label>
                    <select
                      value={uploadForm.licenseType}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, licenseType: e.target.value }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="basic">Basic License</option>
                      <option value="premium">Premium License</option>
                      <option value="exclusive">Exclusive License</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowUploadModal(false)}
                      className="px-6 py-3 bg-smokey-700 hover:bg-smokey-600 text-white font-semibold rounded-full transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUpload}
                      disabled={!uploadForm.file || !uploadForm.title || !uploadForm.price}
                      className={`px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full ${
                        !uploadForm.file || !uploadForm.title || !uploadForm.price ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Upload Beat
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} />
    </div>
  );
};

export default BeatsPage;
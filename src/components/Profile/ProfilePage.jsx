import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import { supabase } from '../../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiMusic, FiHeart, FiUsers, FiDollarSign, FiEdit, FiCamera, FiMapPin, FiLink, FiCalendar, FiTrendingUp, FiPlay, FiDownload } = FiIcons;

const ProfilePage = () => {
  const { theme } = useTheme();
  const { user, profile, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userTracks, setUserTracks] = useState([]);
  const [userBeats, setUserBeats] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalStreams: 0,
    totalLikes: 0,
    monthlyListeners: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: ''
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || ''
      });
      fetchUserContent();
      fetchFollowData();
      fetchAnalytics();
    }
  }, [profile]);

  const fetchUserContent = async () => {
    try {
      // Fetch user's tracks
      const { data: tracks } = await supabase
        .from('music_tracks_ovi2024')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch user's beats
      const { data: beats } = await supabase
        .from('beats_ovi2024')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setUserTracks(tracks || []);
      setUserBeats(beats || []);
    } catch (error) {
      console.error('Error fetching user content:', error);
    }
  };

  const fetchFollowData = async () => {
    try {
      // Fetch followers
      const { data: followersData } = await supabase
        .from('follows_ovi2024')
        .select(`
          follower_id,
          user_profiles_ovi2024!follows_ovi2024_follower_id_fkey (
            username,
            full_name,
            profile_photo
          )
        `)
        .eq('following_id', user.id);

      // Fetch following
      const { data: followingData } = await supabase
        .from('follows_ovi2024')
        .select(`
          following_id,
          user_profiles_ovi2024!follows_ovi2024_following_id_fkey (
            username,
            full_name,
            profile_photo
          )
        `)
        .eq('follower_id', user.id);

      setFollowers(followersData || []);
      setFollowing(followingData || []);
    } catch (error) {
      console.error('Error fetching follow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Calculate analytics from user's content
      const totalStreams = userTracks.reduce((sum, track) => sum + track.plays_count, 0) +
                          userBeats.reduce((sum, beat) => sum + beat.plays_count, 0);
      
      const totalLikes = userTracks.reduce((sum, track) => sum + track.likes_count, 0) +
                        userBeats.reduce((sum, beat) => sum + beat.likes_count, 0);

      setAnalytics({
        totalStreams,
        totalLikes,
        monthlyListeners: Math.floor(totalStreams * 0.7), // Estimate
        totalEarnings: profile?.total_earnings || 0
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // In a real app, you would upload to storage
    // For now, we'll use a placeholder URL
    const photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`;
    
    await updateUser({ profile_photo: photoUrl });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.primary} mx-auto mb-4`}></div>
          <p className="text-smokey-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800">
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-64 md:h-80 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative">
          <div className="absolute inset-0 bg-black/30" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <SafeIcon icon={FiCamera} className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Profile Info */}
        <div className="relative px-4 md:px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-20">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                {profile?.profile_photo ? (
                  <img
                    src={profile.profile_photo}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <SafeIcon icon={FiUser} className="w-16 h-16 md:w-20 md:h-20 text-white" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoUpload}
                className="hidden"
                id="profile-photo-upload"
              />
              <motion.label
                htmlFor="profile-photo-upload"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2 p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white cursor-pointer shadow-lg"
              >
                <SafeIcon icon={FiCamera} className="w-4 h-4" />
              </motion.label>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {profile?.full_name || 'User Name'}
                  </h1>
                  <p className="text-lg text-smokey-300 mb-2">@{profile?.username}</p>
                  <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-smokey-400">
                    {profile?.location && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>Joined {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className={`mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2`}
                >
                  <SafeIcon icon={FiEdit} className="w-5 h-5" />
                  <span>Edit Profile</span>
                </motion.button>
              </div>

              {/* Bio */}
              {profile?.bio && (
                <p className="text-smokey-300 mb-4 max-w-2xl">
                  {profile.bio}
                </p>
              )}

              {/* Website */}
              {profile?.website && (
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                  <SafeIcon icon={FiLink} className="w-4 h-4 text-smokey-400" />
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-${theme.primary} hover:underline`}
                  >
                    {profile.website}
                  </a>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start space-x-6 text-sm">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-white">{followers.length}</p>
                  <p className="text-smokey-400">Followers</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-white">{following.length}</p>
                  <p className="text-smokey-400">Following</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl font-bold text-white">{userTracks.length + userBeats.length}</p>
                  <p className="text-smokey-400">Uploads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="px-4 md:px-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-smokey-800/50 backdrop-blur-sm rounded-2xl p-6 border border-smokey-700"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-full bg-gradient-to-r ${theme.gradient}`}>
                <SafeIcon icon={FiPlay} className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-smokey-300 text-sm">Total Streams</p>
                <p className="text-2xl font-bold text-white">{analytics.totalStreams.toLocaleString()}</p>
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
                <SafeIcon icon={FiHeart} className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-smokey-300 text-sm">Total Likes</p>
                <p className="text-2xl font-bold text-white">{analytics.totalLikes.toLocaleString()}</p>
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
                <SafeIcon icon={FiUsers} className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-smokey-300 text-sm">Monthly Listeners</p>
                <p className="text-2xl font-bold text-white">{analytics.monthlyListeners.toLocaleString()}</p>
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
                <p className="text-smokey-300 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-white">${analytics.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-4 md:px-8">
        <div className="bg-smokey-800/50 backdrop-blur-sm rounded-2xl border border-smokey-700">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">My Content</h2>
            
            {userTracks.length === 0 && userBeats.length === 0 ? (
              <div className="text-center py-12">
                <div className={`inline-block p-6 rounded-full bg-gradient-to-r ${theme.gradient} mb-6`}>
                  <SafeIcon icon={FiMusic} className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">No content uploaded yet</h3>
                <p className="text-smokey-400 mb-8 max-w-md mx-auto">
                  Start sharing your music with the world. Upload tracks or beats to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Tracks */}
                {userTracks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Tracks ({userTracks.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userTracks.slice(0, 6).map((track) => (
                        <div key={track.id} className="bg-smokey-700/50 rounded-lg p-4 border border-smokey-600">
                          <h4 className="text-white font-medium mb-2">{track.title}</h4>
                          <div className="flex items-center justify-between text-sm text-smokey-400">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <SafeIcon icon={FiPlay} className="w-4 h-4" />
                                <span>{track.plays_count}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <SafeIcon icon={FiHeart} className="w-4 h-4" />
                                <span>{track.likes_count}</span>
                              </div>
                            </div>
                            {track.price > 0 && (
                              <span className="text-green-400">${track.price}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Beats */}
                {userBeats.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Beats ({userBeats.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userBeats.slice(0, 6).map((beat) => (
                        <div key={beat.id} className="bg-smokey-700/50 rounded-lg p-4 border border-smokey-600">
                          <h4 className="text-white font-medium mb-2">{beat.title}</h4>
                          <div className="flex items-center justify-between text-sm text-smokey-400 mb-2">
                            <div className="flex items-center space-x-2">
                              {beat.bpm && <span>{beat.bpm} BPM</span>}
                              {beat.key_signature && <span>• {beat.key_signature}</span>}
                            </div>
                            <span className="text-green-400">${beat.price}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-smokey-400">
                            <div className="flex items-center space-x-1">
                              <SafeIcon icon={FiPlay} className="w-4 h-4" />
                              <span>{beat.plays_count}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <SafeIcon icon={FiDownload} className="w-4 h-4" />
                              <span>{beat.purchases_count}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
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
              className="bg-smokey-800 rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-smokey-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-smokey-300 mb-2">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-smokey-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-smokey-300 mb-2">Website</label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-smokey-700 hover:bg-smokey-600 text-white font-semibold rounded-full transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveProfile}
                  className={`px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full`}
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
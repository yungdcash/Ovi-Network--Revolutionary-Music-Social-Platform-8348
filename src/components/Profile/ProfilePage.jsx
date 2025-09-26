import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiUser, FiMusic, FiUsers, FiDollarSign, FiSettings, FiEdit3, FiPlay, FiHeart,
  FiDisc, FiHeadphones, FiTrendingUp, FiDownload, FiShoppingCart, FiEye,
  FiPlayCircle, FiList, FiShare2, FiStar, FiClock, FiBarChart3, FiUserPlus,
  FiUserMinus, FiUserCheck, FiCheckCircle, FiMessageCircle, FiMoreHorizontal,
  FiCamera, FiImage, FiSave, FiX, FiUpload, FiCheck, FiLock, FiGlobe,
  FiBell, FiShield, FiCreditCard, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiLink, FiInstagram, FiTwitter, FiYoutube, FiSoundcloud, FiSpotify
} = FiIcons;

const ProfilePage = () => {
  const { theme } = useTheme();
  const { user, logUserAction, updateUser } = useAuth();
  
  // State management
  const [activeTab, setActiveTab] = useState('');
  const [realTimeData, setRealTimeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [followerUsers, setFollowerUsers] = useState([]);
  
  // Photo editing states
  const [showProfilePhotoEditor, setShowProfilePhotoEditor] = useState(false);
  const [showCoverPhotoEditor, setShowCoverPhotoEditor] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Profile settings states
  const [profileSettings, setProfileSettings] = useState({
    displayName: user?.fullName || '',
    username: user?.username || '',
    bio: '',
    location: '',
    website: '',
    birthDate: '',
    email: user?.email || '',
    phone: '',
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true,
      showOnlineStatus: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      followNotifications: true,
      messageNotifications: true,
      earningsNotifications: true
    },
    social: {
      instagram: '',
      twitter: '',
      youtube: '',
      soundcloud: '',
      spotify: ''
    },
    // Role-specific settings
    producer: {
      beatPricing: {
        basicLease: 29.99,
        premiumLease: 59.99,
        exclusiveRights: 299.99
      },
      genres: ['Hip Hop', 'Trap'],
      collaborationRate: 150,
      acceptCustomBeats: true,
      autoPublishBeats: true
    },
    artist: {
      bookingRate: 500,
      genres: ['Hip Hop', 'R&B'],
      availableForFeatures: true,
      acceptCollaborations: true,
      tourAvailability: false
    },
    fan: {
      favoriteGenres: ['Hip Hop', 'R&B', 'Pop'],
      autoFollowArtists: false,
      discoverWeekly: true
    }
  });

  // User role detection
  const userRole = useMemo(() => {
    return user?.userType?.toLowerCase() || user?.role?.toLowerCase() || 'fan';
  }, [user]);

  // Role-based tab configuration
  const roleBasedTabs = useMemo(() => {
    switch (userRole) {
      case 'producer':
        return ['beats', 'beats-sold', 'earnings', 'followers', 'following'];
      case 'artist':
        return ['tracks', 'playlists', 'earnings', 'followers', 'following'];
      case 'fan':
      default:
        return ['followers', 'following'];
    }
  }, [userRole]);

  // Set initial active tab based on role
  useEffect(() => {
    if (roleBasedTabs.length > 0 && !activeTab) {
      setActiveTab(roleBasedTabs[0]);
    }
  }, [roleBasedTabs, activeTab]);

  // Initialize profile settings from user data
  useEffect(() => {
    if (user) {
      setProfileSettings(prev => ({
        ...prev,
        displayName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || (
          userRole === 'artist' ? '🎤 Artist | Creating vibes since 2024' :
          userRole === 'producer' ? '🎛️ Producer | Beats that hit different' :
          '🎧 Music lover | Discovering new sounds'
        )
      }));
    }
  }, [user, userRole]);

  // Fixed photo upload handler
  const handlePhotoUpload = useCallback(async (file, type) => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    setUploading(true);
    
    try {
      // Create object URL for immediate preview
      const imageUrl = URL.createObjectURL(file);
      
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the appropriate photo state
      if (type === 'profile') {
        setProfilePhotoPreview(imageUrl);
        // In a real app, you would upload to your storage service here
        // const uploadedUrl = await uploadToStorage(file, 'profile-photos');
        
        if (updateUser) {
          await updateUser({ profilePhoto: imageUrl });
        }
      } else if (type === 'cover') {
        setCoverPhotoPreview(imageUrl);
        // In a real app, you would upload to your storage service here
        // const uploadedUrl = await uploadToStorage(file, 'cover-photos');
        
        if (updateUser) {
          await updateUser({ coverPhoto: imageUrl });
        }
      }

      // Log successful upload
      if (logUserAction) {
        await logUserAction('profile_photo_updated', {
          photo_type: type,
          user_role: userRole,
          file_size: file.size,
          file_type: file.type
        });
      }

      // Show success message
      const successMessage = `${type === 'profile' ? 'Profile' : 'Cover'} photo updated successfully!`;
      
      // Create a temporary success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg border border-green-500';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>✅ ${successMessage}</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);

    } catch (error) {
      console.error('Photo upload failed:', error);
      
      // Show error message
      const errorMessage = `Failed to upload ${type} photo. Please try again.`;
      
      // Create a temporary error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg border border-red-500';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>❌ ${errorMessage}</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    } finally {
      setUploading(false);
      setShowProfilePhotoEditor(false);
      setShowCoverPhotoEditor(false);
      
      // Clear file states
      setProfilePhotoFile(null);
      setCoverPhotoFile(null);
    }
  }, [updateUser, logUserAction, userRole]);

  // Handle profile settings save with messaging integration
  const handleSaveSettings = useCallback(async () => {
    setUploading(true);
    
    try {
      // Update user profile with new settings
      if (updateUser) {
        await updateUser({
          fullName: profileSettings.displayName,
          username: profileSettings.username,
          bio: profileSettings.bio,
          location: profileSettings.location,
          website: profileSettings.website,
          birthDate: profileSettings.birthDate,
          email: profileSettings.email,
          phone: profileSettings.phone,
          profileSettings: profileSettings
        });
      }

      // Save messaging preferences to localStorage for messaging system integration
      const messagingPreferences = {
        allowMessages: profileSettings.privacy.allowMessages,
        messageNotifications: profileSettings.notifications.messageNotifications,
        showOnlineStatus: profileSettings.privacy.showOnlineStatus,
        userId: user?.id,
        username: profileSettings.username,
        displayName: profileSettings.displayName
      };
      
      localStorage.setItem('messagingPreferences', JSON.stringify(messagingPreferences));

      // Dispatch custom event to notify messaging system of changes
      window.dispatchEvent(new CustomEvent('messagingPreferencesUpdated', {
        detail: messagingPreferences
      }));

      // Log action
      if (logUserAction) {
        await logUserAction('profile_settings_updated', {
          user_role: userRole,
          settings_updated: Object.keys(profileSettings),
          messaging_enabled: profileSettings.privacy.allowMessages
        });
      }

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg border border-green-500';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>✅ Profile settings saved successfully!</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);

      setShowProfileSettings(false);

    } catch (error) {
      console.error('Settings save failed:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg border border-red-500';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>❌ Failed to save settings. Please try again.</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    } finally {
      setUploading(false);
    }
  }, [profileSettings, updateUser, logUserAction, userRole, user?.id]);

  // Generate mock user profiles for followers/following
  const generateUserProfiles = useCallback(() => {
    const userTypes = ['artist', 'producer', 'fan'];
    const genres = ['Hip Hop', 'Trap', 'R&B', 'Pop', 'Electronic', 'Jazz', 'Rock', 'Country'];
    const avatarUrls = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1494790108755-2616b332c882?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces'
    ];
    
    const names = [
      'Alex Rivera', 'Sam Chen', 'Jordan Taylor', 'Casey Morgan', 'Riley Smith',
      'Avery Johnson', 'Quinn Davis', 'Sage Wilson', 'Phoenix Lee', 'River Brown'
    ];

    const usernames = [
      'beatmaker_alex', 'soundwave_sam', 'melody_jordan', 'rhythm_casey', 'vibe_riley',
      'tune_avery', 'bass_quinn', 'harmony_sage', 'echo_phoenix', 'groove_river'
    ];

    const generateUsers = (count, isFollowing = false) => {
      return Array.from({ length: count }, (_, index) => {
        const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
        const isVerified = Math.random() > 0.7;
        const followsYou = !isFollowing && Math.random() > 0.6;
        
        return {
          id: `user_${Date.now()}_${index}`,
          name: names[index % names.length],
          username: usernames[index % usernames.length],
          avatar: avatarUrls[index % avatarUrls.length],
          userType: userType,
          isVerified: isVerified,
          followsYou: followsYou,
          isFollowing: isFollowing,
          followers: Math.floor(Math.random() * 50000) + 1000,
          genre: genres[Math.floor(Math.random() * genres.length)],
          bio: userType === 'artist' 
            ? `🎤 ${genres[Math.floor(Math.random() * genres.length)]} Artist | Creating vibes since 2020`
            : userType === 'producer'
            ? `🎛️ ${genres[Math.floor(Math.random() * genres.length)]} Producer | Beats that hit different`
            : `🎧 Music lover | ${genres[Math.floor(Math.random() * genres.length)]} enthusiast`,
          lastActive: Date.now() - Math.floor(Math.random() * 86400000 * 7), // Within last week
          mutualFollowers: Math.floor(Math.random() * 20),
          totalTracks: userType !== 'fan' ? Math.floor(Math.random() * 100) + 5 : 0,
          totalStreams: userType !== 'fan' ? Math.floor(Math.random() * 1000000) + 10000 : 0,
          isOnline: Math.random() > 0.7,
          allowsMessages: Math.random() > 0.3 // Most users allow messages
        };
      });
    };

    return {
      followers: generateUsers(15, false),
      following: generateUsers(12, true)
    };
  }, []);

  // Mock real-time data generator
  const generateRealTimeData = useCallback(() => {
    const baseData = {
      producer: {
        beats: [
          {
            id: 1,
            title: 'Trap Fire 2024',
            genre: 'Trap',
            bpm: 140,
            key: 'C Minor',
            plays: 45670,
            downloads: 234,
            sales: 45,
            earnings: 1245.50,
            likes: 892,
            thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop',
            uploadDate: Date.now() - 86400000 * 3,
            isLive: true
          },
          {
            id: 2,
            title: 'Melodic Vibes',
            genre: 'Melodic Trap',
            bpm: 135,
            key: 'F# Major',
            plays: 23450,
            downloads: 156,
            sales: 28,
            earnings: 789.25,
            likes: 567,
            thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
            uploadDate: Date.now() - 86400000 * 7,
            isLive: true
          },
          {
            id: 3,
            title: 'Dark Phonk',
            genre: 'Phonk',
            bpm: 160,
            key: 'G Minor',
            plays: 67890,
            downloads: 345,
            sales: 67,
            earnings: 1890.75,
            likes: 1234,
            thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150&h=150&fit=crop',
            uploadDate: Date.now() - 86400000 * 1,
            isLive: true
          }
        ],
        beatsSold: [
          {
            id: 1,
            beatTitle: 'Trap Fire 2024',
            buyer: 'MC Flow',
            salePrice: 49.99,
            license: 'Exclusive',
            saleDate: Date.now() - 86400000 * 2,
            payoutStatus: 'completed'
          },
          {
            id: 2,
            beatTitle: 'Dark Phonk',
            buyer: 'Rapper X',
            salePrice: 29.99,
            license: 'Premium',
            saleDate: Date.now() - 86400000 * 5,
            payoutStatus: 'completed'
          }
        ],
        totalEarnings: 4567.89,
        monthlyEarnings: 1245.67,
        totalBeats: 24,
        totalSales: 156,
        followers: 8945,
        following: 234
      },
      artist: {
        tracks: [
          {
            id: 1,
            title: 'Midnight Dreams',
            album: 'Night Sessions',
            duration: '3:45',
            streams: 1245670,
            likes: 45892,
            earnings: 2456.78,
            thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop',
            releaseDate: Date.now() - 86400000 * 14,
            isLive: true
          },
          {
            id: 2,
            title: 'Electric Nights',
            album: 'Neon Dreams',
            duration: '4:12',
            streams: 890234,
            likes: 32156,
            earnings: 1789.45,
            thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
            releaseDate: Date.now() - 86400000 * 30,
            isLive: true
          }
        ],
        playlists: [
          {
            id: 1,
            title: 'My Latest Hits',
            trackCount: 12,
            totalStreams: 2456789,
            followers: 15678,
            thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=150&h=150&fit=crop',
            isPublic: true
          }
        ],
        totalEarnings: 15678.90,
        monthlyEarnings: 3456.78,
        totalStreams: 8934567,
        totalTracks: 34,
        followers: 125670,
        following: 567
      },
      fan: {
        followers: 1234,
        following: 5678,
        favoriteGenres: ['Hip Hop', 'R&B', 'Pop'],
        totalListeningTime: '2,456 hours'
      }
    };

    return baseData[userRole] || baseData.fan;
  }, [userRole]);

  // Initialize user profiles and real-time data
  useEffect(() => {
    const initializeData = () => {
      const profiles = generateUserProfiles();
      setFollowerUsers(profiles.followers);
      setFollowingUsers(profiles.following);
      setRealTimeData(generateRealTimeData());
      setLoading(false);
    };

    initializeData();

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const updated = { ...prev };
        
        // Update streams/plays with small random increments
        if (userRole === 'artist' && updated.tracks) {
          updated.tracks = updated.tracks.map(track => ({
            ...track,
            streams: track.streams + Math.floor(Math.random() * 50),
            likes: track.likes + Math.floor(Math.random() * 5),
            earnings: track.earnings + (Math.random() * 2)
          }));
          updated.totalStreams += Math.floor(Math.random() * 100);
          updated.totalEarnings += (Math.random() * 5);
          updated.monthlyEarnings += (Math.random() * 2);
        }
        
        if (userRole === 'producer' && updated.beats) {
          updated.beats = updated.beats.map(beat => ({
            ...beat,
            plays: beat.plays + Math.floor(Math.random() * 30),
            downloads: beat.downloads + Math.floor(Math.random() * 3),
            likes: beat.likes + Math.floor(Math.random() * 5),
            earnings: beat.earnings + (Math.random() * 1.5)
          }));
          updated.totalEarnings += (Math.random() * 3);
          updated.monthlyEarnings += (Math.random() * 1.5);
        }

        return updated;
      });

      // Update online status of users
      setFollowerUsers(prev => prev.map(user => ({
        ...user,
        isOnline: Math.random() > 0.8
      })));
      
      setFollowingUsers(prev => prev.map(user => ({
        ...user,
        isOnline: Math.random() > 0.8
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, [userRole, generateRealTimeData, generateUserProfiles]);

  // Handle follow/unfollow actions
  const handleFollowToggle = useCallback(async (targetUser, currentlyFollowing) => {
    const action = currentlyFollowing ? 'unfollow' : 'follow';
    
    try {
      if (logUserAction) {
        await logUserAction(`user_${action}`, {
          target_user_id: targetUser.id,
          target_username: targetUser.username,
          target_user_type: targetUser.userType,
          user_id: user?.id
        });
      }

      // Update the user's following status
      if (activeTab === 'following') {
        setFollowingUsers(prev => prev.map(u => 
          u.id === targetUser.id ? { ...u, isFollowing: !currentlyFollowing } : u
        ));
      } else {
        setFollowerUsers(prev => prev.map(u => 
          u.id === targetUser.id ? { ...u, followsYou: !u.followsYou } : u
        ));
      }

      // Show success feedback (you could replace this with a toast notification)
      console.log(`${action === 'follow' ? 'Followed' : 'Unfollowed'} ${targetUser.name}`);
      
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  }, [activeTab, logUserAction, user?.id]);

  // Handle message button click with messaging integration
  const handleMessageUser = useCallback(async (targetUser) => {
    try {
      // Check if current user allows messages
      if (!profileSettings.privacy.allowMessages) {
        alert('You have disabled direct messages in your privacy settings. Please enable them to send messages.');
        return;
      }

      // Check if target user allows messages
      if (!targetUser.allowsMessages) {
        alert(`${targetUser.name} has disabled direct messages.`);
        return;
      }

      // Log message initiation
      if (logUserAction) {
        await logUserAction('message_initiated_from_profile', {
          target_user_id: targetUser.id,
          target_username: targetUser.username,
          target_user_type: targetUser.userType,
          user_id: user?.id,
          source: 'profile_followers_following'
        });
      }

      // Create conversation data for messaging system
      const conversationData = {
        id: Date.now(),
        user: {
          name: targetUser.name,
          username: targetUser.username,
          avatar: targetUser.avatar,
          isOnline: targetUser.isOnline,
          userType: targetUser.userType,
          isVerified: targetUser.isVerified
        },
        lastMessage: 'Start a conversation...',
        timestamp: 'now',
        unreadCount: 0,
        isTyping: false,
        isPinned: false,
        musicContext: null
      };

      // Store conversation data for messaging system
      const existingConversations = JSON.parse(localStorage.getItem('messagingConversations') || '[]');
      const conversationExists = existingConversations.find(conv => 
        conv.user.username === targetUser.username
      );

      if (!conversationExists) {
        existingConversations.unshift(conversationData);
        localStorage.setItem('messagingConversations', JSON.stringify(existingConversations));
      }

      // Dispatch event to open messaging system
      window.dispatchEvent(new CustomEvent('openMessaging', {
        detail: {
          conversation: conversationData,
          openFullMessenger: true
        }
      }));

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg border border-blue-500';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>💬 Opening conversation with ${targetUser.name}...</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 2000);

    } catch (error) {
      console.error('Failed to initiate message:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg border border-red-500';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>❌ Failed to start conversation. Please try again.</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  }, [profileSettings.privacy.allowMessages, logUserAction, user?.id]);

  // Role-based stats configuration
  const getRoleBasedStats = useCallback(() => {
    if (!realTimeData) return [];

    switch (userRole) {
      case 'producer':
        return [
          { label: 'Total Beats', value: realTimeData.totalBeats || 0, icon: FiDisc, format: 'number' },
          { label: 'Total Sales', value: realTimeData.totalSales || 0, icon: FiShoppingCart, format: 'number' },
          { label: 'Monthly Earnings', value: realTimeData.monthlyEarnings || 0, icon: FiDollarSign, format: 'currency' },
          { label: 'Followers', value: realTimeData.followers || 0, icon: FiUsers, format: 'count' }
        ];
      case 'artist':
        return [
          { label: 'Total Tracks', value: realTimeData.totalTracks || 0, icon: FiMusic, format: 'number' },
          { label: 'Total Streams', value: realTimeData.totalStreams || 0, icon: FiPlay, format: 'count' },
          { label: 'Monthly Earnings', value: realTimeData.monthlyEarnings || 0, icon: FiDollarSign, format: 'currency' },
          { label: 'Followers', value: realTimeData.followers || 0, icon: FiUsers, format: 'count' }
        ];
      case 'fan':
      default:
        return [
          { label: 'Following', value: realTimeData.following || 0, icon: FiHeart, format: 'count' },
          { label: 'Followers', value: realTimeData.followers || 0, icon: FiUsers, format: 'count' }
        ];
    }
  }, [userRole, realTimeData]);

  // Format values based on type
  const formatValue = useCallback((value, format) => {
    if (typeof value !== 'number') return value;

    switch (format) {
      case 'currency':
        return `$${value.toFixed(2)}`;
      case 'count':
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toString();
      case 'number':
      default:
        return value.toString();
    }
  }, []);

  // Tab change handler with analytics
  const handleTabChange = useCallback(async (tab) => {
    setActiveTab(tab);
    
    if (logUserAction) {
      try {
        await logUserAction('profile_tab_viewed', {
          tab: tab,
          user_role: userRole,
          user_id: user?.id
        });
      } catch (error) {
        console.warn('Failed to log tab view:', error);
      }
    }
  }, [logUserAction, userRole, user?.id]);

  // Get tab display name
  const getTabDisplayName = useCallback((tab) => {
    const tabNames = {
      'beats': 'Beats',
      'beats-sold': 'Beats Sold',
      'tracks': 'Tracks',
      'playlists': 'Playlists',
      'earnings': 'Earnings',
      'followers': 'Followers',
      'following': 'Following'
    };
    return tabNames[tab] || tab;
  }, []);

  // Get time ago string
  const getTimeAgo = useCallback((timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }, []);

  // Render user profile card
  const renderUserCard = useCallback((userProfile, index) => {
    const isFollowing = activeTab === 'following' ? userProfile.isFollowing : false;
    const followsYou = userProfile.followsYou;

    return (
      <motion.div
        key={userProfile.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01 }}
        className="p-4 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700 hover:border-smokey-600 transition-all duration-300"
      >
        <div className="flex items-center space-x-4">
          {/* Avatar with online indicator */}
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-smokey-600"
            />
            {userProfile.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-smokey-800 rounded-full"></div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-white font-semibold truncate">{userProfile.name}</h3>
              {userProfile.isVerified && (
                <SafeIcon icon={FiCheckCircle} className="w-4 h-4 text-blue-400 flex-shrink-0" />
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                userProfile.userType === 'artist' ? 'bg-purple-500/20 text-purple-400' :
                userProfile.userType === 'producer' ? 'bg-orange-500/20 text-orange-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {userProfile.userType}
              </span>
            </div>
            
            <p className="text-smokey-400 text-sm mb-1">@{userProfile.username}</p>
            <p className="text-smokey-300 text-sm mb-2 line-clamp-2">{userProfile.bio}</p>
            
            {/* Stats */}
            <div className="flex items-center space-x-4 text-xs text-smokey-400">
              <span className="flex items-center space-x-1">
                <SafeIcon icon={FiUsers} className="w-3 h-3" />
                <span>{formatValue(userProfile.followers, 'count')} followers</span>
              </span>
              {userProfile.userType !== 'fan' && (
                <>
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={userProfile.userType === 'artist' ? FiMusic : FiDisc} className="w-3 h-3" />
                    <span>{userProfile.totalTracks} {userProfile.userType === 'artist' ? 'tracks' : 'beats'}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <SafeIcon icon={FiPlay} className="w-3 h-3" />
                    <span>{formatValue(userProfile.totalStreams, 'count')} {userProfile.userType === 'artist' ? 'streams' : 'plays'}</span>
                  </span>
                </>
              )}
              {userProfile.mutualFollowers > 0 && (
                <span className="text-emerald-400">
                  {userProfile.mutualFollowers} mutual
                </span>
              )}
            </div>

            {/* Last active */}
            <div className="text-xs text-smokey-500 mt-1">
              {userProfile.isOnline ? 'Online now' : `Active ${getTimeAgo(userProfile.lastActive)}`}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Follow Status Indicator */}
            {followsYou && activeTab === 'followers' && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                Follows you
              </span>
            )}

            {/* Message Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMessageUser(userProfile)}
              className={`p-2 transition-colors ${
                userProfile.allowsMessages && profileSettings.privacy.allowMessages
                  ? 'text-smokey-400 hover:text-blue-400'
                  : 'text-smokey-600 cursor-not-allowed'
              }`}
              title={
                !profileSettings.privacy.allowMessages 
                  ? 'You have disabled messages'
                  : !userProfile.allowsMessages 
                    ? 'User has disabled messages'
                    : 'Send message'
              }
              disabled={!userProfile.allowsMessages || !profileSettings.privacy.allowMessages}
            >
              <SafeIcon icon={FiMessageCircle} className="w-4 h-4" />
            </motion.button>

            {/* Follow/Unfollow Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFollowToggle(userProfile, isFollowing)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
                isFollowing || followsYou
                  ? 'bg-smokey-700 text-smokey-300 hover:bg-red-500/20 hover:text-red-400'
                  : `bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} text-white`
              }`}
            >
              <SafeIcon icon={
                isFollowing || followsYou ? FiUserCheck : FiUserPlus
              } className="w-4 h-4" />
              <span>
                {isFollowing ? 'Following' : followsYou ? 'Follow Back' : 'Follow'}
              </span>
            </motion.button>

            {/* More Options */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-smokey-400 hover:text-white transition-colors"
            >
              <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }, [activeTab, theme?.gradient, formatValue, getTimeAgo, handleFollowToggle, handleMessageUser, profileSettings.privacy.allowMessages]);

  // Render content based on active tab
  const renderTabContent = useCallback(() => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'beats':
        return (
          <div className="space-y-4">
            {realTimeData.beats?.map((beat, index) => (
              <motion.div
                key={beat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={beat.thumbnail}
                    alt={beat.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-semibold">{beat.title}</h3>
                      {beat.isLive && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">LIVE</span>
                      )}
                    </div>
                    <div className="text-sm text-smokey-400 mb-2">
                      {beat.genre} • {beat.bpm} BPM • {beat.key}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-smokey-400">
                      <span className="flex items-center space-x-1">
                        <SafeIcon icon={FiPlay} className="w-3 h-3" />
                        <span>{formatValue(beat.plays, 'count')} plays</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <SafeIcon icon={FiDownload} className="w-3 h-3" />
                        <span>{beat.downloads} downloads</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <SafeIcon icon={FiShoppingCart} className="w-3 h-3" />
                        <span>{beat.sales} sales</span>
                      </span>
                      <span className="flex items-center space-x-1 text-green-400 font-bold">
                        <SafeIcon icon={FiDollarSign} className="w-3 h-3" />
                        <span>{formatValue(beat.earnings, 'currency')}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} rounded-full text-white`}
                    >
                      <SafeIcon icon={FiPlay} className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-smokey-400 hover:text-red-400 transition-colors"
                    >
                      <SafeIcon icon={FiHeart} className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'beats-sold':
        return (
          <div className="space-y-4">
            {realTimeData.beatsSold?.map((sale, index) => (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{sale.beatTitle}</h3>
                    <div className="text-sm text-smokey-400 mt-1">
                      Sold to: <span className="text-white">{sale.buyer}</span> • 
                      License: <span className="text-emerald-400">{sale.license}</span>
                    </div>
                    <div className="text-xs text-smokey-500 mt-1">
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-lg">
                      {formatValue(sale.salePrice, 'currency')}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      sale.payoutStatus === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {sale.payoutStatus}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'tracks':
        return (
          <div className="space-y-4">
            {realTimeData.tracks?.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={track.thumbnail}
                    alt={track.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-semibold">{track.title}</h3>
                      {track.isLive && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">LIVE</span>
                      )}
                    </div>
                    <div className="text-sm text-smokey-400 mb-2">
                      {track.album} • {track.duration}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-smokey-400">
                      <span className="flex items-center space-x-1">
                        <SafeIcon icon={FiPlay} className="w-3 h-3" />
                        <span>{formatValue(track.streams, 'count')} streams</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <SafeIcon icon={FiHeart} className="w-3 h-3" />
                        <span>{formatValue(track.likes, 'count')} likes</span>
                      </span>
                      <span className="flex items-center space-x-1 text-green-400 font-bold">
                        <SafeIcon icon={FiDollarSign} className="w-3 h-3" />
                        <span>{formatValue(track.earnings, 'currency')}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} rounded-full text-white`}
                    >
                      <SafeIcon icon={FiPlay} className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-smokey-400 hover:text-red-400 transition-colors"
                    >
                      <SafeIcon icon={FiHeart} className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'playlists':
        return (
          <div className="space-y-4">
            {realTimeData.playlists?.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{playlist.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-smokey-400">
                      <span>{playlist.trackCount} tracks</span>
                      <span>{formatValue(playlist.totalStreams, 'count')} streams</span>
                      <span>{formatValue(playlist.followers, 'count')} followers</span>
                      <span className={playlist.isPublic ? 'text-green-400' : 'text-yellow-400'}>
                        {playlist.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} rounded-full text-white`}
                    >
                      <SafeIcon icon={FiPlayCircle} className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-smokey-400 hover:text-blue-400 transition-colors"
                    >
                      <SafeIcon icon={FiShare2} className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'earnings':
        return (
          <div className="space-y-6">
            {/* Earnings Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700">
                <div className="flex items-center space-x-3 mb-4">
                  <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-green-400" />
                  <h3 className="text-white font-semibold text-lg">Total Earnings</h3>
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {formatValue(realTimeData.totalEarnings, 'currency')}
                </div>
                <div className="text-sm text-smokey-400 mt-2">All time earnings</div>
              </div>
              
              <div className="p-6 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700">
                <div className="flex items-center space-x-3 mb-4">
                  <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-blue-400" />
                  <h3 className="text-white font-semibold text-lg">This Month</h3>
                </div>
                <div className="text-3xl font-bold text-blue-400">
                  {formatValue(realTimeData.monthlyEarnings, 'currency')}
                </div>
                <div className="text-sm text-smokey-400 mt-2">Current month earnings</div>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="p-6 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
                <SafeIcon icon={FiBarChart3} className="w-5 h-5" />
                <span>Earnings Breakdown</span>
              </h3>
              <div className="space-y-3">
                {userRole === 'producer' && (
                  <>
                    <div className="flex justify-between items-center p-3 bg-smokey-700/30 rounded-lg">
                      <span className="text-smokey-300">Beat Sales</span>
                      <span className="text-green-400 font-bold">
                        {formatValue((realTimeData.totalEarnings || 0) * 0.7, 'currency')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-smokey-700/30 rounded-lg">
                      <span className="text-smokey-300">Licensing</span>
                      <span className="text-green-400 font-bold">
                        {formatValue((realTimeData.totalEarnings || 0) * 0.2, 'currency')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-smokey-700/30 rounded-lg">
                      <span className="text-smokey-300">Tips & Donations</span>
                      <span className="text-green-400 font-bold">
                        {formatValue((realTimeData.totalEarnings || 0) * 0.1, 'currency')}
                      </span>
                    </div>
                  </>
                )}
                {userRole === 'artist' && (
                  <>
                    <div className="flex justify-between items-center p-3 bg-smokey-700/30 rounded-lg">
                      <span className="text-smokey-300">Streaming Revenue</span>
                      <span className="text-green-400 font-bold">
                        {formatValue((realTimeData.totalEarnings || 0) * 0.6, 'currency')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-smokey-700/30 rounded-lg">
                      <span className="text-smokey-300">Direct Sales</span>
                      <span className="text-green-400 font-bold">
                        {formatValue((realTimeData.totalEarnings || 0) * 0.25, 'currency')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-smokey-700/30 rounded-lg">
                      <span className="text-smokey-300">Tips & Support</span>
                      <span className="text-green-400 font-bold">
                        {formatValue((realTimeData.totalEarnings || 0) * 0.15, 'currency')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case 'followers':
        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {formatValue(followerUsers.length, 'count')} Followers
              </h3>
              <div className="text-sm text-smokey-400">
                People who follow your content
              </div>
            </div>
            
            {/* Followers List */}
            {followerUsers.length > 0 ? (
              followerUsers.map((userProfile, index) => renderUserCard(userProfile, index))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-smokey-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiUsers} className="w-8 h-8 text-smokey-400" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">No followers yet</h3>
                <p className="text-smokey-400">Share your content to gain followers!</p>
              </div>
            )}
          </div>
        );

      case 'following':
        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {formatValue(followingUsers.length, 'count')} Following
              </h3>
              <div className="text-sm text-smokey-400">
                Artists and creators you follow
              </div>
            </div>
            
            {/* Following List */}
            {followingUsers.length > 0 ? (
              followingUsers.map((userProfile, index) => renderUserCard(userProfile, index))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-smokey-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiHeart} className="w-8 h-8 text-smokey-400" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Not following anyone yet</h3>
                <p className="text-smokey-400">Discover and follow your favorite creators!</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-smokey-400 text-lg">
              {getTabDisplayName(activeTab)} content coming soon...
            </div>
          </div>
        );
    }
  }, [activeTab, loading, realTimeData, userRole, theme?.gradient, formatValue, getTabDisplayName, followerUsers, followingUsers, renderUserCard]);

  // Profile Photo Editor Modal
  const ProfilePhotoEditor = () => (
    <AnimatePresence>
      {showProfilePhotoEditor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowProfilePhotoEditor(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-smokey-800 rounded-2xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Update Profile Photo</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowProfilePhotoEditor(false)}
                className="p-2 text-smokey-400 hover:text-white transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-smokey-700 overflow-hidden bg-smokey-700 mb-4">
                  {profilePhotoPreview ? (
                    <img src={profilePhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${theme?.gradient || 'from-emerald-500 to-blue-600'} flex items-center justify-center`}>
                      <SafeIcon icon={FiUser} className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                
                <label className={`inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} text-white rounded-full cursor-pointer hover:opacity-90 transition-opacity`}>
                  <SafeIcon icon={FiCamera} className="w-5 h-5" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setProfilePhotoFile(file);
                        const reader = new FileReader();
                        reader.onload = (e) => setProfilePhotoPreview(e.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {profilePhotoFile && (
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePhotoUpload(profilePhotoFile, 'profile')}
                    disabled={uploading}
                    className={`flex-1 py-3 px-4 bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} text-white rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiSave} className="w-4 h-4" />
                        <span>Save Photo</span>
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setProfilePhotoFile(null);
                      setProfilePhotoPreview(null);
                    }}
                    className="px-4 py-3 bg-smokey-700 text-white rounded-xl hover:bg-smokey-600 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Cover Photo Editor Modal
  const CoverPhotoEditor = () => (
    <AnimatePresence>
      {showCoverPhotoEditor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowCoverPhotoEditor(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-smokey-800 rounded-2xl p-6 max-w-2xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Update Cover Photo</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCoverPhotoEditor(false)}
                className="p-2 text-smokey-400 hover:text-white transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="h-48 rounded-xl border-2 border-smokey-700 overflow-hidden bg-smokey-700 mb-4">
                  {coverPhotoPreview ? (
                    <img src={coverPhotoPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} flex items-center justify-center`}>
                      <SafeIcon icon={FiImage} className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                
                <label className={`inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} text-white rounded-full cursor-pointer hover:opacity-90 transition-opacity`}>
                  <SafeIcon icon={FiCamera} className="w-5 h-5" />
                  <span>Choose Cover Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setCoverPhotoFile(file);
                        const reader = new FileReader();
                        reader.onload = (e) => setCoverPhotoPreview(e.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {coverPhotoFile && (
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePhotoUpload(coverPhotoFile, 'cover')}
                    disabled={uploading}
                    className={`flex-1 py-3 px-4 bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} text-white rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiSave} className="w-4 h-4" />
                        <span>Save Cover</span>
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCoverPhotoFile(null);
                      setCoverPhotoPreview(null);
                    }}
                    className="px-4 py-3 bg-smokey-700 text-white rounded-xl hover:bg-smokey-600 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Profile Settings Modal
  const ProfileSettingsModal = () => (
    <AnimatePresence>
      {showProfileSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowProfileSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-smokey-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Profile Settings</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowProfileSettings(false)}
                className="p-2 text-smokey-400 hover:text-white transition-colors"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiUser} className="w-5 h-5" />
                  <span>Basic Information</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={profileSettings.displayName}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Your display name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={profileSettings.username}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Your username"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Bio</label>
                    <textarea
                      value={profileSettings.bio}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Tell people about yourself..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={profileSettings.location}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Your location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Website</label>
                    <input
                      type="url"
                      value={profileSettings.website}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiMail} className="w-5 h-5" />
                  <span>Contact Information</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileSettings.phone}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiLink} className="w-5 h-5" />
                  <span>Social Media</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2 flex items-center space-x-2">
                      <SafeIcon icon={FiInstagram} className="w-4 h-4" />
                      <span>Instagram</span>
                    </label>
                    <input
                      type="text"
                      value={profileSettings.social.instagram}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, social: { ...prev.social, instagram: e.target.value } }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="@yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2 flex items-center space-x-2">
                      <SafeIcon icon={FiTwitter} className="w-4 h-4" />
                      <span>Twitter</span>
                    </label>
                    <input
                      type="text"
                      value={profileSettings.social.twitter}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, social: { ...prev.social, twitter: e.target.value } }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="@yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2 flex items-center space-x-2">
                      <SafeIcon icon={FiYoutube} className="w-4 h-4" />
                      <span>YouTube</span>
                    </label>
                    <input
                      type="text"
                      value={profileSettings.social.youtube}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, social: { ...prev.social, youtube: e.target.value } }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Your channel URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2 flex items-center space-x-2">
                      <SafeIcon icon={FiSoundcloud} className="w-4 h-4" />
                      <span>SoundCloud</span>
                    </label>
                    <input
                      type="text"
                      value={profileSettings.social.soundcloud}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, social: { ...prev.social, soundcloud: e.target.value } }))}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Your SoundCloud profile"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings with Messaging Integration */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiShield} className="w-5 h-5" />
                  <span>Privacy & Security</span>
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-smokey-700/30 rounded-lg">
                    <div>
                      <h5 className="text-white font-medium">Profile Visibility</h5>
                      <p className="text-smokey-400 text-sm">Who can see your profile</p>
                    </div>
                    <select
                      value={profileSettings.privacy.profileVisibility}
                      onChange={(e) => setProfileSettings(prev => ({ 
                        ...prev, 
                        privacy: { ...prev.privacy, profileVisibility: e.target.value } 
                      }))}
                      className="px-3 py-2 bg-smokey-600 border border-smokey-500 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="public">Public</option>
                      <option value="followers">Followers Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-smokey-700/30 rounded-lg border-l-4 border-blue-500">
                    <div>
                      <h5 className="text-white font-medium flex items-center space-x-2">
                        <SafeIcon icon={FiMessageCircle} className="w-4 h-4 text-blue-400" />
                        <span>Allow Direct Messages</span>
                      </h5>
                      <p className="text-smokey-400 text-sm">Let people send you messages in real-time</p>
                      <p className="text-blue-400 text-xs mt-1">
                        {profileSettings.privacy.allowMessages 
                          ? '✅ You can receive and send messages' 
                          : '❌ Messaging is disabled'
                        }
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileSettings.privacy.allowMessages}
                        onChange={(e) => setProfileSettings(prev => ({ 
                          ...prev, 
                          privacy: { ...prev.privacy, allowMessages: e.target.checked } 
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-smokey-600 peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-smokey-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Role-specific Settings */}
              {userRole === 'producer' && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <SafeIcon icon={FiDisc} className="w-5 h-5" />
                    <span>Producer Settings</span>
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-white font-medium mb-3">Beat Pricing</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-smokey-300 mb-2">Basic Lease</label>
                          <input
                            type="number"
                            step="0.01"
                            value={profileSettings.producer.beatPricing.basicLease}
                            onChange={(e) => setProfileSettings(prev => ({ 
                              ...prev, 
                              producer: { 
                                ...prev.producer, 
                                beatPricing: { ...prev.producer.beatPricing, basicLease: parseFloat(e.target.value) }
                              } 
                            }))}
                            className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="29.99"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-smokey-300 mb-2">Premium Lease</label>
                          <input
                            type="number"
                            step="0.01"
                            value={profileSettings.producer.beatPricing.premiumLease}
                            onChange={(e) => setProfileSettings(prev => ({ 
                              ...prev, 
                              producer: { 
                                ...prev.producer, 
                                beatPricing: { ...prev.producer.beatPricing, premiumLease: parseFloat(e.target.value) }
                              } 
                            }))}
                            className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="59.99"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-smokey-300 mb-2">Exclusive Rights</label>
                          <input
                            type="number"
                            step="0.01"
                            value={profileSettings.producer.beatPricing.exclusiveRights}
                            onChange={(e) => setProfileSettings(prev => ({ 
                              ...prev, 
                              producer: { 
                                ...prev.producer, 
                                beatPricing: { ...prev.producer.beatPricing, exclusiveRights: parseFloat(e.target.value) }
                              } 
                            }))}
                            className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="299.99"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {userRole === 'artist' && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <SafeIcon icon={FiMusic} className="w-5 h-5" />
                    <span>Artist Settings</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-smokey-300 mb-2">Booking Rate (per show)</label>
                      <input
                        type="number"
                        value={profileSettings.artist.bookingRate}
                        onChange={(e) => setProfileSettings(prev => ({ 
                          ...prev, 
                          artist: { ...prev.artist, bookingRate: parseInt(e.target.value) }
                        }))}
                        className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-smokey-700/30 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Available for Features</h5>
                        <p className="text-smokey-400 text-sm">Accept feature requests</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileSettings.artist.availableForFeatures}
                          onChange={(e) => setProfileSettings(prev => ({ 
                            ...prev, 
                            artist: { ...prev.artist, availableForFeatures: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-smokey-600 peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-smokey-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <SafeIcon icon={FiBell} className="w-5 h-5" />
                  <span>Notifications</span>
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-smokey-700/30 rounded-lg">
                    <div>
                      <h5 className="text-white font-medium">Email Notifications</h5>
                      <p className="text-smokey-400 text-sm">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileSettings.notifications.emailNotifications}
                        onChange={(e) => setProfileSettings(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, emailNotifications: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-smokey-600 peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-smokey-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-smokey-700/30 rounded-lg">
                    <div>
                      <h5 className="text-white font-medium">Message Notifications</h5>
                      <p className="text-smokey-400 text-sm">Get notified about new messages</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileSettings.notifications.messageNotifications}
                        onChange={(e) => setProfileSettings(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, messageNotifications: e.target.checked }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-smokey-600 peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-smokey-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  
                  {(userRole === 'artist' || userRole === 'producer') && (
                    <div className="flex items-center justify-between p-4 bg-smokey-700/30 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">Earnings Notifications</h5>
                        <p className="text-smokey-400 text-sm">Get notified about new earnings</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileSettings.notifications.earningsNotifications}
                          onChange={(e) => setProfileSettings(prev => ({ 
                            ...prev, 
                            notifications: { ...prev.notifications, earningsNotifications: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-smokey-600 peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-smokey-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-smokey-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileSettings(false)}
                  className="px-6 py-3 bg-smokey-700 text-white rounded-xl hover:bg-smokey-600 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveSettings}
                  disabled={uploading}
                  className={`px-8 py-3 bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} text-white rounded-xl font-medium flex items-center space-x-2 disabled:opacity-50`}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiSave} className="w-4 h-4" />
                      <span>Save Settings</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex-1 p-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8"
      >
        {/* Cover Photo */}
        <div className={`h-48 rounded-2xl bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} relative overflow-hidden`}>
          {coverPhotoPreview && (
            <img src={coverPhotoPreview} alt="Cover" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/20"></div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowCoverPhotoEditor(true)}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            <SafeIcon icon={FiEdit3} className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Profile Info */}
        <div className="relative -mt-16 px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-smokey-900 overflow-hidden bg-smokey-800">
                {profilePhotoPreview ? (
                  <img src={profilePhotoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${theme?.gradient || 'from-emerald-500 to-blue-600'} flex items-center justify-center`}>
                    <SafeIcon icon={
                      userRole === 'producer' ? FiDisc : 
                      userRole === 'artist' ? FiMusic : 
                      FiHeadphones
                    } className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowProfilePhotoEditor(true)}
                className="absolute bottom-2 right-2 p-2 bg-smokey-900 rounded-full border-2 border-smokey-700 hover:border-smokey-600 transition-colors"
              >
                <SafeIcon icon={FiEdit3} className="w-4 h-4 text-white" />
              </motion.button>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{profileSettings.displayName || 'Your Name'}</h1>
              <p className="text-smokey-400 text-lg">@{profileSettings.username || 'username'}</p>
              <p className="text-smokey-300 mt-2">
                {profileSettings.bio || `🎵 ${userRole === 'artist' ? 'Artist' : userRole === 'producer' ? 'Producer' : 'Music Fan'} | 
                ${userRole === 'fan' 
                  ? ' Music enthusiast since 2024 | Discovering new sounds ✨'
                  : ' Creating vibes since 2024 | Stream my latest content ✨'
                }`}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileSettings(true)}
              className={`px-6 py-3 bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} text-white font-semibold rounded-full flex items-center space-x-2`}
            >
              <SafeIcon icon={FiSettings} className="w-5 h-5" />
              <span>Edit Profile</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Role-based Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`grid gap-4 mb-8 ${
          userRole === 'fan' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'
        }`}
      >
        {getRoleBasedStats().map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700 text-center"
          >
            <SafeIcon icon={stat.icon} className={`w-6 h-6 text-emerald-400 mx-auto mb-2`} />
            <div className="text-2xl font-bold text-white">{formatValue(stat.value, stat.format)}</div>
            <div className="text-smokey-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Role-based Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex space-x-1 bg-smokey-800/50 rounded-xl p-1 overflow-x-auto">
          {roleBasedTabs.map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTabChange(tab)}
              className={`flex-shrink-0 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab
                  ? `bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} text-white`
                  : 'text-smokey-400 hover:text-white'
              }`}
            >
              {getTabDisplayName(tab)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Dynamic Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>

      {/* Real-time indicator */}
      {(userRole === 'producer' || userRole === 'artist') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-4 right-4 bg-smokey-800/90 backdrop-blur-lg rounded-full px-4 py-2 border border-smokey-700"
        >
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">Real-time sync active</span>
          </div>
        </motion.div>
      )}

      {/* Modals */}
      <ProfilePhotoEditor />
      <CoverPhotoEditor />
      <ProfileSettingsModal />
    </div>
  );
};

export default ProfilePage;
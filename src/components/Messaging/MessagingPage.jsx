import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import FullMessenger from './FullMessenger';
import * as FiIcons from 'react-icons/fi';

const { 
  FiSearch, FiMessageCircle, FiPhone, FiVideo, FiMoreHorizontal, FiEdit3,
  FiPlus, FiStar, FiArchive, FiSettings, FiUsers, FiMusic, FiMic, FiHeadphones,
  FiZap, FiTrendingUp, FiHeart, FiPlay, FiClock, FiCheck, FiCheckCircle,
  FiUser, FiDisc, FiRadio, FiVolume2, FiShare2, FiEye, FiUserPlus, FiX, FiCircle
} = FiIcons;

const MessagingPage = () => {
  const { theme } = useTheme();
  const { user, logUserAction } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFullMessenger, setShowFullMessenger] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [suggestedContacts, setSuggestedContacts] = useState([]);

  // Role-based conversation generation
  const generateRoleBasedConversations = useCallback(() => {
    const baseConversations = [
      {
        id: 1,
        user: { 
          name: 'Alex Rivera', 
          username: 'alexmusic', 
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          isOnline: true,
          lastSeen: 'Online now',
          userType: 'artist',
          isVerified: true
        },
        lastMessage: 'Hey! Love your latest track. Want to collaborate?',
        timestamp: '5 min ago',
        unreadCount: 2,
        isTyping: false,
        isPinned: true,
        musicContext: {
          currentTrack: { title: 'Urban Flow', artist: 'You', duration: '3:45' },
          collaborationScore: 95,
          sharedGenres: ['Lo-Fi', 'Hip-Hop', 'Electronic']
        }
      },
      {
        id: 2,
        user: { 
          name: 'Emma Stone', 
          username: 'emmavibes', 
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          isOnline: false,
          lastSeen: '2 hours ago',
          userType: 'fan',
          isVerified: false
        },
        lastMessage: 'The beat drop at 1:30 is incredible! 🔥',
        timestamp: '2 hours ago',
        unreadCount: 0,
        isTyping: false,
        isPinned: false,
        musicContext: {
          referencedTrack: { title: 'Midnight Vibes', timestamp: '1:30' },
          emotion: 'excited',
          engagement: 'high'
        }
      },
      {
        id: 3,
        user: { 
          name: 'Marcus Johnson', 
          username: 'marcusbeats', 
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          isOnline: true,
          lastSeen: 'Online now',
          userType: 'producer',
          isVerified: true
        },
        lastMessage: 'Just dropped a new beat, check it out! 🎵',
        timestamp: '1 hour ago',
        unreadCount: 1,
        isTyping: false,
        isPinned: false,
        musicContext: {
          sharedTrack: { title: 'Street Symphony', artist: 'Marcus Johnson', genre: 'Hip-Hop' },
          collaborationScore: 88,
          fanEngagement: 'growing'
        }
      }
    ];

    // Add role-specific conversations
    if (user?.userType === 'artist') {
      baseConversations.push(
        {
          id: 4,
          user: { 
            name: 'Luna Beats', 
            username: 'lunabeats', 
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            isOnline: true,
            lastSeen: 'Online now',
            userType: 'producer',
            isVerified: true
          },
          lastMessage: 'Your vocals would be perfect for this beat 🎤',
          timestamp: '30 min ago',
          unreadCount: 1,
          isTyping: false,
          isPinned: false,
          musicContext: {
            beatProposal: { title: 'Moonlight Serenade', bpm: 85, key: 'Am' },
            collaborationScore: 92,
            matchReason: 'Vocal style compatibility'
          }
        },
        {
          id: 5,
          user: { 
            name: 'DJ Phoenix', 
            username: 'djphoenix', 
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
            isOnline: false,
            lastSeen: '1 day ago',
            userType: 'producer',
            isVerified: false
          },
          lastMessage: 'Can we remix your track "Summer Nights"?',
          timestamp: '6 hours ago',
          unreadCount: 0,
          isTyping: false,
          isPinned: false,
          musicContext: {
            remixRequest: { originalTrack: 'Summer Nights', proposedStyle: 'Electronic Dance' },
            collaborationScore: 78
          }
        }
      );
    } else if (user?.userType === 'producer') {
      baseConversations.push(
        {
          id: 4,
          user: { 
            name: 'Sophia Chen', 
            username: 'sophiasings', 
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            isOnline: true,
            lastSeen: 'Online now',
            userType: 'artist',
            isVerified: true
          },
          lastMessage: 'I love the melody in your latest beat! 🎶',
          timestamp: '20 min ago',
          unreadCount: 3,
          isTyping: true,
          isPinned: true,
          musicContext: {
            interestedBeat: { title: 'Neon Dreams', bpm: 120, price: '$50' },
            collaborationScore: 94,
            vocalCompatibility: 'excellent'
          }
        },
        {
          id: 5,
          user: { 
            name: 'Ryan Torres', 
            username: 'ryantunes', 
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            isOnline: false,
            lastSeen: '4 hours ago',
            userType: 'artist',
            isVerified: false
          },
          lastMessage: 'When can we schedule a studio session?',
          timestamp: '3 hours ago',
          unreadCount: 0,
          isTyping: false,
          isPinned: false,
          musicContext: {
            studioSession: { proposedDate: '2024-01-15', duration: '4 hours' },
            collaborationScore: 85,
            projectType: 'album_track'
          }
        }
      );
    } else if (user?.userType === 'fan') {
      baseConversations.push(
        {
          id: 4,
          user: { 
            name: 'Maya Rodriguez', 
            username: 'mayamusic', 
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
            isOnline: true,
            lastSeen: 'Online now',
            userType: 'artist',
            isVerified: true
          },
          lastMessage: 'Thanks for supporting my music! 💜',
          timestamp: '45 min ago',
          unreadCount: 1,
          isTyping: false,
          isPinned: false,
          musicContext: {
            fanSupport: { totalStreams: 1250, favoriteTrack: 'Starlight' },
            engagement: 'high',
            fanSince: '6 months'
          }
        },
        {
          id: 5,
          user: { 
            name: 'Beat Collective', 
            username: 'beatcollective', 
            avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=face',
            isOnline: true,
            lastSeen: 'Online now',
            userType: 'producer',
            isVerified: true
          },
          lastMessage: 'New beats added to your favorites playlist! 🎵',
          timestamp: '2 hours ago',
          unreadCount: 0,
          isTyping: false,
          isPinned: false,
          musicContext: {
            playlistUpdate: { name: 'My Favorites', newTracks: 3 },
            engagement: 'moderate',
            subscriptionType: 'premium'
          }
        }
      );
    }

    return baseConversations;
  }, [user?.userType]);

  // Generate suggested contacts based on user type
  const generateSuggestedContacts = useCallback(() => {
    if (user?.userType === 'artist') {
      return [
        {
          id: 101,
          name: 'Producer Network',
          username: 'producernetwork',
          avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=face',
          userType: 'producer',
          isVerified: true,
          matchScore: 98,
          reason: 'Top-rated producers for your genre'
        },
        {
          id: 102,
          name: 'Vocal Coach Sarah',
          username: 'vocalcoachsarah',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          userType: 'coach',
          isVerified: true,
          matchScore: 89,
          reason: 'Improve your vocal technique'
        }
      ];
    } else if (user?.userType === 'producer') {
      return [
        {
          id: 101,
          name: 'Rising Artists Hub',
          username: 'risingartists',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          userType: 'artist',
          isVerified: true,
          matchScore: 95,
          reason: 'Artists looking for your beat style'
        },
        {
          id: 102,
          name: 'Mix Master Pro',
          username: 'mixmasterpro',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
          userType: 'engineer',
          isVerified: true,
          matchScore: 92,
          reason: 'Professional mixing services'
        }
      ];
    } else {
      return [
        {
          id: 101,
          name: 'Music Discovery',
          username: 'musicdiscovery',
          avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=face',
          userType: 'curator',
          isVerified: true,
          matchScore: 90,
          reason: 'Discover new music based on your taste'
        },
        {
          id: 102,
          name: 'Fan Community',
          username: 'fancommunity',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          userType: 'community',
          isVerified: false,
          matchScore: 85,
          reason: 'Connect with other music fans'
        }
      ];
    }
  }, [user?.userType]);

  // Initialize conversations and suggested contacts
  useEffect(() => {
    setConversations(generateRoleBasedConversations());
    setSuggestedContacts(generateSuggestedContacts());
  }, [generateRoleBasedConversations, generateSuggestedContacts]);

  // Filter conversations based on selected filter
  const filteredConversations = useMemo(() => {
    let filtered = conversations;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(conv => 
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    switch (selectedFilter) {
      case 'unread':
        filtered = filtered.filter(conv => conv.unreadCount > 0);
        break;
      case 'pinned':
        filtered = filtered.filter(conv => conv.isPinned);
        break;
      case 'artists':
        filtered = filtered.filter(conv => conv.user.userType === 'artist');
        break;
      case 'producers':
        filtered = filtered.filter(conv => conv.user.userType === 'producer');
        break;
      case 'fans':
        filtered = filtered.filter(conv => conv.user.userType === 'fan');
        break;
      case 'collaborations':
        filtered = filtered.filter(conv => conv.musicContext?.collaborationScore > 80);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [conversations, searchQuery, selectedFilter]);

  // Get filter options based on user type
  const getFilterOptions = useCallback(() => {
    const baseFilters = [
      { id: 'all', label: 'All Messages', icon: FiMessageCircle },
      { id: 'unread', label: 'Unread', icon: FiCircle },
      { id: 'pinned', label: 'Pinned', icon: FiStar }
    ];

    if (user?.userType === 'artist') {
      return [
        ...baseFilters,
        { id: 'producers', label: 'Producers', icon: FiDisc },
        { id: 'fans', label: 'Fans', icon: FiHeart },
        { id: 'collaborations', label: 'Collaborations', icon: FiZap }
      ];
    } else if (user?.userType === 'producer') {
      return [
        ...baseFilters,
        { id: 'artists', label: 'Artists', icon: FiMic },
        { id: 'fans', label: 'Fans', icon: FiHeart },
        { id: 'collaborations', label: 'Beat Requests', icon: FiMusic }
      ];
    } else {
      return [
        ...baseFilters,
        { id: 'artists', label: 'Artists', icon: FiMic },
        { id: 'producers', label: 'Producers', icon: FiDisc }
      ];
    }
  }, [user?.userType]);

  // Handle conversation click
  const handleConversationClick = useCallback(async (conversation) => {
    setSelectedConversationId(conversation.id);
    setShowFullMessenger(true);
    
    // Mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversation.id 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
    
    // Log conversation opened
    if (logUserAction) {
      try {
        await logUserAction('conversation_opened', {
          conversation_id: conversation.id,
          recipient: conversation.user.username,
          recipient_type: conversation.user.userType,
          has_music_context: !!conversation.musicContext
        });
      } catch (error) {
        console.warn('Failed to log conversation opened:', error);
      }
    }
  }, [logUserAction]);

  // Handle new chat
  const handleNewChat = useCallback(async (contact) => {
    const newConversation = {
      id: Date.now(),
      user: contact,
      lastMessage: 'Start a conversation...',
      timestamp: 'now',
      unreadCount: 0,
      isTyping: false,
      isPinned: false,
      musicContext: null
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setShowNewChatModal(false);
    setSelectedConversationId(newConversation.id);
    setShowFullMessenger(true);
    
    // Log new conversation started
    if (logUserAction) {
      try {
        await logUserAction('new_conversation_started', {
          recipient: contact.username,
          recipient_type: contact.userType,
          source: 'messaging_page'
        });
      } catch (error) {
        console.warn('Failed to log new conversation:', error);
      }
    }
  }, [logUserAction]);

  // Role-based header content
  const getHeaderContent = useCallback(() => {
    switch (user?.userType) {
      case 'artist':
        return {
          title: 'Artist Messages',
          subtitle: 'Connect with producers, fans, and collaborators',
          icon: FiMic
        };
      case 'producer':
        return {
          title: 'Producer Messages',
          subtitle: 'Connect with artists, sell beats, and collaborate',
          icon: FiDisc
        };
      case 'fan':
        return {
          title: 'Fan Messages',
          subtitle: 'Connect with artists, producers, and other fans',
          icon: FiHeadphones
        };
      default:
        return {
          title: 'Messages',
          subtitle: 'Connect with the music community',
          icon: FiMessageCircle
        };
    }
  }, [user?.userType]);

  const headerContent = getHeaderContent();
  const filterOptions = getFilterOptions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center shadow-lg`}>
              <SafeIcon icon={headerContent.icon} className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">{headerContent.title}</h1>
              <p className="text-smokey-400 mt-1">{headerContent.subtitle}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowNewChatModal(true)}
            className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${theme.gradient} text-white rounded-lg hover:scale-105 transition-transform shadow-lg`}
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-smokey-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search conversations, names, or messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 bg-smokey-800 border border-smokey-700 rounded-xl text-white placeholder-smokey-400 focus:outline-none focus:border-${theme.primary} transition-colors`}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                selectedFilter === filter.id
                  ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg`
                  : 'bg-smokey-800 text-smokey-400 hover:text-white hover:bg-smokey-700'
              }`}
            >
              <SafeIcon icon={filter.icon} className="w-4 h-4" />
              <span className="text-sm font-medium">{filter.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Conversations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredConversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-smokey-900 border border-smokey-700 rounded-xl p-6 cursor-pointer hover:border-${theme.primary} transition-all shadow-lg backdrop-blur-sm`}
            onClick={() => handleConversationClick(conversation)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-smokey-900 rounded-full" />
                  )}
                  {conversation.user.isVerified && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiCheck} className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{conversation.user.name}</h3>
                  <p className="text-smokey-400 text-sm">@{conversation.user.username}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {conversation.isPinned && (
                  <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400" />
                )}
                {conversation.unreadCount > 0 && (
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{conversation.unreadCount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* User Type Badge */}
            <div className="mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                conversation.user.userType === 'artist' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : conversation.user.userType === 'producer'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {conversation.user.userType}
              </span>
            </div>

            {/* Last Message */}
            <div className="mb-4">
              <p className="text-smokey-300 text-sm line-clamp-2">
                {conversation.isTyping ? (
                  <span className={`text-${theme.primary} italic`}>typing...</span>
                ) : (
                  conversation.lastMessage
                )}
              </p>
              <p className="text-smokey-500 text-xs mt-1">{conversation.timestamp}</p>
            </div>

            {/* Music Context */}
            {conversation.musicContext && (
              <div className={`p-3 bg-gradient-to-r ${theme.gradient} bg-opacity-20 rounded-lg border border-${theme.primary}/30`}>
                <div className="flex items-center space-x-2 mb-2">
                  <SafeIcon icon={FiMusic} className={`w-4 h-4 text-${theme.primary}`} />
                  <span className="text-white text-xs font-semibold">Music Context</span>
                </div>
                
                {conversation.musicContext.collaborationScore && (
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs">Collaboration Match:</span>
                    <span className={`text-${theme.primary} text-xs font-bold`}>
                      {conversation.musicContext.collaborationScore}%
                    </span>
                  </div>
                )}
                
                {conversation.musicContext.currentTrack && (
                  <div className="flex items-center space-x-2 mt-1">
                    <SafeIcon icon={FiPlay} className="w-3 h-3 text-white" />
                    <span className="text-white text-xs">
                      {conversation.musicContext.currentTrack.title}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-smokey-700">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-smokey-400 hover:text-green-400 hover:bg-smokey-800 rounded-full transition-colors">
                  <SafeIcon icon={FiPhone} className="w-4 h-4" />
                </button>
                <button className="p-2 text-smokey-400 hover:text-blue-400 hover:bg-smokey-800 rounded-full transition-colors">
                  <SafeIcon icon={FiVideo} className="w-4 h-4" />
                </button>
              </div>
              <span className="text-smokey-500 text-xs">
                {conversation.user.isOnline ? 'Online' : conversation.user.lastSeen}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredConversations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <SafeIcon icon={FiMessageCircle} className="w-16 h-16 text-smokey-400 mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">
            {searchQuery ? 'No conversations found' : 'No messages yet'}
          </h3>
          <p className="text-smokey-400 mb-6">
            {searchQuery 
              ? 'Try adjusting your search or filters'
              : 'Start connecting with the music community'
            }
          </p>
          <button
            onClick={() => setShowNewChatModal(true)}
            className={`px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-lg hover:scale-105 transition-transform shadow-lg`}
          >
            Start Your First Conversation
          </button>
        </motion.div>
      )}

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-smokey-900 border border-smokey-700 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-smokey-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-xl">Start New Chat</h3>
                  <button
                    onClick={() => setShowNewChatModal(false)}
                    className="text-smokey-400 hover:text-white transition-colors p-2 hover:bg-smokey-800 rounded-full"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Suggested Contacts */}
              <div className="p-6">
                <h4 className="text-white font-semibold mb-4">Suggested for you</h4>
                <div className="space-y-3">
                  {suggestedContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 bg-smokey-800/50 rounded-lg hover:bg-smokey-800 transition-colors cursor-pointer"
                      onClick={() => handleNewChat(contact)}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h5 className="text-white font-medium">{contact.name}</h5>
                          <p className="text-smokey-400 text-sm">@{contact.username}</p>
                          <p className={`text-${theme.primary} text-xs`}>{contact.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-${theme.primary} text-xs font-bold`}>
                          {contact.matchScore}%
                        </span>
                        <SafeIcon icon={FiUserPlus} className={`w-4 h-4 text-${theme.primary}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Messenger Modal */}
      <AnimatePresence>
        {showFullMessenger && (
          <FullMessenger 
            onClose={() => {
              setShowFullMessenger(false);
              setSelectedConversationId(null);
            }}
            initialConversationId={selectedConversationId}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagingPage;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import FullMessenger from '../Messaging/FullMessenger';
import NotificationCenter from '../Notifications/NotificationCenter';
import * as FiIcons from 'react-icons/fi';

const { 
  FiSearch, FiBell, FiMessageCircle, FiUser, FiMusic, FiX, FiHeart, 
  FiPlay, FiUsers, FiTrendingUp, FiStar, FiHeadphones, FiRadio,
  FiMic, FiDisc, FiVolume2, FiShare2, FiEye, FiClock, FiZap
} = FiIcons;

const Header = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const { user, logUserAction } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showFullMessenger, setShowFullMessenger] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [messageCount, setMessageCount] = useState(2);

  // Mock data for notifications and messages
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: { name: 'Sarah Chen', username: 'sarahbeats', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
      content: 'liked your track "Midnight Vibes"',
      timestamp: '2 min ago',
      isRead: false,
      musicSuggestion: {
        type: 'similar_track',
        track: { title: 'Neon Dreams', artist: 'Luna Wave', genre: 'Electronic' },
        reason: 'Sarah also liked tracks in this genre'
      }
    },
    {
      id: 2,
      type: 'follow',
      user: { name: 'Marcus Johnson', username: 'marcusbeats', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
      content: 'started following you',
      timestamp: '15 min ago',
      isRead: false,
      musicSuggestion: {
        type: 'artist_collab',
        artist: { name: 'Marcus Johnson', genre: 'Hip-Hop', followers: '12.5K' },
        reason: 'Perfect for a hip-hop collaboration'
      }
    },
    {
      id: 3,
      type: 'trending',
      content: 'Your track "Summer Nights" is trending in Electronic',
      timestamp: '1 hour ago',
      isRead: true,
      musicSuggestion: {
        type: 'genre_boost',
        suggestion: 'Create more Electronic tracks to ride the wave',
        trending: { genre: 'Electronic', position: '#3', growth: '+45%' }
      }
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      user: { name: 'Alex Rivera', username: 'alexmusic', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
      lastMessage: 'Hey! Love your latest track. Want to collaborate?',
      timestamp: '5 min ago',
      isRead: false,
      isOnline: true,
      musicContext: {
        sharedTrack: { title: 'Urban Flow', artist: 'You', plays: '2.3K' },
        collaborationPotential: 95,
        suggestedGenre: 'Lo-Fi Hip-Hop'
      }
    },
    {
      id: 2,
      user: { name: 'Emma Stone', username: 'emmavibes', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
      lastMessage: 'The beat drop at 1:30 is incredible! 🔥',
      timestamp: '2 hours ago',
      isRead: true,
      isOnline: false,
      musicContext: {
        referencedTrack: { title: 'Midnight Vibes', timestamp: '1:30' },
        emotion: 'excited',
        suggestedResponse: 'Share the story behind that beat drop'
      }
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new notifications
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          type: 'play',
          user: { name: 'New Fan', username: 'musiclover', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face' },
          content: 'is playing your track on repeat',
          timestamp: 'now',
          isRead: false,
          musicSuggestion: {
            type: 'fan_engagement',
            suggestion: 'Send them a personalized thank you message',
            engagement: { plays: 15, duration: '3:45' }
          }
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        setNotificationCount(prev => prev + 1);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showNotifications || showMessages || showFullMessenger || showNotificationCenter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showNotifications, showMessages, showFullMessenger, showNotificationCenter]);

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    setShowMessages(false);
    
    if (!showNotifications) {
      await logUserAction('notification_panel_opened', {
        unread_count: notificationCount,
        total_notifications: notifications.length
      });
    }
  };

  const handleMessageClick = async () => {
    setShowMessages(!showMessages);
    setShowNotifications(false);
    
    if (!showMessages) {
      await logUserAction('message_panel_opened', {
        unread_count: messageCount,
        total_conversations: messages.length
      });
    }
  };

  const handleViewAllNotifications = async () => {
    setShowNotifications(false);
    setShowNotificationCenter(true);
    
    await logUserAction('notification_center_opened', {
      source: 'header_panel'
    });
  };

  const handleOpenFullMessenger = async () => {
    setShowMessages(false);
    setShowFullMessenger(true);
    
    await logUserAction('full_messenger_opened', {
      source: 'header_panel'
    });
  };

  const markNotificationAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setNotificationCount(prev => Math.max(0, prev - 1));
    
    await logUserAction('notification_read', { notification_id: notificationId });
  };

  const handleMusicSuggestionClick = async (suggestion, notificationId) => {
    await logUserAction('music_suggestion_clicked', {
      suggestion_type: suggestion.type,
      notification_id: notificationId,
      suggestion_data: suggestion
    });
    
    // Here you would typically navigate to the suggested content
    console.log('Music suggestion clicked:', suggestion);
  };

  const closeModals = () => {
    setShowNotifications(false);
    setShowMessages(false);
  };

  const NotificationModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={closeModals}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md max-h-[80vh] bg-smokey-900 border border-smokey-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-smokey-700 flex items-center justify-between">
          <h3 className="text-white font-bold text-xl flex items-center space-x-3">
            <SafeIcon icon={FiBell} className="w-6 h-6" />
            <span>Notifications</span>
          </h3>
          <button
            onClick={closeModals}
            className="text-smokey-400 hover:text-white transition-colors p-2 hover:bg-smokey-800 rounded-full"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border-b border-smokey-700 hover:bg-smokey-800/50 cursor-pointer transition-colors ${
                !notification.isRead ? 'bg-smokey-800/30' : ''
              }`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar or Icon */}
                {notification.user ? (
                  <img
                    src={notification.user.avatar}
                    alt={notification.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                    <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-white" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm">
                      {notification.user && (
                        <span className="font-semibold">{notification.user.name}</span>
                      )}
                      {' '}{notification.content}
                    </p>
                    {!notification.isRead && (
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.gradient}`} />
                    )}
                  </div>
                  
                  <p className="text-smokey-400 text-xs mt-1">{notification.timestamp}</p>

                  {/* Unique Ovi Music Suggestion */}
                  {notification.musicSuggestion && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-3 p-3 rounded-lg bg-gradient-to-r ${theme.gradient} bg-opacity-20 border border-${theme.primary} border-opacity-30`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <SafeIcon icon={FiZap} className={`w-4 h-4 text-${theme.primary}`} />
                        <span className="text-white text-xs font-semibold">Ovi Suggestion</span>
                      </div>
                      
                      {notification.musicSuggestion.type === 'similar_track' && (
                        <div 
                          className="cursor-pointer hover:bg-white hover:bg-opacity-10 rounded p-2 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMusicSuggestionClick(notification.musicSuggestion, notification.id);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiMusic} className="w-4 h-4 text-white" />
                            <div>
                              <p className="text-white text-xs font-medium">
                                {notification.musicSuggestion.track.title} - {notification.musicSuggestion.track.artist}
                              </p>
                              <p className="text-smokey-300 text-xs">{notification.musicSuggestion.reason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {notification.musicSuggestion.type === 'artist_collab' && (
                        <div 
                          className="cursor-pointer hover:bg-white hover:bg-opacity-10 rounded p-2 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMusicSuggestionClick(notification.musicSuggestion, notification.id);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiMic} className="w-4 h-4 text-white" />
                            <div>
                              <p className="text-white text-xs font-medium">Collaboration Opportunity</p>
                              <p className="text-smokey-300 text-xs">{notification.musicSuggestion.reason}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {notification.musicSuggestion.type === 'genre_boost' && (
                        <div className="p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-400" />
                              <span className="text-white text-xs font-medium">Trending #{notification.musicSuggestion.trending.position}</span>
                            </div>
                            <span className="text-green-400 text-xs font-bold">{notification.musicSuggestion.trending.growth}</span>
                          </div>
                          <p className="text-smokey-300 text-xs mt-1">{notification.musicSuggestion.suggestion}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-smokey-700">
          <button 
            onClick={handleViewAllNotifications}
            className="w-full py-3 text-white text-sm font-medium hover:bg-smokey-800 rounded-lg transition-colors"
          >
            View All Notifications
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  const MessageModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={closeModals}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md max-h-[80vh] bg-smokey-900 border border-smokey-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-smokey-700 flex items-center justify-between">
          <h3 className="text-white font-bold text-xl flex items-center space-x-3">
            <SafeIcon icon={FiMessageCircle} className="w-6 h-6" />
            <span>Messages</span>
          </h3>
          <button
            onClick={closeModals}
            className="text-smokey-400 hover:text-white transition-colors p-2 hover:bg-smokey-800 rounded-full"
          >
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        {/* Messages List */}
        <div className="overflow-y-auto max-h-96">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border-b border-smokey-700 hover:bg-smokey-800/50 cursor-pointer transition-colors ${
                !message.isRead ? 'bg-smokey-800/30' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar with Online Status */}
                <div className="relative">
                  <img
                    src={message.user.avatar}
                    alt={message.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {message.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-smokey-900 rounded-full" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-semibold">{message.user.name}</h4>
                    <div className="flex items-center space-x-2">
                      {!message.isRead && (
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.gradient}`} />
                      )}
                      <span className="text-smokey-400 text-xs">{message.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-smokey-300 text-sm mt-1 line-clamp-2">{message.lastMessage}</p>

                  {/* Unique Ovi Music Context */}
                  {message.musicContext && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`mt-3 p-3 rounded-lg bg-gradient-to-r ${theme.gradient} bg-opacity-20 border border-${theme.primary} border-opacity-30`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <SafeIcon icon={FiHeadphones} className={`w-4 h-4 text-${theme.primary}`} />
                        <span className="text-white text-xs font-semibold">Music Context</span>
                      </div>

                      {message.musicContext.sharedTrack && (
                        <div className="flex items-center space-x-2 mb-2">
                          <SafeIcon icon={FiPlay} className="w-3 h-3 text-white" />
                          <div>
                            <p className="text-white text-xs font-medium">{message.musicContext.sharedTrack.title}</p>
                            <p className="text-smokey-300 text-xs">{message.musicContext.sharedTrack.plays} plays</p>
                          </div>
                        </div>
                      )}

                      {message.musicContext.collaborationPotential && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-xs">Collab Match:</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-16 h-1 bg-smokey-600 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${theme.gradient}`}
                                style={{ width: `${message.musicContext.collaborationPotential}%` }}
                              />
                            </div>
                            <span className={`text-${theme.primary} text-xs font-bold`}>
                              {message.musicContext.collaborationPotential}%
                            </span>
                          </div>
                        </div>
                      )}

                      {message.musicContext.suggestedResponse && (
                        <div className="bg-smokey-800 bg-opacity-50 rounded p-2">
                          <div className="flex items-center space-x-1 mb-1">
                            <SafeIcon icon={FiZap} className={`w-3 h-3 text-${theme.primary}`} />
                            <span className="text-white text-xs font-medium">Suggested Reply:</span>
                          </div>
                          <p className="text-smokey-300 text-xs">{message.musicContext.suggestedResponse}</p>
                        </div>
                      )}

                      {message.musicContext.referencedTrack && (
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiClock} className="w-3 h-3 text-white" />
                          <p className="text-white text-xs">
                            Referenced: {message.musicContext.referencedTrack.title} at {message.musicContext.referencedTrack.timestamp}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-smokey-700">
          <button 
            onClick={handleOpenFullMessenger}
            className="w-full py-3 text-white text-sm font-medium hover:bg-smokey-800 rounded-lg transition-colors"
          >
            Open Full Messenger
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <header className="bg-smokey-900/95 backdrop-blur-lg border-b border-smokey-700 p-4 relative">
        <div className="flex items-center justify-between">
          {/* Logo (Mobile) */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                <SafeIcon icon={FiMusic} className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Ovi</span>
            </motion.div>
          )}

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative ${isMobile ? 'flex-1 mx-4' : 'w-96'}`}
          >
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-smokey-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search artists, songs, or users..."
              className={`w-full pl-10 pr-4 py-2 bg-smokey-800 border border-smokey-700 rounded-full text-white placeholder-smokey-400 focus:outline-none focus:border-${theme.primary} transition-colors`}
            />
          </motion.div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {!isMobile && (
              <>
                {/* Enhanced Notifications Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNotificationClick}
                  className="relative p-2 text-smokey-400 hover:text-white transition-colors"
                >
                  <SafeIcon icon={FiBell} className="w-6 h-6" />
                  {notificationCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white text-xs font-bold">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    </motion.div>
                  )}
                </motion.button>

                {/* Enhanced Messages Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMessageClick}
                  className="relative p-2 text-smokey-400 hover:text-white transition-colors"
                >
                  <SafeIcon icon={FiMessageCircle} className="w-6 h-6" />
                  {messageCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r ${theme.gradient} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white text-xs font-bold">
                        {messageCount > 9 ? '9+' : messageCount}
                      </span>
                    </motion.div>
                  )}
                </motion.button>
              </>
            )}

            {/* Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
              </div>
              {!isMobile && (
                <span className="text-white font-medium">{user?.username || 'User'}</span>
              )}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <AnimatePresence>
        {showNotifications && <NotificationModal />}
        {showMessages && <MessageModal />}
        {showFullMessenger && (
          <FullMessenger 
            onClose={() => setShowFullMessenger(false)}
          />
        )}
        {showNotificationCenter && (
          <NotificationCenter 
            onClose={() => setShowNotificationCenter(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
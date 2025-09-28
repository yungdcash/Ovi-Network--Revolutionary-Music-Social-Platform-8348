import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import FullMessenger from '../Messaging/FullMessenger';
import NotificationCenter from '../Notifications/NotificationCenter';
import * as FiIcons from 'react-icons/fi';

const { 
  FiSearch, FiBell, FiMessageCircle, FiUser, FiMusic, FiX
} = FiIcons;

const Header = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const { user, logUserAction } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showFullMessenger, setShowFullMessenger] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  // Real-time profile picture sync state
  const [currentProfilePicture, setCurrentProfilePicture] = useState(user?.profilePhoto);

  // Listen for profile picture updates in real-time
  useEffect(() => {
    const handleProfilePhotoUpdate = (event) => {
      if (event.detail?.profilePhoto) {
        setCurrentProfilePicture(event.detail.profilePhoto);
      }
    };

    window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    return () => window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
  }, []);

  // Update profile picture when user changes
  useEffect(() => {
    setCurrentProfilePicture(user?.profilePhoto);
  }, [user?.profilePhoto]);

  // Initialize with empty notifications and messages
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

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

        {/* Empty State */}
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-smokey-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiBell} className="w-8 h-8 text-smokey-400" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">No notifications yet</h3>
          <p className="text-smokey-400">You'll see notifications here when you have them</p>
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

        {/* Empty State */}
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-smokey-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiMessageCircle} className="w-8 h-8 text-smokey-400" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">No messages yet</h3>
          <p className="text-smokey-400">Start a conversation to see messages here</p>
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

            {/* Profile with Real-time Sync */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-smokey-600">
                {currentProfilePicture ? (
                  <img 
                    src={currentProfilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                    <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
                  </div>
                )}
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
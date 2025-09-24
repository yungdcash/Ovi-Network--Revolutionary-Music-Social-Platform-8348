import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiX, FiBell, FiMusic, FiHeart, FiMessageCircle, FiUsers, FiTrendingUp,
  FiPlay, FiMic, FiHeadphones, FiZap, FiStar, FiAward, FiEye, FiShare2,
  FiClock, FiCheck, FiCheckCircle, FiFilter, FiSettings, FiThumbsUp,
  FiExternalLink, FiDownload, FiSend, FiUserPlus, FiGift, FiCamera,
  FiEdit3, FiBarChart3, FiTarget, FiCopy, FiSmile
} = FiIcons;

const NotificationCenter = ({ onClose }) => {
  const { theme } = useTheme();
  const { user, logUserAction } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(null);

  useEffect(() => {
    // Mock notifications with enhanced music engagement features
    const mockNotifications = [
      {
        id: 1,
        type: 'track_milestone',
        title: 'Track Milestone Reached! 🎉',
        content: 'Your track "Midnight Vibes" just hit 10K plays!',
        timestamp: '2 min ago',
        isRead: false,
        priority: 'high',
        musicData: {
          trackTitle: 'Midnight Vibes',
          milestone: '10,000 plays',
          genre: 'Electronic',
          growthRate: '+45%',
          topCountries: ['USA', 'UK', 'Germany'],
          suggestedAction: 'Create a celebration post to thank your fans'
        },
        actions: [
          { label: 'Share Achievement', type: 'share', icon: FiShare2 },
          { label: 'View Analytics', type: 'analytics', icon: FiTrendingUp }
        ]
      },
      {
        id: 2,
        type: 'collaboration_request',
        title: 'Collaboration Request',
        content: 'Sarah Chen wants to collaborate on a Lo-Fi track',
        timestamp: '15 min ago',
        isRead: false,
        priority: 'high',
        user: {
          name: 'Sarah Chen',
          username: 'sarahbeats',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          followers: '25.3K',
          genre: 'Lo-Fi'
        },
        musicData: {
          proposedGenre: 'Lo-Fi Hip-Hop',
          collaborationScore: 92,
          sharedInfluences: ['Nujabes', 'J Dilla', 'Tom Misch'],
          estimatedReach: '35K+ combined followers'
        },
        actions: [
          { label: 'Accept', type: 'accept', icon: FiCheck },
          { label: 'View Profile', type: 'profile', icon: FiEye },
          { label: 'Message', type: 'message', icon: FiMessageCircle }
        ]
      },
      {
        id: 3,
        type: 'fan_engagement',
        title: 'Fan Spotlight',
        content: 'Your top fan Alex Rivera shared your track with their 5K followers!',
        timestamp: '1 hour ago',
        isRead: false,
        priority: 'medium',
        user: {
          name: 'Alex Rivera',
          username: 'alexmusic',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          followers: '5.2K'
        },
        musicData: {
          sharedTrack: 'Urban Flow',
          originalPlays: '2.3K',
          newPlays: '+127',
          engagementBoost: '+23%',
          fanLoyaltyScore: 95
        },
        actions: [
          { label: 'Thank Fan', type: 'thank', icon: FiHeart },
          { label: 'Share Story', type: 'share', icon: FiShare2 }
        ]
      },
      {
        id: 4,
        type: 'trend_alert',
        title: 'Trending Alert 📈',
        content: 'Your genre "Electronic" is trending +67% this week',
        timestamp: '2 hours ago',
        isRead: true,
        priority: 'medium',
        musicData: {
          trendingGenre: 'Electronic',
          growthPercentage: '+67%',
          position: '#3',
          opportunity: 'Perfect time to release new Electronic tracks',
          competitorActivity: 'Low',
          suggestedTags: ['#ElectronicMusic', '#TrendingNow', '#NewRelease']
        },
        actions: [
          { label: 'Create Track', type: 'create', icon: FiMusic },
          { label: 'View Trends', type: 'trends', icon: FiTrendingUp }
        ]
      },
      {
        id: 5,
        type: 'remix_opportunity',
        title: 'Remix Opportunity',
        content: 'Marcus Johnson\'s "Street Symphony" is perfect for your style',
        timestamp: '4 hours ago',
        isRead: true,
        priority: 'low',
        user: {
          name: 'Marcus Johnson',
          username: 'marcusbeats',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        musicData: {
          originalTrack: 'Street Symphony',
          remixPotential: 89,
          suggestedStyle: 'Electronic Remix',
          keyCompatibility: 'Perfect match',
          bpmRange: '120-128 BPM'
        },
        actions: [
          { label: 'Start Remix', type: 'remix', icon: FiMusic },
          { label: 'Listen First', type: 'listen', icon: FiPlay }
        ]
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const filterOptions = [
    { key: 'all', label: 'All', icon: FiBell },
    { key: 'music', label: 'Music', icon: FiMusic },
    { key: 'social', label: 'Social', icon: FiUsers },
    { key: 'achievements', label: 'Achievements', icon: FiAward }
  ];

  const getFilteredNotifications = () => {
    if (activeFilter === 'all') return notifications;
    
    const filterMap = {
      music: ['track_milestone', 'trend_alert', 'remix_opportunity'],
      social: ['collaboration_request', 'fan_engagement'],
      achievements: ['track_milestone', 'fan_engagement']
    };
    
    return notifications.filter(notif => 
      filterMap[activeFilter]?.includes(notif.type)
    );
  };

  // Show toast notification
  const showToastMessage = (message, type = 'success') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  // Copy to clipboard helper
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  };

  // Enhanced action handlers
  const handleNotificationAction = async (notification, action) => {
    await logUserAction('notification_action_clicked', {
      notification_id: notification.id,
      notification_type: notification.type,
      action_type: action.type,
      action_label: action.label
    });

    // Handle different action types with full functionality
    switch (action.type) {
      case 'share':
        if (notification.type === 'track_milestone') {
          // Share achievement
          const shareText = `🎉 Just hit ${notification.musicData.milestone} on "${notification.musicData.trackTitle}"! Thank you to all my amazing fans! 🎵✨ #MusicMilestone #OviNetwork`;
          
          if (navigator.share) {
            try {
              await navigator.share({
                title: 'Music Achievement!',
                text: shareText,
                url: window.location.href
              });
              showToastMessage('Achievement shared successfully! 🎉');
            } catch (err) {
              if (err.name !== 'AbortError') {
                await copyToClipboard(shareText);
                showToastMessage('Share text copied to clipboard! 📋');
              }
            }
          } else {
            await copyToClipboard(shareText);
            showToastMessage('Share text copied to clipboard! 📋');
          }
        } else if (notification.type === 'fan_engagement') {
          // Share fan story
          const storyText = `Huge shoutout to @${notification.user.username} for sharing "${notification.musicData.sharedTrack}" with their amazing community! This is what music is all about - connecting people! 🙏❤️ #FanLove #MusicCommunity`;
          
          if (navigator.share) {
            try {
              await navigator.share({
                title: 'Fan Spotlight!',
                text: storyText,
                url: window.location.href
              });
              showToastMessage('Fan story shared successfully! ❤️');
            } catch (err) {
              if (err.name !== 'AbortError') {
                await copyToClipboard(storyText);
                showToastMessage('Story text copied to clipboard! 📋');
              }
            }
          } else {
            await copyToClipboard(storyText);
            showToastMessage('Story text copied to clipboard! 📋');
          }
        }
        break;

      case 'analytics':
        // View detailed analytics
        showToastMessage('Opening detailed analytics dashboard...', 'info');
        setTimeout(() => {
          // Simulate opening analytics dashboard
          const analyticsData = {
            track: notification.musicData.trackTitle,
            totalPlays: notification.musicData.milestone,
            growth: notification.musicData.growthRate,
            topCountries: notification.musicData.topCountries,
            genre: notification.musicData.genre
          };
          
          // In a real app, this would navigate to analytics page
          console.log('Analytics Dashboard Data:', analyticsData);
          showToastMessage(`Analytics loaded for "${notification.musicData.trackTitle}" 📊`);
        }, 1500);
        break;

      case 'accept':
        // Accept collaboration request
        showToastMessage('Processing collaboration request...', 'info');
        
        // Update notification to show accepted status
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notification.id 
              ? { 
                  ...notif, 
                  content: `✅ Collaboration accepted! You and ${notification.user.name} are now connected.`,
                  actions: [
                    { label: 'Start Project', type: 'start_project', icon: FiMusic },
                    { label: 'Message', type: 'message', icon: FiMessageCircle }
                  ]
                }
              : notif
          )
        );
        
        setTimeout(() => {
          showToastMessage(`🤝 Collaboration with ${notification.user.name} accepted!`);
        }, 1000);
        break;

      case 'profile':
        // View user profile
        showToastMessage(`Opening ${notification.user.name}'s profile...`, 'info');
        setTimeout(() => {
          // Simulate profile view
          const profileData = {
            name: notification.user.name,
            username: notification.user.username,
            followers: notification.user.followers,
            genre: notification.user.genre || notification.musicData?.proposedGenre
          };
          
          console.log('Profile Data:', profileData);
          showToastMessage(`Viewing @${notification.user.username}'s profile 👤`);
        }, 1000);
        break;

      case 'message':
        // Open message with user
        showToastMessage(`Opening chat with ${notification.user.name}...`, 'info');
        setTimeout(() => {
          // In a real app, this would open the messaging interface
          showToastMessage(`💬 Chat opened with @${notification.user.username}`);
        }, 1000);
        break;

      case 'thank':
        // Thank the fan
        const thankMessage = `Hey @${notification.user.username}! 🙏 Thank you so much for sharing "${notification.musicData.sharedTrack}" with your community! Your support means the world to me! ❤️🎵`;
        
        showToastMessage('Sending thank you message...', 'info');
        setTimeout(() => {
          // In a real app, this would send a direct message or create a post
          showToastMessage(`Thank you message sent to @${notification.user.username}! 💝`);
          
          // Update notification to show thanked status
          setNotifications(prev => 
            prev.map(notif => 
              notif.id === notification.id 
                ? { 
                    ...notif, 
                    content: `✅ You thanked ${notification.user.name} for sharing your track!`,
                    actions: [
                      { label: 'View Message', type: 'view_message', icon: FiEye },
                      { label: 'Share Story', type: 'share', icon: FiShare2 }
                    ]
                  }
                : notif
            )
          );
        }, 1500);
        break;

      case 'create':
        // Create new track
        showToastMessage('Opening music creation studio...', 'info');
        setTimeout(() => {
          const creationPrompt = `Perfect timing! ${notification.musicData.trendingGenre} is trending ${notification.musicData.growthPercentage}. Consider using these tags: ${notification.musicData.suggestedTags.join(', ')}`;
          
          console.log('Creation Prompt:', creationPrompt);
          showToastMessage('🎵 Music studio ready! Start creating your trending track!');
        }, 1500);
        break;

      case 'trends':
        // View trending data
        showToastMessage('Loading trending insights...', 'info');
        setTimeout(() => {
          const trendData = {
            genre: notification.musicData.trendingGenre,
            growth: notification.musicData.growthPercentage,
            position: notification.musicData.position,
            competition: notification.musicData.competitorActivity,
            opportunity: notification.musicData.opportunity
          };
          
          console.log('Trend Data:', trendData);
          showToastMessage(`📈 ${notification.musicData.trendingGenre} trending data loaded!`);
        }, 1000);
        break;

      case 'remix':
        // Start remix project
        showToastMessage('Initializing remix project...', 'info');
        setTimeout(() => {
          const remixData = {
            originalTrack: notification.musicData.originalTrack,
            artist: notification.user.name,
            suggestedStyle: notification.musicData.suggestedStyle,
            bpmRange: notification.musicData.bpmRange,
            keyMatch: notification.musicData.keyCompatibility
          };
          
          console.log('Remix Project Data:', remixData);
          showToastMessage(`🎛️ Remix project started for "${notification.musicData.originalTrack}"!`);
        }, 1500);
        break;

      case 'listen':
        // Listen to original track
        showToastMessage('Loading track preview...', 'info');
        setTimeout(() => {
          // Simulate track loading
          showToastMessage(`🎧 Now playing: "${notification.musicData.originalTrack}" by ${notification.user.name}`);
          
          // Update actions to show listened status
          setNotifications(prev => 
            prev.map(notif => 
              notif.id === notification.id 
                ? { 
                    ...notif, 
                    actions: [
                      { label: 'Start Remix', type: 'remix', icon: FiMusic },
                      { label: 'Download Stems', type: 'download', icon: FiDownload }
                    ]
                  }
                : notif
            )
          );
        }, 1000);
        break;

      case 'start_project':
        // Start collaboration project
        showToastMessage('Setting up collaboration workspace...', 'info');
        setTimeout(() => {
          showToastMessage(`🚀 Collaboration project with ${notification.user.name} is ready!`);
        }, 1500);
        break;

      case 'view_message':
        // View sent message
        showToastMessage('Opening sent messages...', 'info');
        setTimeout(() => {
          showToastMessage('📨 Message history loaded');
        }, 1000);
        break;

      case 'download':
        // Download stems or track
        showToastMessage('Preparing download...', 'info');
        setTimeout(() => {
          showToastMessage(`⬇️ "${notification.musicData.originalTrack}" stems ready for download!`);
        }, 1500);
        break;

      default:
        console.log('Action clicked:', action.type, notification);
        showToastMessage(`Action "${action.label}" executed successfully! ✅`);
    }

    // Mark notification as read after action
    markAsRead(notification.id);
  };

  const markAsRead = async (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    
    await logUserAction('notification_marked_read', { notification_id: notificationId });
  };

  const NotificationCard = ({ notification }) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-4 border-b border-smokey-700 hover:bg-smokey-800/30 transition-colors ${
          !notification.isRead ? 'bg-smokey-800/20' : ''
        }`}
      >
        <div className="flex items-start space-x-4">
          {/* Notification Icon/Avatar */}
          <div className="flex-shrink-0">
            {notification.user ? (
              <img
                src={notification.user.avatar}
                alt={notification.user.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                <SafeIcon 
                  icon={
                    notification.type === 'track_milestone' ? FiTrendingUp :
                    notification.type === 'collaboration_request' ? FiUsers :
                    notification.type === 'fan_engagement' ? FiHeart :
                    notification.type === 'trend_alert' ? FiTrendingUp :
                    notification.type === 'remix_opportunity' ? FiMusic : FiBell
                  } 
                  className="w-6 h-6 text-white" 
                />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">{notification.title}</h3>
                <p className="text-white/80 text-sm mt-1">{notification.content}</p>
              </div>
              <div className="flex items-center space-x-2 ml-3">
                {!notification.isRead && (
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.gradient}`} />
                )}
                <span className="text-white/60 text-xs whitespace-nowrap">{notification.timestamp}</span>
              </div>
            </div>

            {/* Music Data Enhancement */}
            {notification.musicData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`mt-3 p-3 bg-gradient-to-r ${theme.gradient} bg-opacity-10 rounded-lg border border-${theme.primary} border-opacity-20`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <SafeIcon icon={FiZap} className={`w-4 h-4 text-${theme.primary}`} />
                  <span className="text-white text-xs font-semibold">Ovi Insights</span>
                </div>

                {/* Track Milestone Details */}
                {notification.type === 'track_milestone' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">{notification.musicData.trackTitle}</span>
                      <span className="text-green-400 text-xs font-bold">{notification.musicData.growthRate}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-white/70">Milestone:</span>
                        <span className="text-white ml-1">{notification.musicData.milestone}</span>
                      </div>
                      <div>
                        <span className="text-white/70">Genre:</span>
                        <span className="text-white ml-1">{notification.musicData.genre}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-white/70 text-xs">Top Countries: </span>
                      <span className="text-white text-xs">{notification.musicData.topCountries.join(', ')}</span>
                    </div>
                  </div>
                )}

                {/* Collaboration Details */}
                {notification.type === 'collaboration_request' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">Collaboration Score</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-16 h-1 bg-smokey-600 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${theme.gradient}`}
                            style={{ width: `${notification.musicData.collaborationScore}%` }}
                          />
                        </div>
                        <span className={`text-${theme.primary} text-xs font-bold`}>
                          {notification.musicData.collaborationScore}%
                        </span>
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="text-white/70">Genre:</span>
                      <span className="text-white ml-1">{notification.musicData.proposedGenre}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-white/70">Combined Reach:</span>
                      <span className="text-white ml-1">{notification.musicData.estimatedReach}</span>
                    </div>
                  </div>
                )}

                {/* Fan Engagement Details */}
                {notification.type === 'fan_engagement' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">{notification.musicData.sharedTrack}</span>
                      <span className="text-green-400 text-xs font-bold">{notification.musicData.newPlays}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-white/70">Engagement:</span>
                        <span className="text-white ml-1">{notification.musicData.engagementBoost}</span>
                      </div>
                      <div>
                        <span className="text-white/70">Fan Loyalty:</span>
                        <span className="text-yellow-400 ml-1">{notification.musicData.fanLoyaltyScore}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trend Alert Details */}
                {notification.type === 'trend_alert' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">{notification.musicData.trendingGenre}</span>
                      <span className="text-green-400 text-xs font-bold">{notification.musicData.growthPercentage}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-white/70">Position:</span>
                        <span className="text-white ml-1">{notification.musicData.position}</span>
                      </div>
                      <div>
                        <span className="text-white/70">Competition:</span>
                        <span className="text-white ml-1">{notification.musicData.competitorActivity}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-white/70 text-xs">Suggested Tags: </span>
                      <span className="text-white text-xs">{notification.musicData.suggestedTags.join(', ')}</span>
                    </div>
                  </div>
                )}

                {/* Remix Opportunity Details */}
                {notification.type === 'remix_opportunity' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-medium">{notification.musicData.originalTrack}</span>
                      <span className="text-purple-400 text-xs font-bold">{notification.musicData.remixPotential}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-white/70">Style:</span>
                        <span className="text-white ml-1">{notification.musicData.suggestedStyle}</span>
                      </div>
                      <div>
                        <span className="text-white/70">BPM:</span>
                        <span className="text-white ml-1">{notification.musicData.bpmRange}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="text-white/70 text-xs">Key Match: </span>
                      <span className="text-green-400 text-xs">{notification.musicData.keyCompatibility}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Enhanced Action Buttons */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 mt-3">
                {notification.actions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNotificationAction(notification, action)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center space-x-1.5 shadow-lg ${
                      action.type === 'accept' 
                        ? 'bg-green-500 hover:bg-green-600 text-white border border-green-400'
                        : action.type === 'share'
                        ? 'bg-blue-500 hover:bg-blue-600 text-white border border-blue-400'
                        : action.type === 'thank'
                        ? 'bg-pink-500 hover:bg-pink-600 text-white border border-pink-400'
                        : action.type === 'analytics' || action.type === 'trends'
                        ? 'bg-purple-500 hover:bg-purple-600 text-white border border-purple-400'
                        : `bg-gradient-to-r ${theme.gradient} hover:shadow-xl text-white border border-${theme.primary} border-opacity-50`
                    }`}
                  >
                    <SafeIcon icon={action.icon} className="w-3.5 h-3.5" />
                    <span>{action.label}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Mark as Read */}
            {!notification.isRead && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="mt-3 text-white/60 hover:text-white text-xs transition-colors flex items-center space-x-1 group"
              >
                <SafeIcon icon={FiCheck} className="w-3 h-3 group-hover:text-green-400 transition-colors" />
                <span>Mark as read</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute inset-4 bg-smokey-900 border border-smokey-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-smokey-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-2xl font-bold flex items-center space-x-3">
                <SafeIcon icon={FiBell} className="w-7 h-7" />
                <span>Notifications</span>
              </h2>
              <button
                onClick={onClose}
                className="text-smokey-400 hover:text-white transition-colors p-2 hover:bg-smokey-800 rounded-full"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1">
              {filterOptions.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    activeFilter === filter.key
                      ? `bg-gradient-to-r ${theme.gradient} text-white`
                      : 'text-smokey-400 hover:text-white hover:bg-smokey-800'
                  }`}
                >
                  <SafeIcon icon={filter.icon} className="w-4 h-4" />
                  <span className="text-white">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {getFilteredNotifications().map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
            
            {getFilteredNotifications().length === 0 && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <SafeIcon icon={FiBell} className="w-16 h-16 text-smokey-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-white/60">You're all caught up!</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-smokey-700 flex items-center justify-between">
            <button
              onClick={() => {
                setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
                showToastMessage('All notifications marked as read! ✅');
              }}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center space-x-2 group"
            >
              <SafeIcon icon={FiCheckCircle} className="w-4 h-4 group-hover:text-green-400 transition-colors" />
              <span>Mark all as read</span>
            </button>
            <button 
              onClick={() => showToastMessage('Opening notification settings...', 'info')}
              className={`px-4 py-2 bg-gradient-to-r ${theme.gradient} text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2`}
            >
              <SafeIcon icon={FiSettings} className="w-4 h-4" />
              <span>Notification Settings</span>
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Toast Notifications */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-4 right-4 z-60 p-4 rounded-lg shadow-xl border max-w-sm ${
              showToast.type === 'success' 
                ? 'bg-green-600 border-green-500 text-white'
                : showToast.type === 'info'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-smokey-800 border-smokey-700 text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <SafeIcon 
                icon={
                  showToast.type === 'success' ? FiCheckCircle :
                  showToast.type === 'info' ? FiBell : FiSmile
                } 
                className="w-5 h-5" 
              />
              <span className="text-sm font-medium">{showToast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;
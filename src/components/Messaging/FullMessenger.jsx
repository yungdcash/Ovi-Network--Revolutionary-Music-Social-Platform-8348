import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiX, FiSearch, FiSend, FiPaperclip, FiMic, FiImage, FiMusic, FiPlay, 
  FiPause, FiHeart, FiShare2, FiMoreHorizontal, FiPhone, FiVideo,
  FiSmile, FiPlus, FiChevronLeft, FiVolume2, FiDownload, FiEye,
  FiClock, FiCheck, FiCheckCircle, FiCircle, FiZap, FiHeadphones,
  FiMessageCircle, FiPhoneCall, FiPhoneOff, FiVideoOff, FiMicOff,
  FiSettings, FiInfo, FiUserX, FiFlag, FiTrash2, FiArchive,
  FiStar, FiMute, FiBell, FiBellOff, FiCopy, FiEdit3, FiMaximize2,
  FiMinimize2, FiRotateCcw, FiWifi, FiWifiOff, FiSave, FiMail,
  FiCalendar, FiMapPin, FiUser, FiCheckSquare, FiSquare
} = FiIcons;

// Emoji Data
const EMOJI_CATEGORIES = {
  'Smileys & People': [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
    '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
    '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦',
    '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞',
    '😓', '😩', '😫', '🥱', '😤', '😡', '🤬', '😠', '🤯', '😈',
    '👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧓', '👴', '👵'
  ],
  'Animals & Nature': [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
    '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
    '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
    '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕',
    '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳',
    '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛',
    '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖',
    '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓'
  ],
  'Food & Drink': [
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈',
    '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦',
    '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔',
    '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🧀', '🥚', '🍳', '🧈',
    '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟',
    '🍕', '🫓', '🥙', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝',
    '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚',
    '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧'
  ],
  'Activities': [
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🪀',
    '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁',
    '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌',
    '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🏊',
    '🏄', '🚣', '🧗', '🚵', '🚴', '🏇', '🕴️', '🏆', '🥇', '🥈',
    '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🎭',
    '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷'
  ],
  'Objects': [
    '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️',
    '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
    '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️',
    '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋',
    '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴',
    '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🔧',
    '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧲', '🔫'
  ],
  'Symbols': [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
    '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
    '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
    '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳',
    '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️',
    '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️'
  ]
};

// Move MessageBubble outside to prevent re-creation
const MessageBubble = React.memo(({ message, theme }) => {
  const isMe = message.senderId === 'me';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-xs lg:max-w-md ${isMe ? 'order-2' : 'order-1'}`}>
        {/* Message Bubble */}
        <div className={`px-4 py-2 rounded-2xl ${
          isMe 
            ? `bg-gradient-to-r ${theme.gradient} text-white` 
            : 'bg-smokey-800 text-white'
        }`}>
          {message.type === 'text' && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
          
          {message.type === 'audio' && message.musicAttachment && (
            <div className="space-y-2">
              <p className="text-sm">{message.content}</p>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMusic} className="w-4 h-4" />
                    <span className="text-xs font-medium">{message.musicAttachment.title}</span>
                  </div>
                  <span className="text-xs opacity-75">{message.musicAttachment.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <SafeIcon icon={FiPlay} className="w-3 h-3" />
                  </button>
                  <div className="flex-1 h-1 bg-white/20 rounded-full">
                    <div className="w-1/3 h-full bg-white rounded-full"></div>
                  </div>
                  <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <SafeIcon icon={FiDownload} className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {message.musicAttachment?.type === 'collaboration_request' && (
            <div className="mt-2 p-3 bg-black/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <SafeIcon icon={FiZap} className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-400">Collaboration Request</span>
              </div>
              <div className="space-y-1 text-xs">
                <p><span className="font-medium">Genre:</span> {message.musicAttachment.genre}</p>
                <p><span className="font-medium">Your Role:</span> {message.musicAttachment.yourRole}</p>
                <p><span className="font-medium">Their Role:</span> {message.musicAttachment.theirRole}</p>
              </div>
              {!isMe && (
                <div className="flex space-x-2 mt-3">
                  <button className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-full text-xs font-medium transition-colors">
                    Accept
                  </button>
                  <button className="px-3 py-1 bg-smokey-600 hover:bg-smokey-700 rounded-full text-xs font-medium transition-colors">
                    Decline
                  </button>
                </div>
              )}
            </div>
          )}
          
          {message.musicAttachment?.type === 'track_reference' && (
            <div className="mt-2 p-3 bg-black/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <SafeIcon icon={FiHeadphones} className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold">Referenced Track</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">{message.musicAttachment.title}</p>
                  <p className="text-xs opacity-75">at {message.musicAttachment.timestamp}</p>
                </div>
                <button className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <SafeIcon icon={FiPlay} className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Message Info */}
        <div className={`flex items-center space-x-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span className="text-smokey-400 text-xs">{message.timestamp}</span>
          {isMe && (
            <SafeIcon 
              icon={message.status === 'read' ? FiCheckCircle : 
                    message.status === 'delivered' ? FiCheck : FiClock} 
              className={`w-3 h-3 ${
                message.status === 'read' ? 'text-blue-400' : 
                message.status === 'delivered' ? 'text-green-400' : 'text-smokey-400'
              }`} 
            />
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Edit Contact Modal Component
const EditContactModal = React.memo(({ isOpen, onClose, contact, theme, onSave }) => {
  const [editedContact, setEditedContact] = useState({
    name: '',
    nickname: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    company: '',
    jobTitle: '',
    birthday: '',
    notes: '',
    tags: [],
    isFavorite: false,
    isBlocked: false,
    notifications: {
      messages: true,
      calls: true,
      mentions: true
    },
    privacy: {
      showOnlineStatus: true,
      showLastSeen: true,
      allowCalls: true
    }
  });

  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('basic'); // basic, contact, preferences
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#8B5CF6');

  const colors = [
    '#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#8B5A2B', '#EC4899', '#6366F1', '#14B8A6', '#F97316'
  ];

  useEffect(() => {
    if (contact && isOpen) {
      // Fix for ESLint error: properly handle the nickname extraction
      const extractedNickname = contact.name ? contact.name.split(' ')[0] : '';
      
      setEditedContact({
        name: contact.name || '',
        nickname: extractedNickname,
        email: contact.username ? `${contact.username}@ovinetwork.com` : '',
        phone: '+1 (555) 123-4567',
        bio: 'Music producer and songwriter passionate about creating unique sounds.',
        location: 'Los Angeles, CA',
        company: 'OviNetwork Studios',
        jobTitle: 'Music Producer',
        birthday: '1995-06-15',
        notes: '',
        tags: ['Producer', 'Collaborator', 'Friend'],
        isFavorite: false,
        isBlocked: false,
        notifications: {
          messages: true,
          calls: true,
          mentions: true
        },
        privacy: {
          showOnlineStatus: true,
          showLastSeen: true,
          allowCalls: true
        }
      });
    }
  }, [contact, isOpen]);

  const handleSave = () => {
    onSave?.(editedContact);
    
    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg border border-green-500';
    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <span>✅ Contact "${editedContact.name}" updated successfully!</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 3000);
    
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedContact.tags.includes(newTag.trim())) {
      setEditedContact(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditedContact(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleNotificationToggle = (key) => {
    setEditedContact(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePrivacyToggle = (key) => {
    setEditedContact(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }));
  };

  if (!isOpen || !contact) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-smokey-900 border border-smokey-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-smokey-700">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-bold">Edit Contact</h2>
            <button
              onClick={onClose}
              className="p-2 text-smokey-400 hover:text-white hover:bg-smokey-800 rounded-full transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Preview */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="relative">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-16 h-16 rounded-full border-2 border-smokey-700"
              />
              <div 
                className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-smokey-900"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{editedContact.name || contact.name}</h3>
              <p className="text-smokey-400">@{contact.username}</p>
              <p className="text-smokey-300 text-sm">{editedContact.jobTitle}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4 bg-smokey-800 rounded-lg p-1">
            {[
              { id: 'basic', label: 'Basic Info', icon: FiUser },
              { id: 'contact', label: 'Contact', icon: FiMail },
              { id: 'preferences', label: 'Preferences', icon: FiSettings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${theme.gradient} text-white`
                    : 'text-smokey-400 hover:text-white'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  value={editedContact.name}
                  onChange={(e) => setEditedContact(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter display name"
                />
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Nickname</label>
                <input
                  type="text"
                  value={editedContact.nickname}
                  onChange={(e) => setEditedContact(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter nickname"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={editedContact.bio}
                  onChange={(e) => setEditedContact(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  placeholder="Enter bio"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Contact Color</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-white scale-110' 
                          : 'border-smokey-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {editedContact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 bg-gradient-to-r ${theme.gradient} bg-opacity-20 text-${theme.primary} text-sm rounded-full border border-${theme.primary} border-opacity-30 flex items-center space-x-2`}
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <SafeIcon icon={FiX} className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-4 py-2 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Add tag"
                  />
                  <button
                    onClick={handleAddTag}
                    className={`px-4 py-2 bg-gradient-to-r ${theme.gradient} text-white rounded-lg hover:scale-105 transition-transform`}
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Personal Notes</label>
                <textarea
                  value={editedContact.notes}
                  onChange={(e) => setEditedContact(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  placeholder="Add personal notes about this contact..."
                />
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={editedContact.email}
                  onChange={(e) => setEditedContact(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={editedContact.phone}
                  onChange={(e) => setEditedContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={editedContact.location}
                  onChange={(e) => setEditedContact(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter location"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Company</label>
                <input
                  type="text"
                  value={editedContact.company}
                  onChange={(e) => setEditedContact(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter company"
                />
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Job Title</label>
                <input
                  type="text"
                  value={editedContact.jobTitle}
                  onChange={(e) => setEditedContact(prev => ({ ...prev, jobTitle: e.target.value }))}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter job title"
                />
              </div>

              {/* Birthday */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Birthday</label>
                <input
                  type="date"
                  value={editedContact.birthday}
                  onChange={(e) => setEditedContact(prev => ({ ...prev, birthday: e.target.value }))}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Notifications */}
              <div>
                <h4 className="text-white font-semibold mb-3">Notifications</h4>
                <div className="space-y-3">
                  {[
                    { key: 'messages', label: 'Message Notifications', icon: FiMessageCircle },
                    { key: 'calls', label: 'Call Notifications', icon: FiPhone },
                    { key: 'mentions', label: 'Mention Notifications', icon: FiBell }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-smokey-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={item.icon} className="w-5 h-5 text-purple-400" />
                        <span className="text-white">{item.label}</span>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(item.key)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          editedContact.notifications[item.key] 
                            ? `bg-gradient-to-r ${theme.gradient}` 
                            : 'bg-smokey-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          editedContact.notifications[item.key] ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy */}
              <div>
                <h4 className="text-white font-semibold mb-3">Privacy</h4>
                <div className="space-y-3">
                  {[
                    { key: 'showOnlineStatus', label: 'Show Online Status', icon: FiEye },
                    { key: 'showLastSeen', label: 'Show Last Seen', icon: FiClock },
                    { key: 'allowCalls', label: 'Allow Calls', icon: FiPhone }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-smokey-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={item.icon} className="w-5 h-5 text-blue-400" />
                        <span className="text-white">{item.label}</span>
                      </div>
                      <button
                        onClick={() => handlePrivacyToggle(item.key)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          editedContact.privacy[item.key] 
                            ? `bg-gradient-to-r ${theme.gradient}` 
                            : 'bg-smokey-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          editedContact.privacy[item.key] ? 'translate-x-7' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-white font-semibold mb-3">Quick Actions</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setEditedContact(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      editedContact.isFavorite 
                        ? 'bg-red-500/20 border border-red-500/30' 
                        : 'bg-smokey-800/50 hover:bg-smokey-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiHeart} className={`w-5 h-5 ${editedContact.isFavorite ? 'text-red-400' : 'text-smokey-400'}`} />
                      <span className="text-white">Add to Favorites</span>
                    </div>
                    <SafeIcon 
                      icon={editedContact.isFavorite ? FiCheckSquare : FiSquare} 
                      className={`w-5 h-5 ${editedContact.isFavorite ? 'text-red-400' : 'text-smokey-400'}`} 
                    />
                  </button>

                  <button
                    onClick={() => setEditedContact(prev => ({ ...prev, isBlocked: !prev.isBlocked }))}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      editedContact.isBlocked 
                        ? 'bg-red-500/20 border border-red-500/30' 
                        : 'bg-smokey-800/50 hover:bg-smokey-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiUserX} className={`w-5 h-5 ${editedContact.isBlocked ? 'text-red-400' : 'text-smokey-400'}`} />
                      <span className="text-white">Block Contact</span>
                    </div>
                    <SafeIcon 
                      icon={editedContact.isBlocked ? FiCheckSquare : FiSquare} 
                      className={`w-5 h-5 ${editedContact.isBlocked ? 'text-red-400' : 'text-smokey-400'}`} 
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-smokey-700 bg-smokey-800/30">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-smokey-800 text-white rounded-lg hover:bg-smokey-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`flex-1 py-3 px-4 bg-gradient-to-r ${theme.gradient} text-white rounded-lg font-semibold hover:scale-105 transition-transform flex items-center justify-center space-x-2`}
            >
              <SafeIcon icon={FiSave} className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

// Emoji Picker Component
const EmojiPicker = React.memo(({ isOpen, onClose, onEmojiSelect, theme }) => {
  const [selectedCategory, setSelectedCategory] = useState('Smileys & People');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState(['😀', '😂', '❤️', '👍', '🔥', '🎵', '🎤', '🎧']);

  const filteredEmojis = useMemo(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
      return allEmojis.filter(emoji => {
        // Simple emoji name search (you could enhance this with emoji names)
        return emoji.includes(query) || 
               (query === 'heart' && '❤️💙💚💛💜🧡🖤🤍🤎'.includes(emoji)) ||
               (query === 'music' && '🎵🎶🎤🎧🎸🎹🥁🎷🎺'.includes(emoji)) ||
               (query === 'fire' && emoji === '🔥') ||
               (query === 'love' && '😍🥰😘💕💖💗💓💞'.includes(emoji));
      });
    }
    return EMOJI_CATEGORIES[selectedCategory] || [];
  }, [selectedCategory, searchQuery]);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    
    // Add to recent emojis
    setRecentEmojis(prev => {
      const newRecent = [emoji, ...prev.filter(e => e !== emoji)].slice(0, 8);
      return newRecent;
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="absolute bottom-full right-0 mb-2 w-80 h-96 bg-smokey-800 border border-smokey-700 rounded-lg shadow-xl z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 border-b border-smokey-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Emojis</h3>
          <button
            onClick={onClose}
            className="p-1 text-smokey-400 hover:text-white hover:bg-smokey-700 rounded-full transition-colors"
          >
            <SafeIcon icon={FiX} className="w-4 h-4" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-smokey-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search emojis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="px-3 py-2 border-b border-smokey-700">
          <div className="flex space-x-1 overflow-x-auto">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? `bg-gradient-to-r ${theme.gradient} text-white`
                    : 'text-smokey-400 hover:text-white hover:bg-smokey-700'
                }`}
              >
                {category.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Emojis */}
      {!searchQuery && (
        <div className="px-3 py-2 border-b border-smokey-700">
          <h4 className="text-smokey-400 text-xs font-medium mb-2">Recently Used</h4>
          <div className="grid grid-cols-8 gap-1">
            {recentEmojis.map((emoji, index) => (
              <button
                key={`recent-${index}`}
                onClick={() => handleEmojiClick(emoji)}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-smokey-700 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emoji Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-8 gap-1">
          {filteredEmojis.map((emoji, index) => (
            <button
              key={`${selectedCategory}-${index}`}
              onClick={() => handleEmojiClick(emoji)}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-smokey-700 rounded transition-colors"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
        
        {filteredEmojis.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-smokey-400 text-sm">No emojis found</p>
            <p className="text-smokey-500 text-xs">Try searching for "heart", "music", or "fire"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// Real-Time Call Modal Component with WebRTC
const RealTimeCallModal = React.memo(({ isOpen, onClose, contact, callType, theme }) => {
  const [callStatus, setCallStatus] = useState('initializing'); // initializing, connecting, ringing, connected, ended, failed
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('excellent'); // excellent, good, poor, disconnected
  
  // WebRTC and Media refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const durationRef = useRef(null);
  const qualityCheckRef = useRef(null);

  // Initialize WebRTC and get user media
  const initializeCall = useCallback(async () => {
    try {
      setCallStatus('initializing');
      
      // Get user media based on call type
      const constraints = {
        audio: true,
        video: callType === 'video'
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      
      if (localVideoRef.current && callType === 'video') {
        localVideoRef.current.srcObject = stream;
      }
      
      // Create peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };
      
      peerConnectionRef.current = new RTCPeerConnection(configuration);
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });
      
      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        remoteStreamRef.current = event.streams[0];
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      
      // Handle connection state changes
      peerConnectionRef.current.onconnectionstatechange = () => {
        const state = peerConnectionRef.current.connectionState;
        console.log('Connection state:', state);
        
        switch (state) {
          case 'connected':
            setCallStatus('connected');
            setConnectionQuality('excellent');
            startCallTimer();
            break;
          case 'connecting':
            setCallStatus('connecting');
            break;
          case 'disconnected':
            setConnectionQuality('poor');
            break;
          case 'failed':
            setCallStatus('failed');
            setConnectionQuality('disconnected');
            break;
          case 'closed':
            setCallStatus('ended');
            break;
        }
      };
      
      // Simulate call flow
      setCallStatus('connecting');
      
      // Simulate ringing
      setTimeout(() => {
        if (peerConnectionRef.current?.connectionState !== 'closed') {
          setCallStatus('ringing');
        }
      }, 1500);
      
      // Simulate call answer (in real app, this would be triggered by remote peer)
      setTimeout(() => {
        if (peerConnectionRef.current?.connectionState !== 'closed') {
          setCallStatus('connected');
          startCallTimer();
          startQualityMonitoring();
        }
      }, 4000);
      
    } catch (error) {
      console.error('Error initializing call:', error);
      setCallStatus('failed');
      
      // Handle specific errors
      if (error.name === 'NotAllowedError') {
        alert('Camera/microphone access denied. Please allow access and try again.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera/microphone found. Please check your devices.');
      } else {
        alert('Failed to initialize call. Please check your connection and try again.');
      }
    }
  }, [callType]);

  // Start call duration timer
  const startCallTimer = useCallback(() => {
    durationRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  }, []);

  // Monitor connection quality
  const startQualityMonitoring = useCallback(() => {
    qualityCheckRef.current = setInterval(async () => {
      if (peerConnectionRef.current) {
        const stats = await peerConnectionRef.current.getStats();
        
        // Simulate quality based on random factors (in real app, analyze actual stats)
        const qualities = ['excellent', 'good', 'poor'];
        const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
        setConnectionQuality(randomQuality);
      }
    }, 5000);
  }, []);

  // Initialize call when modal opens
  useEffect(() => {
    if (isOpen) {
      initializeCall();
    }
    
    return () => {
      cleanup();
    };
  }, [isOpen, initializeCall]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Stop timers
    if (durationRef.current) {
      clearInterval(durationRef.current);
      durationRef.current = null;
    }
    
    if (qualityCheckRef.current) {
      clearInterval(qualityCheckRef.current);
      qualityCheckRef.current = null;
    }
    
    // Stop media streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => track.stop());
      remoteStreamRef.current = null;
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  }, []);

  // Format call duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  // Handle video toggle
  const handleVideoToggle = useCallback(() => {
    if (localStreamRef.current && callType === 'video') {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, [callType]);

  // Handle end call
  const handleEndCall = useCallback(() => {
    setCallStatus('ended');
    cleanup();
    
    setTimeout(() => {
      onClose();
      // Reset states
      setCallStatus('initializing');
      setCallDuration(0);
      setIsMuted(false);
      setIsVideoOff(false);
      setIsFullscreen(false);
      setConnectionQuality('excellent');
    }, 1500);
  }, [onClose, cleanup]);

  // Handle fullscreen toggle
  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Handle call retry
  const handleRetry = useCallback(() => {
    cleanup();
    initializeCall();
  }, [cleanup, initializeCall]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center ${
        isFullscreen ? 'bg-black' : ''
      }`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`bg-smokey-900 border border-smokey-700 rounded-2xl shadow-2xl overflow-hidden ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-none' 
            : callType === 'video' 
              ? 'w-full max-w-4xl h-full max-h-3xl mx-4' 
              : 'max-w-md w-full mx-4'
        }`}
      >
        {/* Call Header */}
        <div className="p-4 border-b border-smokey-700 bg-smokey-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={contact?.avatar}
                alt={contact?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-white font-semibold">{contact?.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionQuality === 'excellent' ? 'bg-green-500' :
                    connectionQuality === 'good' ? 'bg-yellow-500' :
                    connectionQuality === 'poor' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-smokey-400 text-xs capitalize">
                    {callStatus === 'initializing' && 'Initializing...'}
                    {callStatus === 'connecting' && 'Connecting...'}
                    {callStatus === 'ringing' && 'Ringing...'}
                    {callStatus === 'connected' && formatDuration(callDuration)}
                    {callStatus === 'ended' && 'Call ended'}
                    {callStatus === 'failed' && 'Connection failed'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Connection Quality Indicator */}
              <div className="flex items-center space-x-1">
                <SafeIcon 
                  icon={connectionQuality === 'disconnected' ? FiWifiOff : FiWifi} 
                  className={`w-4 h-4 ${
                    connectionQuality === 'excellent' ? 'text-green-400' :
                    connectionQuality === 'good' ? 'text-yellow-400' :
                    connectionQuality === 'poor' ? 'text-red-400' : 'text-gray-400'
                  }`} 
                />
              </div>
              
              {/* Fullscreen Toggle (Video Only) */}
              {callType === 'video' && (
                <button
                  onClick={handleFullscreenToggle}
                  className="p-2 text-smokey-400 hover:text-white hover:bg-smokey-700 rounded-full transition-colors"
                >
                  <SafeIcon icon={isFullscreen ? FiMinimize2 : FiMaximize2} className="w-4 h-4" />
                </button>
              )}
              
              {/* Close Button */}
              {!isFullscreen && (
                <button
                  onClick={handleEndCall}
                  className="p-2 text-smokey-400 hover:text-white hover:bg-smokey-700 rounded-full transition-colors"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Video Call Content */}
        {callType === 'video' && (
          <div className={`relative ${isFullscreen ? 'h-full' : 'h-96'} bg-black`}>
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${
                callStatus === 'connected' ? 'block' : 'hidden'
              }`}
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-32 h-24 bg-smokey-800 rounded-lg overflow-hidden border-2 border-smokey-600">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 bg-smokey-800 flex items-center justify-center">
                  <SafeIcon icon={FiVideoOff} className="w-6 h-6 text-smokey-400" />
                </div>
              )}
            </div>
            
            {/* Call Status Overlay */}
            {callStatus !== 'connected' && (
              <div className="absolute inset-0 bg-smokey-900/80 flex items-center justify-center">
                <div className="text-center">
                  <img
                    src={contact?.avatar}
                    alt={contact?.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-smokey-700"
                  />
                  <h3 className="text-white text-2xl font-semibold mb-2">{contact?.name}</h3>
                  
                  {/* Status Indicators */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {callStatus === 'initializing' && (
                      <>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-blue-400">Initializing camera...</span>
                      </>
                    )}
                    {callStatus === 'connecting' && (
                      <>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
                        <span className="text-yellow-400">Connecting...</span>
                      </>
                    )}
                    {callStatus === 'ringing' && (
                      <>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400">Ringing...</span>
                      </>
                    )}
                    {callStatus === 'failed' && (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-400">Connection failed</span>
                      </>
                    )}
                    {callStatus === 'ended' && (
                      <>
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span className="text-gray-400">Call ended</span>
                      </>
                    )}
                  </div>
                  
                  {/* Retry Button for Failed Calls */}
                  {callStatus === 'failed' && (
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <SafeIcon icon={FiRotateCcw} className="w-4 h-4" />
                      <span>Retry</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Voice Call Content */}
        {callType === 'voice' && (
          <div className="p-8 text-center">
            <img
              src={contact?.avatar}
              alt={contact?.name}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-smokey-700"
            />
            <h3 className="text-white text-2xl font-semibold mb-2">{contact?.name}</h3>
            
            {/* Call Status */}
            <div className="mb-8">
              {callStatus === 'initializing' && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-400">Initializing...</span>
                </div>
              )}
              {callStatus === 'connecting' && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
                  <span className="text-yellow-400">Connecting...</span>
                </div>
              )}
              {callStatus === 'ringing' && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400">Ringing...</span>
                </div>
              )}
              {callStatus === 'connected' && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-400">{formatDuration(callDuration)}</span>
                </div>
              )}
              {callStatus === 'failed' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-400">Connection failed</span>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <SafeIcon icon={FiRotateCcw} className="w-4 h-4" />
                    <span>Retry</span>
                  </button>
                </div>
              )}
              {callStatus === 'ended' && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-400">Call ended</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="p-6 border-t border-smokey-700 bg-smokey-800/30">
          <div className="flex items-center justify-center space-x-6">
            {/* Mute Button */}
            <button
              onClick={handleMuteToggle}
              disabled={callStatus !== 'connected'}
              className={`p-4 rounded-full transition-all ${
                isMuted 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : callStatus === 'connected'
                    ? 'bg-smokey-800 text-smokey-400 hover:text-white hover:bg-smokey-700'
                    : 'bg-smokey-800 text-smokey-600 cursor-not-allowed'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <SafeIcon icon={isMuted ? FiMicOff : FiMic} className="w-6 h-6" />
            </button>

            {/* Video Toggle (Video Calls Only) */}
            {callType === 'video' && (
              <button
                onClick={handleVideoToggle}
                disabled={callStatus !== 'connected'}
                className={`p-4 rounded-full transition-all ${
                  isVideoOff 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : callStatus === 'connected'
                      ? 'bg-smokey-800 text-smokey-400 hover:text-white hover:bg-smokey-700'
                      : 'bg-smokey-800 text-smokey-600 cursor-not-allowed'
                }`}
                title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
              >
                <SafeIcon icon={isVideoOff ? FiVideoOff : FiVideo} className="w-6 h-6" />
              </button>
            )}

            {/* End Call Button */}
            <button
              onClick={handleEndCall}
              className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all hover:scale-105 shadow-lg"
              title="End Call"
            >
              <SafeIcon icon={FiPhoneOff} className="w-6 h-6" />
            </button>
          </div>

          {/* Call Type and Quality Indicator */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <SafeIcon 
                icon={callType === 'video' ? FiVideo : FiPhone} 
                className={`w-4 h-4 text-${theme.primary}`} 
              />
              <span className="text-smokey-400 capitalize">{callType} Call</span>
            </div>
            
            {callStatus === 'connected' && (
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionQuality === 'excellent' ? 'bg-green-500' :
                  connectionQuality === 'good' ? 'bg-yellow-500' :
                  connectionQuality === 'poor' ? 'bg-red-500' : 'bg-gray-500'
                }`} />
                <span className="text-smokey-400 capitalize">{connectionQuality}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

// Menu Dropdown Component
const MenuDropdown = React.memo(({ isOpen, onClose, contact, theme, onAction }) => {
  const menuItems = [
    { icon: FiInfo, label: 'Contact Info', action: 'info', color: 'text-blue-400' },
    { icon: FiBell, label: 'Mute Notifications', action: 'mute', color: 'text-yellow-400' },
    { icon: FiStar, label: 'Add to Favorites', action: 'favorite', color: 'text-yellow-400' },
    { icon: FiArchive, label: 'Archive Chat', action: 'archive', color: 'text-smokey-400' },
    { icon: FiCopy, label: 'Copy Username', action: 'copy', color: 'text-purple-400' },
    { icon: FiEdit3, label: 'Edit Contact', action: 'edit', color: 'text-green-400' },
    { icon: FiFlag, label: 'Report User', action: 'report', color: 'text-red-400' },
    { icon: FiUserX, label: 'Block User', action: 'block', color: 'text-red-500' },
    { icon: FiTrash2, label: 'Delete Chat', action: 'delete', color: 'text-red-600' }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute top-full right-0 mt-2 w-56 bg-smokey-800 border border-smokey-700 rounded-lg shadow-xl z-50 overflow-hidden"
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => onAction(item.action)}
          className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-smokey-700 transition-colors group"
        >
          <SafeIcon icon={item.icon} className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
          <span className="text-white text-sm">{item.label}</span>
        </button>
      ))}
    </motion.div>
  );
});

const FullMessenger = ({ onClose, initialConversationId = null }) => {
  const { theme } = useTheme();
  const { user, logUserAction } = useAuth();
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  // New states for call and menu functionality
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState('voice'); // 'voice' or 'video'
  const [showMenu, setShowMenu] = useState(false);
  const [showEditContact, setShowEditContact] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageInputRef = useRef(null);
  const recordingTimeoutRef = useRef(null);
  const menuRef = useRef(null);
  const emojiPickerRef = useRef(null);
  
  // Mock conversations data
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        user: { 
          name: 'Alex Rivera', 
          username: 'alexmusic', 
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          isOnline: true,
          lastSeen: 'Online now'
        },
        lastMessage: 'Hey! Love your latest track. Want to collaborate?',
        timestamp: '5 min ago',
        unreadCount: 2,
        isTyping: false,
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
          lastSeen: '2 hours ago'
        },
        lastMessage: 'The beat drop at 1:30 is incredible! 🔥',
        timestamp: '2 hours ago',
        unreadCount: 0,
        isTyping: false,
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
          lastSeen: 'Online now'
        },
        lastMessage: 'Just dropped a new beat, check it out! 🎵',
        timestamp: '1 hour ago',
        unreadCount: 1,
        isTyping: false,
        musicContext: {
          sharedTrack: { title: 'Street Symphony', artist: 'Marcus Johnson', genre: 'Hip-Hop' },
          collaborationScore: 88,
          fanEngagement: 'growing'
        }
      }
    ];
    
    setConversations(mockConversations);
    
    if (initialConversationId) {
      const conversation = mockConversations.find(c => c.id === initialConversationId);
      if (conversation) {
        setActiveConversation(conversation);
        loadMessages(conversation.id);
      }
    }
  }, [initialConversationId]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showMenu || showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu, showEmojiPicker]);

  // Mock messages for active conversation
  const loadMessages = useCallback((conversationId) => {
    const mockMessages = {
      1: [
        {
          id: 1,
          senderId: 1,
          senderName: 'Alex Rivera',
          content: 'Hey! I just listened to your track "Urban Flow" and it\'s absolutely incredible! 🎵',
          timestamp: '10:30 AM',
          type: 'text',
          status: 'read',
          musicAttachment: null
        },
        {
          id: 2,
          senderId: 'me',
          senderName: 'You',
          content: 'Thank you so much! That means a lot coming from you 🙏✨',
          timestamp: '10:32 AM',
          type: 'text',
          status: 'read',
          musicAttachment: null
        },
        {
          id: 3,
          senderId: 1,
          senderName: 'Alex Rivera',
          content: 'I think we could create something amazing together. Want to collaborate on a track? 🚀',
          timestamp: '10:35 AM',
          type: 'text',
          status: 'read',
          musicAttachment: {
            type: 'collaboration_request',
            title: 'Collaboration Proposal',
            genre: 'Lo-Fi Hip-Hop',
            estimatedDuration: '3-4 minutes',
            yourRole: 'Producer/Beat Maker',
            theirRole: 'Vocalist/Rapper'
          }
        },
        {
          id: 4,
          senderId: 1,
          senderName: 'Alex Rivera',
          content: 'Check out this rough demo I made inspired by your style 🎧',
          timestamp: '10:40 AM',
          type: 'audio',
          status: 'delivered',
          musicAttachment: {
            type: 'audio_track',
            title: 'Demo - Urban Dreams',
            duration: '2:15',
            waveform: 'data:audio/wav;base64,mock-waveform-data',
            fileSize: '3.2 MB'
          }
        }
      ],
      2: [
        {
          id: 1,
          senderId: 2,
          senderName: 'Emma Stone',
          content: 'OMG! That beat drop at 1:30 in "Midnight Vibes" gave me chills! 🔥✨',
          timestamp: '8:15 AM',
          type: 'text',
          status: 'read',
          musicAttachment: {
            type: 'track_reference',
            title: 'Midnight Vibes',
            timestamp: '1:30',
            emotion: 'excited',
            reaction: 'mind_blown'
          }
        },
        {
          id: 2,
          senderId: 'me',
          senderName: 'You',
          content: 'So glad you loved it! That section took me hours to perfect 😄🎶',
          timestamp: '8:18 AM',
          type: 'text',
          status: 'read',
          musicAttachment: null
        }
      ]
    };
    
    setMessages(mockMessages[conversationId] || []);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate real-time typing
  useEffect(() => {
    if (activeConversation && Math.random() > 0.8) {
      const interval = setInterval(() => {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === activeConversation.id 
              ? { ...conv, isTyping: !conv.isTyping }
              : conv
          )
        );
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [activeConversation]);

  // Cleanup recording timeout on unmount
  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    };
  }, []);

  // Real-time call handlers
  const handleVoiceCall = useCallback(async () => {
    if (!activeConversation) return;
    
    // Check for microphone permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setCallType('voice');
      setShowCallModal(true);
      
      // Log voice call action
      if (logUserAction) {
        try {
          await logUserAction('voice_call_initiated', {
            recipient: activeConversation.user.username,
            recipient_id: activeConversation.id,
            call_type: 'voice',
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.warn('Failed to log voice call action:', error);
        }
      }
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Microphone access is required for voice calls. Please allow access and try again.');
    }
  }, [activeConversation, logUserAction]);

  const handleVideoCall = useCallback(async () => {
    if (!activeConversation) return;
    
    // Check for camera and microphone permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      
      setCallType('video');
      setShowCallModal(true);
      
      // Log video call action
      if (logUserAction) {
        try {
          await logUserAction('video_call_initiated', {
            recipient: activeConversation.user.username,
            recipient_id: activeConversation.id,
            call_type: 'video',
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.warn('Failed to log video call action:', error);
        }
      }
    } catch (error) {
      console.error('Camera/microphone access denied:', error);
      alert('Camera and microphone access are required for video calls. Please allow access and try again.');
    }
  }, [activeConversation, logUserAction]);

  const handleMenuToggle = useCallback(() => {
    setShowMenu(!showMenu);
  }, [showMenu]);

  const handleMenuAction = useCallback(async (action) => {
    setShowMenu(false);
    
    switch (action) {
      case 'info':
        alert(`Contact Info:\nName: ${activeConversation?.user?.name}\nUsername: @${activeConversation?.user?.username}\nStatus: ${activeConversation?.user?.isOnline ? 'Online' : 'Offline'}`);
        break;
      case 'mute':
        alert('Notifications muted for this conversation');
        break;
      case 'favorite':
        alert(`${activeConversation?.user?.name} added to favorites`);
        break;
      case 'archive':
        alert('Conversation archived');
        break;
      case 'copy':
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(`@${activeConversation?.user?.username}`);
          alert('Username copied to clipboard');
        }
        break;
      case 'edit':
        setShowEditContact(true);
        break;
      case 'report':
        if (confirm(`Report ${activeConversation?.user?.name} for inappropriate behavior?`)) {
          alert('User reported. Thank you for keeping our community safe.');
        }
        break;
      case 'block':
        if (confirm(`Block ${activeConversation?.user?.name}? They won't be able to message you.`)) {
          alert(`${activeConversation?.user?.name} has been blocked`);
        }
        break;
      case 'delete':
        if (confirm(`Delete conversation with ${activeConversation?.user?.name}? This cannot be undone.`)) {
          alert('Conversation deleted');
        }
        break;
      default:
        break;
    }
    
    // Log menu action
    if (logUserAction) {
      try {
        await logUserAction('messenger_menu_action', {
          action: action,
          conversation_id: activeConversation?.id,
          recipient: activeConversation?.user.username
        });
      } catch (error) {
        console.warn('Failed to log menu action:', error);
      }
    }
  }, [activeConversation, logUserAction]);

  // Handle contact edit save
  const handleContactEditSave = useCallback((editedContact) => {
    // Update the contact in conversations
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversation?.id 
          ? { 
              ...conv, 
              user: { 
                ...conv.user, 
                name: editedContact.name || conv.user.name 
              } 
            }
          : conv
      )
    );
    
    // Update active conversation
    if (activeConversation) {
      setActiveConversation(prev => ({
        ...prev,
        user: {
          ...prev.user,
          name: editedContact.name || prev.user.name
        }
      }));
    }
  }, [activeConversation]);

  // Handle emoji selection
  const handleEmojiSelect = useCallback((emoji) => {
    const cursorPosition = messageInputRef.current?.selectionStart || newMessage.length;
    const textBefore = newMessage.substring(0, cursorPosition);
    const textAfter = newMessage.substring(cursorPosition);
    const newText = textBefore + emoji + textAfter;
    
    setNewMessage(newText);
    
    // Set cursor position after emoji
    setTimeout(() => {
      if (messageInputRef.current) {
        const newCursorPosition = cursorPosition + emoji.length;
        messageInputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        messageInputRef.current.focus();
      }
    }, 0);
  }, [newMessage]);

  // Stabilized message input handler
  const handleMessageChange = useCallback((e) => {
    setNewMessage(e.target.value);
  }, []);

  // Stabilized send message handler
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() && !attachmentPreview) return;
    
    const messageData = {
      id: Date.now(),
      senderId: 'me',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: attachmentPreview ? attachmentPreview.type : 'text',
      status: 'sending',
      musicAttachment: attachmentPreview
    };
    
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
    setAttachmentPreview(null);
    setShowEmojiPicker(false);
    
    // Focus back to input after sending
    setTimeout(() => {
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }, 50);
    
    // Log message sent
    if (logUserAction) {
      try {
        await logUserAction('message_sent', {
          conversation_id: activeConversation?.id,
          message_type: messageData.type,
          has_music_attachment: !!attachmentPreview,
          has_emojis: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(newMessage),
          recipient: activeConversation?.user.username
        });
      } catch (error) {
        console.warn('Failed to log user action:', error);
      }
    }
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageData.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    }, 1000);
  }, [newMessage, attachmentPreview, activeConversation, logUserAction]);

  // Stabilized key press handler
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Stabilized file upload handler
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const fileType = file.type.startsWith('audio/') ? 'audio' : 
                    file.type.startsWith('image/') ? 'image' : 'file';
    
    setAttachmentPreview({
      type: fileType,
      file: file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      preview: fileType === 'image' ? URL.createObjectURL(file) : null
    });
  }, []);

  // Stabilized conversation click handler
  const handleConversationClick = useCallback((conversation) => {
    setActiveConversation(conversation);
    loadMessages(conversation.id);
  }, [loadMessages]);

  // Stabilized attachment preview removal
  const removeAttachmentPreview = useCallback(() => {
    setAttachmentPreview(null);
  }, []);

  // Stabilized file input click
  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Enhanced recording handlers - FIXED TO ONLY RECORD ON PRESS AND HOLD
  const startRecording = useCallback(() => {
    console.log('🎤 Recording started');
    setIsRecording(true);
    
    // Clear any existing timeout
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }
    
    // Auto-stop recording after 60 seconds (safety measure)
    recordingTimeoutRef.current = setTimeout(() => {
      console.log('🎤 Recording auto-stopped (60s limit)');
      setIsRecording(false);
    }, 60000);
  }, []);

  const stopRecording = useCallback(() => {
    console.log('🎤 Recording stopped');
    setIsRecording(false);
    
    // Clear the timeout
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    
    // Here you would typically process the recorded audio
    // For now, we'll just create a mock voice message
    if (isRecording) {
      const voiceMessage = {
        id: Date.now(),
        senderId: 'me',
        senderName: 'You',
        content: 'Voice message',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'audio',
        status: 'sending',
        musicAttachment: {
          type: 'voice_message',
          title: 'Voice Message',
          duration: '0:05',
          waveform: 'data:audio/wav;base64,mock-voice-data',
          fileSize: '0.8 MB'
        }
      };
      
      setMessages(prev => [...prev, voiceMessage]);
      
      // Simulate delivery
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === voiceMessage.id 
              ? { ...msg, status: 'delivered' }
              : msg
          )
        );
      }, 1000);
    }
  }, [isRecording]);

  // Prevent context menu on right-click for mic button
  const handleMicContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Handle mouse events for recording - FIXED BEHAVIOR
  const handleMicMouseDown = useCallback((e) => {
    e.preventDefault();
    startRecording();
  }, [startRecording]);

  const handleMicMouseUp = useCallback((e) => {
    e.preventDefault();
    stopRecording();
  }, [stopRecording]);

  // Handle touch events for mobile
  const handleMicTouchStart = useCallback((e) => {
    e.preventDefault();
    startRecording();
  }, [startRecording]);

  const handleMicTouchEnd = useCallback((e) => {
    e.preventDefault();
    stopRecording();
  }, [stopRecording]);

  // Emoji picker toggle
  const handleEmojiPickerToggle = useCallback(() => {
    setShowEmojiPicker(!showEmojiPicker);
  }, [showEmojiPicker]);

  // Memoized ConversationList component
  const ConversationList = useMemo(() => (
    <div className="w-1/3 border-r border-smokey-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-smokey-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">Messages</h2>
          <button
            onClick={onClose}
            className="text-smokey-400 hover:text-white transition-colors p-2 hover:bg-smokey-800 rounded-full"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-smokey-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
          />
        </div>
      </div>
      
      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations
          .filter(conv => 
            conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((conversation) => (
          <motion.div
            key={conversation.id}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            className={`p-4 border-b border-smokey-800 cursor-pointer transition-colors ${
              activeConversation?.id === conversation.id ? 'bg-smokey-800/50' : ''
            }`}
            onClick={() => handleConversationClick(conversation)}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar with Online Status */}
              <div className="relative">
                <img
                  src={conversation.user.avatar}
                  alt={conversation.user.name}
                  className="w-12 h-12 rounded-full"
                />
                {conversation.user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-smokey-900 rounded-full" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold truncate">{conversation.user.name}</h3>
                  <div className="flex items-center space-x-2">
                    {conversation.unreadCount > 0 && (
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{conversation.unreadCount}</span>
                      </div>
                    )}
                    <span className="text-smokey-400 text-xs">{conversation.timestamp}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <p className="text-smokey-300 text-sm truncate">
                    {conversation.isTyping ? (
                      <span className="text-purple-400 italic">typing...</span>
                    ) : (
                      conversation.lastMessage
                    )}
                  </p>
                </div>
                
                {/* Music Context Preview */}
                {conversation.musicContext && (
                  <div className="mt-2 p-2 bg-smokey-800/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMusic} className={`w-3 h-3 text-${theme.primary}`} />
                      <span className="text-white text-xs font-medium">
                        {conversation.musicContext.currentTrack?.title || 
                         conversation.musicContext.sharedTrack?.title || 
                         'Music Context'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  ), [conversations, searchQuery, activeConversation, theme, onClose, handleConversationClick]);

  // Memoized ChatArea component
  const ChatArea = useMemo(() => (
    <div className="flex-1 flex flex-col">
      {activeConversation ? (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-smokey-700 bg-smokey-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={activeConversation.user.avatar}
                    alt={activeConversation.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {activeConversation.user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-smokey-900 rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{activeConversation.user.name}</h3>
                  <p className="text-smokey-400 text-xs">
                    {activeConversation.user.isOnline ? 'Online now' : activeConversation.user.lastSeen}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 relative" ref={menuRef}>
                {/* Voice Call Button */}
                <button 
                  onClick={handleVoiceCall}
                  className="p-2 text-smokey-400 hover:text-green-400 hover:bg-smokey-800 rounded-full transition-all group"
                  title="Voice Call"
                >
                  <SafeIcon icon={FiPhone} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                
                {/* Video Call Button */}
                <button 
                  onClick={handleVideoCall}
                  className="p-2 text-smokey-400 hover:text-blue-400 hover:bg-smokey-800 rounded-full transition-all group"
                  title="Video Call"
                >
                  <SafeIcon icon={FiVideo} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                
                {/* Menu Button */}
                <button 
                  onClick={handleMenuToggle}
                  className={`p-2 rounded-full transition-all group ${
                    showMenu 
                      ? `text-${theme.primary} bg-smokey-800` 
                      : 'text-smokey-400 hover:text-white hover:bg-smokey-800'
                  }`}
                  title="More Options"
                >
                  <SafeIcon icon={FiMoreHorizontal} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                
                {/* Menu Dropdown */}
                <MenuDropdown 
                  isOpen={showMenu}
                  onClose={() => setShowMenu(false)}
                  contact={activeConversation.user}
                  theme={theme}
                  onAction={handleMenuAction}
                />
              </div>
            </div>
            
            {/* Music Context Bar */}
            {activeConversation.musicContext && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`mt-3 p-3 bg-gradient-to-r ${theme.gradient} bg-opacity-20 rounded-lg border border-${theme.primary} border-opacity-30`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiMusic} className={`w-5 h-5 text-${theme.primary}`} />
                    <div>
                      <p className="text-white text-sm font-medium">
                        {activeConversation.musicContext.currentTrack?.title || 'Music Context Active'}
                      </p>
                      <p className="text-smokey-300 text-xs">
                        Collaboration Score: {activeConversation.musicContext.collaborationScore}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activeConversation.musicContext.sharedGenres?.map((genre, index) => (
                      <span key={index} className={`px-2 py-1 bg-${theme.primary} bg-opacity-20 text-${theme.primary} text-xs rounded-full`}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} theme={theme} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Recording Indicator */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-4 py-2 bg-red-500/20 border-t border-red-500/30"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-sm font-medium">Recording voice message...</span>
                <span className="text-red-300 text-xs">Release to send</span>
              </div>
            </motion.div>
          )}
          
          {/* Message Input */}
          <div className="p-4 border-t border-smokey-700">
            {/* Attachment Preview */}
            {attachmentPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-3 p-3 bg-smokey-800 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <SafeIcon 
                      icon={attachmentPreview.type === 'audio' ? FiMusic : FiImage} 
                      className="w-5 h-5 text-purple-400" 
                    />
                    <div>
                      <p className="text-white text-sm font-medium">{attachmentPreview.name}</p>
                      <p className="text-smokey-400 text-xs">{attachmentPreview.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeAttachmentPreview}
                    className="text-smokey-400 hover:text-white transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
            
            <div className="flex items-end space-x-3">
              {/* Attachment Button */}
              <button
                onClick={handleFileInputClick}
                className="p-3 text-smokey-400 hover:text-white hover:bg-smokey-800 rounded-full transition-colors flex-shrink-0"
                title="Attach File"
              >
                <SafeIcon icon={FiPaperclip} className="w-5 h-5" />
              </button>
              
              {/* Message Input */}
              <div className="flex-1 relative">
                <textarea
                  ref={messageInputRef}
                  value={newMessage}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 bg-smokey-800 border border-smokey-700 rounded-2xl text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  style={{ 
                    minHeight: '48px', 
                    maxHeight: '120px',
                    lineHeight: '1.4'
                  }}
                />
                
                {/* Emoji Button */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2" ref={emojiPickerRef}>
                  <button 
                    onClick={handleEmojiPickerToggle}
                    className={`text-smokey-400 hover:text-white transition-colors p-1 rounded ${
                      showEmojiPicker ? 'text-yellow-400 bg-smokey-700' : ''
                    }`}
                    title="Add Emoji"
                  >
                    <SafeIcon icon={FiSmile} className="w-4 h-4" />
                  </button>
                  
                  {/* Emoji Picker */}
                  <AnimatePresence>
                    <EmojiPicker
                      isOpen={showEmojiPicker}
                      onClose={() => setShowEmojiPicker(false)}
                      onEmojiSelect={handleEmojiSelect}
                      theme={theme}
                    />
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Voice Record Button - FIXED BEHAVIOR */}
              <button
                onMouseDown={handleMicMouseDown}
                onMouseUp={handleMicMouseUp}
                onTouchStart={handleMicTouchStart}
                onTouchEnd={handleMicTouchEnd}
                onContextMenu={handleMicContextMenu}
                className={`p-3 rounded-full transition-all flex-shrink-0 select-none ${
                  isRecording 
                    ? `bg-gradient-to-r ${theme.gradient} text-white scale-110 shadow-lg` 
                    : 'text-smokey-400 hover:text-white hover:bg-smokey-800'
                }`}
                title={isRecording ? "Recording... Release to send" : "Hold to record voice message"}
              >
                <SafeIcon icon={FiMic} className="w-5 h-5" />
              </button>
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={(!newMessage.trim() && !attachmentPreview) || isRecording}
                className={`p-3 rounded-full transition-all flex-shrink-0 ${
                  (newMessage.trim() || attachmentPreview) && !isRecording
                    ? `bg-gradient-to-r ${theme.gradient} text-white hover:scale-105`
                    : 'text-smokey-400 bg-smokey-800'
                }`}
                title="Send Message"
              >
                <SafeIcon icon={FiSend} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <SafeIcon icon={FiMessageCircle} className="w-16 h-16 text-smokey-400 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">Select a conversation</h3>
            <p className="text-smokey-400">Choose a conversation to start messaging</p>
          </div>
        </div>
      )}
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,image/*,.mp3,.wav,.jpg,.jpeg,.png"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  ), [
    activeConversation, 
    messages, 
    attachmentPreview, 
    newMessage, 
    isRecording, 
    showMenu,
    showEmojiPicker,
    theme,
    handleMessageChange,
    handleKeyPress,
    handleSendMessage,
    handleFileInputClick,
    removeAttachmentPreview,
    handleMicMouseDown,
    handleMicMouseUp,
    handleMicTouchStart,
    handleMicTouchEnd,
    handleMicContextMenu,
    handleFileUpload,
    handleVoiceCall,
    handleVideoCall,
    handleMenuToggle,
    handleMenuAction,
    handleEmojiPickerToggle,
    handleEmojiSelect
  ]);

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
          className="absolute inset-4 bg-smokey-900 border border-smokey-700 rounded-2xl shadow-2xl overflow-hidden flex"
        >
          {ConversationList}
          {ChatArea}
        </motion.div>
      </motion.div>

      {/* Real-Time Call Modal */}
      <AnimatePresence>
        <RealTimeCallModal
          isOpen={showCallModal}
          onClose={() => setShowCallModal(false)}
          contact={activeConversation?.user}
          callType={callType}
          theme={theme}
        />
      </AnimatePresence>

      {/* Edit Contact Modal */}
      <AnimatePresence>
        <EditContactModal
          isOpen={showEditContact}
          onClose={() => setShowEditContact(false)}
          contact={activeConversation?.user}
          theme={theme}
          onSave={handleContactEditSave}
        />
      </AnimatePresence>
    </>
  );
};

export default FullMessenger;
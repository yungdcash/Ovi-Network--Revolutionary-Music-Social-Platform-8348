import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import { supabase } from '../../lib/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiMessageCircle, FiSearch, FiUsers, FiSend, FiMusic, FiHeart, FiMoreHorizontal } = FiIcons;

const MessagingPage = () => {
  const { theme } = useTheme();
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      
      // Set up real-time subscription for messages
      const subscription = supabase
        .channel(`messages-${selectedConversation.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages_ovi2024',
          filter: `conversation_id=eq.${selectedConversation.id}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new]);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations_ovi2024')
        .select(`
          *,
          messages_ovi2024!inner (
            id,
            content,
            created_at,
            sender_id,
            user_profiles_ovi2024!inner (
              username,
              full_name,
              profile_photo
            )
          )
        `)
        .contains('participants', [user.id])
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages_ovi2024')
        .select(`
          *,
          user_profiles_ovi2024 (
            username,
            full_name,
            profile_photo
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabase
        .from('messages_ovi2024')
        .insert([{
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: 'text'
        }]);

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      // Update conversation's last message timestamp
      await supabase
        .from('conversations_ovi2024')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      setNewMessage('');
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${theme.primary} mx-auto mb-4`}></div>
          <p className="text-smokey-300">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800">
      <div className="flex h-screen">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-smokey-800/50 backdrop-blur-sm border-r border-smokey-700">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
            
            {/* Search */}
            <div className="relative mb-6">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-smokey-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Conversations List */}
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`inline-block p-4 rounded-full bg-gradient-to-r ${theme.gradient} mb-4`}>
                    <SafeIcon icon={FiMessageCircle} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No conversations yet</h3>
                  <p className="text-smokey-400 text-sm">Start a conversation with other users to see them here.</p>
                </div>
              ) : (
                conversations
                  .filter(conv => 
                    searchQuery === '' || 
                    conv.messages_ovi2024.some(msg => 
                      msg.user_profiles_ovi2024.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      msg.user_profiles_ovi2024.full_name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  )
                  .map((conversation) => {
                    const otherParticipant = conversation.participants.find(p => p !== user.id);
                    const lastMessage = conversation.messages_ovi2024[conversation.messages_ovi2024.length - 1];
                    
                    return (
                      <motion.div
                        key={conversation.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedConversation?.id === conversation.id
                            ? `bg-gradient-to-r ${theme.gradient} bg-opacity-20 border-${theme.primary}`
                            : 'bg-smokey-700/50 hover:bg-smokey-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <SafeIcon icon={FiUsers} className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {lastMessage?.user_profiles_ovi2024?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-smokey-400 text-sm truncate">
                              {lastMessage?.content || 'No messages yet'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 bg-smokey-800/50 backdrop-blur-sm border-b border-smokey-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <SafeIcon icon={FiUsers} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Conversation</h2>
                      <p className="text-smokey-400 text-sm">{selectedConversation.participants.length} participants</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-smokey-700 transition-colors"
                  >
                    <SafeIcon icon={FiMoreHorizontal} className="w-5 h-5 text-smokey-400" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className={`inline-block p-4 rounded-full bg-gradient-to-r ${theme.gradient} mb-4`}>
                      <SafeIcon icon={FiMessageCircle} className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Start the conversation</h3>
                    <p className="text-smokey-400 text-sm">Send a message to get the conversation started.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender_id === user.id
                          ? `bg-gradient-to-r ${theme.gradient} text-white`
                          : 'bg-smokey-700 text-white'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === user.id ? 'text-white/70' : 'text-smokey-400'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-6 bg-smokey-800/50 backdrop-blur-sm border-t border-smokey-700">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-full text-white placeholder-smokey-400 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-3 rounded-full bg-gradient-to-r ${theme.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
                      !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <SafeIcon icon={FiSend} className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className={`inline-block p-6 rounded-full bg-gradient-to-r ${theme.gradient} mb-6`}>
                  <SafeIcon icon={FiMessageCircle} className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Select a conversation</h3>
                <p className="text-smokey-400 max-w-md">
                  Choose a conversation from the sidebar to start messaging, or start a new conversation with someone.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
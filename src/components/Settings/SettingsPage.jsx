import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiPalette, FiUser, FiBell, FiShield, FiLogOut, FiChevronRight } = FiIcons;

const SettingsPage = () => {
  const { theme, themes, changeTheme, currentTheme } = useTheme();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('theme');

  const settingSections = [
    { id: 'theme', title: 'Theme & Appearance', icon: FiPalette },
    { id: 'profile', title: 'Profile Settings', icon: FiUser },
    { id: 'notifications', title: 'Notifications', icon: FiBell },
    { id: 'privacy', title: 'Privacy & Security', icon: FiShield },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex-1 p-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-2">
          <SafeIcon icon={FiSettings} className={`w-8 h-8 text-${theme.primary}`} />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>
        <p className="text-smokey-400">Customize your Ovi Network experience</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700 p-4">
            <nav className="space-y-2">
              {settingSections.map((section) => (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? `bg-gradient-to-r ${theme.gradient} text-white`
                      : 'text-smokey-400 hover:text-white hover:bg-smokey-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={section.icon} className="w-5 h-5" />
                    <span className="font-medium">{section.title}</span>
                  </div>
                  <SafeIcon icon={FiChevronRight} className="w-4 h-4" />
                </motion.button>
              ))}
              
              <div className="border-t border-smokey-700 pt-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-300"
                >
                  <SafeIcon icon={FiLogOut} className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </nav>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-smokey-800/50 backdrop-blur-lg rounded-xl border border-smokey-700 p-6">
            {activeSection === 'theme' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Theme & Appearance</h2>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Color Theme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(themes).map(([key, themeOption]) => (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => changeTheme(key)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          currentTheme === key
                            ? `border-${themeOption.primary} bg-gradient-to-br ${themeOption.gradient} bg-opacity-20`
                            : 'border-smokey-700 bg-smokey-700/50 hover:border-smokey-600'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${themeOption.gradient} shadow-lg`}></div>
                          <h4 className="text-white font-semibold">{themeOption.name}</h4>
                          <div className="flex space-x-2">
                            <div className={`w-3 h-3 rounded-full bg-${themeOption.primary}`}></div>
                            <div className="w-3 h-3 rounded-full bg-smokey-600"></div>
                            <div className={`w-3 h-3 rounded-full bg-${themeOption.accent}`}></div>
                          </div>
                        </div>
                        
                        {currentTheme === key && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-3 text-center"
                          >
                            <span className={`text-${themeOption.primary} text-sm font-bold`}>✓ Active</span>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Profile Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Display Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-${theme.primary} transition-colors"
                      placeholder="Your display name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Bio</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 bg-smokey-700 border border-smokey-600 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-${theme.primary} transition-colors resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-lg`}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  {[
                    { title: 'New Followers', description: 'Get notified when someone follows you' },
                    { title: 'Track Likes', description: 'Get notified when someone likes your tracks' },
                    { title: 'Comments', description: 'Get notified when someone comments on your posts' },
                    { title: 'Earnings Updates', description: 'Get notified about your earnings milestones' },
                  ].map((notification, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-smokey-700/50 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">{notification.title}</h4>
                        <p className="text-smokey-400 text-sm">{notification.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className={`relative w-11 h-6 bg-smokey-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:${theme.gradient}`}></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">Privacy & Security</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-smokey-700/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Account Privacy</h4>
                    <p className="text-smokey-400 text-sm mb-3">Control who can see your profile and content</p>
                    <select className="w-full px-4 py-2 bg-smokey-600 border border-smokey-500 rounded-lg text-white focus:outline-none focus:border-${theme.primary}">
                      <option>Public</option>
                      <option>Friends Only</option>
                      <option>Private</option>
                    </select>
                  </div>
                  
                  <div className="p-4 bg-smokey-700/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Data Export</h4>
                    <p className="text-smokey-400 text-sm mb-3">Download a copy of your data</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-smokey-600 text-white rounded-lg hover:bg-smokey-500 transition-colors"
                    >
                      Request Data Export
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
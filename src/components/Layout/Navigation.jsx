import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiSearch, FiMusic, FiUser, FiHeart, FiMessageCircle, FiTrendingUp, FiSettings, FiMenu, FiX } = FiIcons;

const Navigation = ({ activeTab, setActiveTab, isMobile = false }) => {
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', icon: FiHome, label: 'Home' },
    { id: 'search', icon: FiSearch, label: 'Search' },
    { id: 'trending', icon: FiTrendingUp, label: 'Trending' },
    { id: 'music', icon: FiMusic, label: 'Music' },
    { id: 'messages', icon: FiMessageCircle, label: 'Messages' },
    { id: 'profile', icon: FiUser, label: 'Profile' },
  ];

  const NavItem = ({ item, isActive, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg` 
          : 'text-smokey-400 hover:text-white hover:bg-smokey-800'
      }`}
    >
      <SafeIcon icon={item.icon} className="w-6 h-6" />
      {!isMobile && <span className="font-medium">{item.label}</span>}
    </motion.button>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-smokey-900/95 backdrop-blur-lg border-t border-smokey-700">
          <div className="flex justify-around items-center py-2">
            {navItems.slice(0, 5).map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`fixed top-4 right-4 z-50 p-3 rounded-full bg-gradient-to-r ${theme.gradient} text-white shadow-lg`}
        >
          <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
        </motion.button>

        {/* Mobile Side Menu */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: isMenuOpen ? 0 : '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 w-80 bg-smokey-900/95 backdrop-blur-lg border-l border-smokey-700 z-40 p-6"
        >
          <div className="space-y-4 mt-16">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                }}
              />
            ))}
            <div className="border-t border-smokey-700 pt-4">
              <NavItem
                item={{ id: 'settings', icon: FiSettings, label: 'Settings' }}
                isActive={activeTab === 'settings'}
                onClick={() => {
                  setActiveTab('settings');
                  setIsMenuOpen(false);
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Overlay */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-30"
          />
        )}
      </>
    );
  }

  // Desktop Navigation
  return (
    <div className="w-64 h-screen bg-smokey-900/95 backdrop-blur-lg border-r border-smokey-700 p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-3"
        >
          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.gradient} flex items-center justify-center`}>
            <SafeIcon icon={FiMusic} className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Ovi Network</span>
        </motion.div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavItem
              item={item}
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          </motion.div>
        ))}
      </nav>

      {/* Settings */}
      <div className="border-t border-smokey-700 pt-4">
        <NavItem
          item={{ id: 'settings', icon: FiSettings, label: 'Settings' }}
          isActive={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        />
      </div>
    </div>
  );
};

export default Navigation;
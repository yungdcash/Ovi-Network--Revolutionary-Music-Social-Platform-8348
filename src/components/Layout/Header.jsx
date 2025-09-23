import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiBell, FiMessageCircle, FiUser, FiMusic } = FiIcons;

const Header = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="bg-smokey-900/95 backdrop-blur-lg border-b border-smokey-700 p-4">
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-smokey-400 hover:text-white transition-colors"
              >
                <SafeIcon icon={FiBell} className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-smokey-400 hover:text-white transition-colors"
              >
                <SafeIcon icon={FiMessageCircle} className="w-6 h-6" />
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
  );
};

export default Header;
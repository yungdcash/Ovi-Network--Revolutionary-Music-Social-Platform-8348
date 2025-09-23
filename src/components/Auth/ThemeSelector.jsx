import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSelector = ({ onThemeSelect }) => {
  const { themes, currentTheme } = useTheme();

  const themeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, y: -5 }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Theme</h2>
        <p className="text-smokey-400">Select a color theme that reflects your vibe</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(themes).map(([key, theme], index) => (
          <motion.div
            key={key}
            variants={themeVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              currentTheme === key 
                ? `border-${theme.primary} bg-gradient-to-br ${theme.gradient} bg-opacity-20` 
                : 'border-smokey-700 bg-smokey-800 hover:border-smokey-600'
            }`}
            onClick={() => onThemeSelect(key)}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.gradient} shadow-lg`}></div>
              <h3 className="text-lg font-semibold text-white">{theme.name}</h3>
              <div className="flex space-x-2">
                <div className={`w-3 h-3 rounded-full bg-${theme.primary}`}></div>
                <div className="w-3 h-3 rounded-full bg-smokey-600"></div>
                <div className={`w-3 h-3 rounded-full bg-${theme.accent}`}></div>
              </div>
            </div>
            
            {currentTheme === key && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
              >
                <div className={`w-3 h-3 bg-${theme.primary} rounded-full`}></div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
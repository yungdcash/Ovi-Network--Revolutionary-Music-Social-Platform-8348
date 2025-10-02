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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {Object.entries(themes).map(([key, theme], index) => (
          <motion.div
            key={key}
            variants={themeVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
              currentTheme === key 
                ? `border-${theme.primary} bg-gradient-to-br ${theme.gradient} bg-opacity-20 shadow-lg` 
                : 'border-smokey-700 bg-smokey-800/50 hover:border-smokey-600 hover:bg-smokey-700/50'
            }`}
            onClick={() => onThemeSelect(key)}
            style={{
              boxShadow: currentTheme === key 
                ? `0 0 20px ${theme.glowColor}20, 0 4px 20px rgba(0,0,0,0.3)` 
                : '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <div className="flex flex-col items-center space-y-3">
              {/* Main theme preview circle */}
              <div 
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.gradient} shadow-lg ring-2 ring-white/10`}
                style={{
                  boxShadow: `0 0 15px ${theme.glowColor}40`
                }}
              ></div>
              
              {/* Theme name */}
              <h3 className="text-lg font-semibold text-white">{theme.name}</h3>
              
              {/* Color palette dots */}
              <div className="flex space-x-2">
                <div 
                  className={`w-3 h-3 rounded-full bg-${theme.primary} ring-1 ring-white/20`}
                ></div>
                <div className="w-3 h-3 rounded-full bg-smokey-600 ring-1 ring-white/20"></div>
                <div 
                  className={`w-3 h-3 rounded-full bg-${theme.accent} ring-1 ring-white/20`}
                ></div>
              </div>
              
              {/* Theme description */}
              <p className="text-xs text-smokey-400 text-center">
                {key === 'emerald' && 'Fresh & Natural'}
                {key === 'cobalt' && 'Cool & Professional'}
                {key === 'magenta' && 'Bold & Creative'}
                {key === 'crimson' && 'Passionate & Energetic'}
                {key === 'tangerine' && 'Warm & Vibrant'}
                {key === 'lemon' && 'Bright & Optimistic'}
              </p>
            </div>
            
            {/* Selection indicator */}
            {currentTheme === key && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <div 
                  className={`w-4 h-4 bg-${theme.primary} rounded-full`}
                  style={{
                    boxShadow: `0 0 8px ${theme.glowColor}`
                  }}
                ></div>
              </motion.div>
            )}
            
            {/* Hover glow effect */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${theme.glowColor}10 0%, transparent 70%)`
              }}
            ></div>
          </motion.div>
        ))}
      </div>
      
      {/* Theme preview text */}
      <div className="text-center mt-8">
        <p className="text-smokey-500 text-sm">
          You can change your theme anytime in settings
        </p>
      </div>
    </div>
  );
};

export default ThemeSelector;
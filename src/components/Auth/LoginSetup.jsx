import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeSelector from './ThemeSelector';
import FloatingElements from '../3D/FloatingElements';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMusic, FiUsers, FiDollarSign, FiArrowRight, FiCheck } = FiIcons;

const LoginSetup = () => {
  const { theme, changeTheme, completeSetup } = useTheme();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: ''
  });

  const handleThemeSelect = (selectedTheme) => {
    changeTheme(selectedTheme);
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(3);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleComplete = () => {
    const userData = {
      ...formData,
      userType,
      theme: theme.name,
      joinDate: new Date().toISOString()
    };
    
    login(userData);
    completeSetup();
  };

  const userTypes = [
    {
      type: 'artist',
      title: 'Artist',
      description: 'Share your music and connect with fans',
      icon: FiMusic,
      features: ['Upload tracks', 'Real-time streaming', 'Fan engagement', 'Earnings dashboard']
    },
    {
      type: 'fan',
      title: 'Music Fan',
      description: 'Discover new music and support artists',
      icon: FiUsers,
      features: ['Discover music', 'Follow artists', 'Social features', 'Exclusive content']
    },
    {
      type: 'producer',
      title: 'Producer',
      description: 'Collaborate and monetize your beats',
      icon: FiDollarSign,
      features: ['Beat marketplace', 'Collaboration tools', 'Revenue sharing', 'Analytics']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800 relative overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="text-center space-y-8"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`inline-block p-4 rounded-full bg-gradient-to-br ${theme.gradient} shadow-2xl`}
                  >
                    <SafeIcon icon={FiMusic} className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <h1 className="text-5xl md:text-6xl font-bold text-white">
                    Welcome to <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradient}`}>Ovi Network</span>
                  </h1>
                  
                  <p className="text-xl text-smokey-300 max-w-2xl mx-auto">
                    The world's first revolutionary real-time social media music networking platform. 
                    Stream, connect, and earn like never before.
                  </p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(2)}
                  className={`px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto`}
                >
                  <span>Get Started</span>
                  <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="theme"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-8"
              >
                <ThemeSelector onThemeSelect={handleThemeSelect} />
                
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(3)}
                    className={`px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2`}
                  >
                    <span>Continue</span>
                    <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="usertype"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">Choose Your Role</h2>
                  <p className="text-smokey-400">How do you want to experience Ovi Network?</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {userTypes.map((type, index) => (
                    <motion.div
                      key={type.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => handleUserTypeSelect(type.type)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        userType === type.type 
                          ? `border-${theme.primary} bg-gradient-to-br ${theme.gradient} bg-opacity-20` 
                          : 'border-smokey-700 bg-smokey-800 hover:border-smokey-600'
                      }`}
                    >
                      <div className="text-center space-y-4">
                        <div className={`inline-block p-3 rounded-full bg-gradient-to-br ${theme.gradient}`}>
                          <SafeIcon icon={type.icon} className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white">{type.title}</h3>
                        <p className="text-smokey-400">{type.description}</p>
                        
                        <ul className="space-y-2 text-sm">
                          {type.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-smokey-300">
                              <SafeIcon icon={FiCheck} className={`w-4 h-4 text-${theme.primary}`} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="max-w-md mx-auto space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">Create Your Profile</h2>
                  <p className="text-smokey-400">Let's set up your Ovi Network identity</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-500 focus:outline-none focus:border-${theme.primary} transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-500 focus:outline-none focus:border-${theme.primary} transition-colors"
                      placeholder="Choose a unique username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-500 focus:outline-none focus:border-${theme.primary} transition-colors"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  disabled={!formData.fullName || !formData.username || !formData.email}
                  className={`w-full px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                >
                  <span>Complete Setup</span>
                  <SafeIcon icon={FiCheck} className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step >= num ? `bg-${theme.primary}` : 'bg-smokey-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginSetup;
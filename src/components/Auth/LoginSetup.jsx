import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import ThemeSelector from './ThemeSelector';
import FloatingElements from '../3D/FloatingElements';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMusic, FiUsers, FiDollarSign, FiArrowRight, FiArrowLeft, FiCheck, FiEye, FiEyeOff, FiLock, FiShield, FiLogIn } = FiIcons;

const LoginSetup = () => {
  const { theme, changeTheme, completeSetup } = useTheme();
  const { login, logUserAction } = useAuth();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const handleThemeSelect = (selectedTheme) => {
    changeTheme(selectedTheme);
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handleContinueToProfile = () => {
    setStep(4);
  };

  const handleBack = () => {
    if (isSigningIn) {
      setIsSigningIn(false);
      setSignInData({ email: '', password: '' });
    } else {
      setStep(step - 1);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignInInputChange = (e) => {
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignInClick = () => {
    setIsSigningIn(true);
  };

  const handleSignIn = async () => {
    if (!signInData.email || !signInData.password) return;
    
    try {
      // Mock sign-in logic - in a real app, this would validate against a database
      const userData = {
        email: signInData.email,
        username: signInData.email.split('@')[0],
        fullName: 'Existing User',
        userType: 'fan',
        theme: theme.name,
        joinDate: new Date().toISOString(),
        isReturningUser: true
      };
      
      // Log the successful login action
      await logUserAction('login', {
        user_email: signInData.email,
        user_username: userData.username,
        user_full_name: userData.fullName,
        user_type: userData.userType,
        selected_theme: theme.name,
        login_method: 'email_password',
        is_returning_user: true,
        login_timestamp: new Date().toISOString(),
        device_info: {
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          platform: navigator.platform,
          language: navigator.language
        },
        session_data: {
          referrer: document.referrer || 'direct',
          session_start: new Date().toISOString()
        }
      });

      // Complete the login process
      login(userData);
      completeSetup();
    } catch (error) {
      console.error('Error logging sign-in action:', error);
      
      // Still complete login even if logging fails
      const userData = {
        email: signInData.email,
        username: signInData.email.split('@')[0],
        fullName: 'Existing User',
        userType: 'fan',
        theme: theme.name,
        joinDate: new Date().toISOString(),
        isReturningUser: true
      };
      
      login(userData);
      completeSetup();
    }
  };

  // Password validation functions
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Very Weak', color: 'text-red-500' };
      case 2: return { text: 'Weak', color: 'text-orange-500' };
      case 3: return { text: 'Fair', color: 'text-yellow-500' };
      case 4: return { text: 'Good', color: 'text-blue-500' };
      case 5: return { text: 'Strong', color: 'text-green-500' };
      default: return { text: 'Very Weak', color: 'text-red-500' };
    }
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthInfo = getPasswordStrengthText(passwordStrength);
  const isFormValid = formData.fullName && formData.username && formData.email && formData.password && formData.confirmPassword && passwordsMatch && passwordStrength >= 3;
  const isSignInValid = signInData.email && signInData.password;

  const handleComplete = async () => {
    if (!isFormValid) return;
    
    setIsCreatingAccount(true);
    
    try {
      // Create user account directly without email verification
      const userData = {
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        userType,
        theme: theme.name,
        joinDate: new Date().toISOString(),
        emailVerified: false // No email verification required
      };
      
      // Log successful sign-up
      await logUserAction('sign_up', {
        user_email: formData.email,
        user_username: formData.username,
        user_full_name: formData.fullName,
        user_type: userType,
        selected_theme: theme.name,
        signup_method: 'email_password',
        account_creation_timestamp: new Date().toISOString(),
        email_verification_completed: false,
        password_strength: passwordStrength,
        password_strength_text: passwordStrengthInfo.text,
        onboarding_completion: {
          theme_selection_completed: true,
          role_selection_completed: true,
          profile_creation_completed: true,
          email_verification_completed: false,
          setup_duration: Date.now()
        },
        user_preferences: {
          selected_user_type: userType,
          theme_preference: theme.name,
          profile_completeness: 100
        },
        device_info: {
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          platform: navigator.platform,
          language: navigator.language
        },
        form_data_validation: {
          email_format_valid: /\S+@\S+\.\S+/.test(formData.email),
          username_length: formData.username.length,
          full_name_provided: !!formData.fullName,
          password_meets_requirements: passwordStrength >= 3,
          passwords_match: passwordsMatch,
          email_verified: false
        }
      });
      
      // Complete signup immediately
      login(userData);
      completeSetup();
      
    } catch (error) {
      console.error('Error creating account:', error);
      
      // Still complete signup even if logging fails
      const userData = {
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        userType,
        theme: theme.name,
        joinDate: new Date().toISOString(),
        emailVerified: false
      };
      
      login(userData);
      completeSetup();
    } finally {
      setIsCreatingAccount(false);
    }
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
            {step === 1 && !isSigningIn && (
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

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(2)}
                    className={`px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto`}
                  >
                    <span>Get Started</span>
                    <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSignInClick}
                    className="px-8 py-4 bg-smokey-800 hover:bg-smokey-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto border border-smokey-600"
                  >
                    <SafeIcon icon={FiLogIn} className="w-5 h-5" />
                    <span>Sign In</span>
                  </motion.button>

                  <p className="text-smokey-500 text-sm">
                    Already have an account? Sign in to continue your journey.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 1 && isSigningIn && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="max-w-md mx-auto space-y-8"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`inline-block p-3 rounded-full bg-gradient-to-br ${theme.gradient} mb-4`}
                  >
                    <SafeIcon icon={FiLogIn} className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                  <p className="text-smokey-400">Sign in to your Ovi Network account</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={signInData.email}
                      onChange={handleSignInInputChange}
                      className={`w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-500 focus:outline-none focus:border-${theme.primary} transition-colors`}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-smokey-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showSignInPassword ? "text" : "password"}
                        name="password"
                        value={signInData.password}
                        onChange={handleSignInInputChange}
                        className={`w-full px-4 py-3 pr-12 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-500 focus:outline-none focus:border-${theme.primary} transition-colors`}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-smokey-400 hover:text-white transition-colors"
                      >
                        <SafeIcon icon={showSignInPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left text-sm text-smokey-400 hover:text-white transition-colors"
                  >
                    Forgot your password?
                  </motion.button>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center space-x-4">
                  {/* Back Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    className="px-6 py-3 bg-smokey-800 hover:bg-smokey-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 border border-smokey-600"
                  >
                    <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
                    <span>Back</span>
                  </motion.button>

                  {/* Sign In Button */}
                  <motion.button
                    whileHover={isSignInValid ? { scale: 1.05 } : {}}
                    whileTap={isSignInValid ? { scale: 0.95 } : {}}
                    onClick={handleSignIn}
                    disabled={!isSignInValid}
                    className={`flex-1 px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
                      !isSignInValid ? 'opacity-50 cursor-not-allowed' : ''
                    } flex items-center justify-center space-x-2`}
                  >
                    <SafeIcon icon={FiLogIn} className="w-5 h-5" />
                    <span>Sign In</span>
                  </motion.button>
                </div>

                <div className="text-center">
                  <p className="text-smokey-500 text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setIsSigningIn(false)}
                      className={`text-${theme.primary} hover:underline font-medium`}
                    >
                      Get Started
                    </button>
                  </p>
                </div>
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
                
                <div className="flex justify-between items-center">
                  {/* Back Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    className="px-6 py-3 bg-smokey-800 hover:bg-smokey-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 border border-smokey-600"
                  >
                    <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
                    <span>Back</span>
                  </motion.button>

                  {/* Continue Button */}
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

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                  {/* Back Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    className="px-6 py-3 bg-smokey-800 hover:bg-smokey-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 border border-smokey-600"
                  >
                    <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
                    <span>Back</span>
                  </motion.button>

                  {/* Continue Button */}
                  <motion.button
                    whileHover={userType ? { scale: 1.05 } : {}}
                    whileTap={userType ? { scale: 0.95 } : {}}
                    onClick={handleContinueToProfile}
                    disabled={!userType}
                    className={`px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 ${
                      !userType ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span>Continue to Profile</span>
                    <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="max-w-lg mx-auto space-y-8"
              >
                <div className="text-center">
                  <div className={`inline-block p-3 rounded-full bg-gradient-to-br ${theme.gradient} mb-4`}>
                    <SafeIcon icon={FiShield} className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Create Your Profile</h2>
                  <p className="text-smokey-400">Set up your Ovi Network account</p>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <SafeIcon icon={FiUsers} className="w-5 h-5" />
                      <span>Personal Information</span>
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-smokey-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-500 focus:outline-none focus:border-${theme.primary} transition-colors`}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-smokey-300 mb-2">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-500 focus:outline-none focus:border-${theme.primary} transition-colors`}
                        placeholder="Choose a unique username"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-smokey-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-500 focus:outline-none focus:border-${theme.primary} transition-colors`}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Security Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <SafeIcon icon={FiLock} className="w-5 h-5" />
                      <span>Account Security</span>
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-smokey-300 mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-500 focus:outline-none focus:border-${theme.primary} transition-colors`}
                          placeholder="Create a strong password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-smokey-400 hover:text-white transition-colors"
                        >
                          <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-smokey-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  passwordStrength <= 2 ? 'bg-red-500' :
                                  passwordStrength === 3 ? 'bg-yellow-500' :
                                  passwordStrength === 4 ? 'bg-blue-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${passwordStrengthInfo.color}`}>
                              {passwordStrengthInfo.text}
                            </span>
                          </div>
                          
                          <div className="text-xs text-smokey-400 space-y-1">
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={formData.password.length >= 8 ? FiCheck : FiArrowRight} 
                                className={`w-3 h-3 ${formData.password.length >= 8 ? 'text-green-500' : 'text-smokey-500'}`} />
                              <span>At least 8 characters</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={/[A-Z]/.test(formData.password) ? FiCheck : FiArrowRight} 
                                className={`w-3 h-3 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-smokey-500'}`} />
                              <span>One uppercase letter</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={/[0-9]/.test(formData.password) ? FiCheck : FiArrowRight} 
                                className={`w-3 h-3 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-smokey-500'}`} />
                              <span>One number</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={/[^A-Za-z0-9]/.test(formData.password) ? FiCheck : FiArrowRight} 
                                className={`w-3 h-3 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : 'text-smokey-500'}`} />
                              <span>One special character</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-smokey-300 mb-2">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 bg-smokey-800 border ${
                            formData.confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-smokey-700'
                          } rounded-lg text-white placeholder-smokey-500 focus:outline-none focus:border-${theme.primary} transition-colors`}
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-smokey-400 hover:text-white transition-colors"
                        >
                          <SafeIcon icon={showConfirmPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Password Match Indicator */}
                      {formData.confirmPassword && (
                        <div className="mt-2 flex items-center space-x-2">
                          <SafeIcon 
                            icon={passwordsMatch ? FiCheck : FiArrowRight} 
                            className={`w-4 h-4 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`} 
                          />
                          <span className={`text-sm ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                            {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center space-x-4">
                  {/* Back Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    className="px-6 py-3 bg-smokey-800 hover:bg-smokey-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 border border-smokey-600"
                  >
                    <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
                    <span>Back</span>
                  </motion.button>

                  {/* Create Account Button */}
                  <motion.button
                    whileHover={isFormValid && !isCreatingAccount ? { scale: 1.05 } : {}}
                    whileTap={isFormValid && !isCreatingAccount ? { scale: 0.95 } : {}}
                    onClick={handleComplete}
                    disabled={!isFormValid || isCreatingAccount}
                    className={`flex-1 px-8 py-4 bg-gradient-to-r ${theme.gradient} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
                      !isFormValid || isCreatingAccount ? 'opacity-50 cursor-not-allowed' : ''
                    } flex items-center justify-center space-x-2`}
                  >
                    {isCreatingAccount ? (
                      <>
                        <SafeIcon icon={FiCheck} className="w-5 h-5 animate-pulse" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <SafeIcon icon={FiCheck} className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
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
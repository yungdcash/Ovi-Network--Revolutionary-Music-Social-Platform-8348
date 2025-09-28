import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useResponsive } from './hooks/useResponsive';
import LoginSetup from './components/Auth/LoginSetup';
import Navigation from './components/Layout/Navigation';
import Header from './components/Layout/Header';
import FeedPage from './components/Feed/FeedPage';
import TrendingPage from './components/Trending/TrendingPage';
import ProfilePage from './components/Profile/ProfilePage';
import SettingsPage from './components/Settings/SettingsPage';
import MusicPage from './components/Music/MusicPage';
import BeatsPage from './components/Beats/BeatsPage';
import DiscoverPage from './components/Discover/DiscoverPage';
import MessagingPage from './components/Messaging/MessagingPage';
import FloatingElements from './components/3D/FloatingElements';
import './App.css';

const AppContent = () => {
  const { isFirstTime, isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState('home');

  if (isFirstTime || !isAuthenticated) {
    return <LoginSetup />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <FeedPage />;
      case 'trending':
        return <TrendingPage />;
      case 'music':
        return user?.userType === 'artist' ? <MusicPage /> : <FeedPage />;
      case 'beats':
        return user?.userType === 'producer' ? <BeatsPage /> : <FeedPage />;
      case 'discover':
        return <DiscoverPage />;
      case 'messages':
        return <MessagingPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <FeedPage />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800 relative overflow-hidden">
      <FloatingElements className="opacity-20" />
      
      <div className="relative z-10 h-full flex">
        {/* Desktop Navigation - Fixed */}
        {!isMobile && (
          <div className="w-64 flex-shrink-0">
            <Navigation 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              isMobile={false}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full">
          {/* Header - Fixed */}
          <div className="flex-shrink-0">
            <Header isMobile={isMobile} />
          </div>
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-smokey-600 scrollbar-track-smokey-800">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-full"
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Fixed */}
        {isMobile && (
          <Navigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            isMobile={true}
          />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
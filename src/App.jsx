import React, { useState } from 'react';
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
import FloatingElements from './components/3D/FloatingElements';
import './App.css';

const AppContent = () => {
  const { isFirstTime, isAuthenticated } = useAuth();
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
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <FeedPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-smokey-900 to-dark-800 relative overflow-hidden">
      <FloatingElements className="opacity-20" />
      
      <div className="relative z-10 min-h-screen flex">
        {/* Desktop Navigation */}
        {!isMobile && (
          <Navigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            isMobile={false}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header isMobile={isMobile} />
          
          <main className="flex-1 overflow-y-auto">
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
          </main>
        </div>

        {/* Mobile Navigation */}
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
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPlus, FiPlay, FiPause, FiHeart, FiMessageCircle, FiShare2, FiEye, 
  FiDollarSign, FiTrendingUp, FiClock, FiX, FiUpload, FiMusic, FiDisc,
  FiCamera, FiVideo, FiMic, FiHeadphones, FiCheck, FiChevronLeft, FiChevronRight,
  FiBarChart3, FiArrowLeft
} = FiIcons;

const StoriesReel = () => {
  const { theme } = useTheme();
  const { user, logUserAction } = useAuth();
  
  // Core state
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('photo');
  
  // Scroll state
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  
  // Story viewer state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  
  // Upload modal state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  
  // Refs
  const progressRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const storyContainerRef = useRef(null);
  const progressStartTimeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);
  const isTransitioningRef = useRef(false);

  // Check if current user is a fan
  const isFanUser = useMemo(() => {
    return user?.userType === 'fan' || user?.role === 'fan';
  }, [user]);

  // Memoized stories data to prevent unnecessary re-renders
  const mockStoriesData = useMemo(() => [
    {
      id: 1,
      user: {
        name: 'Ariana Grande',
        username: 'arianagrande',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        role: 'artist',
        verified: true
      },
      content: {
        type: 'monetization',
        title: 'New Single Release',
        description: 'Just dropped "positions" and the response has been incredible! 🎵',
        media: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
        duration: 15
      },
      metrics: {
        likes: 45672,
        comments: 8934,
        shares: 2345,
        views: 156789,
        earnings: {
          total: 8945.67,
          streams: 6234.50,
          tips: 1456.17,
          shares: 1255.00
        },
        realTime: {
          lastUpdate: Date.now() - 300000,
          isLive: true
        }
      },
      timestamp: Date.now() - 1800000,
      hasMonetization: true
    },
    {
      id: 2,
      user: {
        name: 'Metro Boomin',
        username: 'metroboomin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'producer',
        verified: true
      },
      content: {
        type: 'monetization',
        title: 'Beat Pack Launch',
        description: 'New trap beat pack just went live! Already seeing amazing sales 🔥💰',
        media: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
        duration: 15
      },
      metrics: {
        likes: 23456,
        comments: 4567,
        shares: 1234,
        views: 78901,
        earnings: {
          total: 5634.89,
          beatSales: 4200.00,
          tips: 834.89,
          shares: 600.00
        },
        realTime: {
          lastUpdate: Date.now() - 600000,
          isLive: true
        }
      },
      timestamp: Date.now() - 3600000,
      hasMonetization: true
    },
    {
      id: 3,
      user: {
        name: 'Music Lover Sarah',
        username: 'sarahmusic',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'fan',
        verified: false
      },
      content: {
        type: 'engagement',
        title: 'Concert Experience',
        description: 'Last night\'s concert was absolutely incredible! The energy was unmatched 🎤✨',
        media: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=600&fit=crop',
        duration: 15
      },
      metrics: {
        likes: 1234,
        comments: 234,
        shares: 89,
        views: 5678,
        realTime: {
          lastUpdate: Date.now() - 900000,
          isLive: false
        }
      },
      timestamp: Date.now() - 7200000,
      hasMonetization: false
    },
    {
      id: 4,
      user: {
        name: 'Billie Eilish',
        username: 'billieeilish',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'artist',
        verified: true
      },
      content: {
        type: 'monetization',
        title: 'Studio Session',
        description: 'Working on something special... The creative process never stops 🌙',
        media: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=600&fit=crop',
        duration: 15
      },
      metrics: {
        likes: 67890,
        comments: 12345,
        shares: 3456,
        views: 234567,
        earnings: {
          total: 12456.78,
          streams: 8934.50,
          tips: 2456.28,
          shares: 1066.00
        },
        realTime: {
          lastUpdate: Date.now() - 1200000,
          isLive: true
        }
      },
      timestamp: Date.now() - 10800000,
      hasMonetization: true
    },
    {
      id: 5,
      user: {
        name: 'DJ Snake',
        username: 'djsnake',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'producer',
        verified: true
      },
      content: {
        type: 'monetization',
        title: 'Festival Beats',
        description: 'EDM pack dropping soon! Get ready for festival season 🎪🔥',
        media: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=600&fit=crop',
        duration: 15
      },
      metrics: {
        likes: 34567,
        comments: 6789,
        shares: 1890,
        views: 123456,
        earnings: {
          total: 7890.45,
          beatSales: 5600.00,
          tips: 1290.45,
          shares: 1000.00
        },
        realTime: {
          lastUpdate: Date.now() - 450000,
          isLive: true
        }
      },
      timestamp: Date.now() - 5400000,
      hasMonetization: true
    },
    {
      id: 6,
      user: {
        name: 'Alex Johnson',
        username: 'alexj_music',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        role: 'fan',
        verified: false
      },
      content: {
        type: 'engagement',
        title: 'New Playlist',
        description: 'Created the perfect workout playlist! These beats hit different 💪🎵',
        media: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
        duration: 15
      },
      metrics: {
        likes: 892,
        comments: 156,
        shares: 67,
        views: 3456,
        realTime: {
          lastUpdate: Date.now() - 1800000,
          isLive: false
        }
      },
      timestamp: Date.now() - 14400000,
      hasMonetization: false
    }
  ], []);

  // Generate stories with user's add story slot
  const generateStories = useCallback(() => {
    const baseStories = [];

    // Add user's story slot if user exists
    if (user) {
      baseStories.push({
        id: 'user_story',
        isAddStory: true,
        user: user,
        canUpload: true
      });
    }

    return [...baseStories, ...mockStoriesData];
  }, [user, mockStoriesData]);

  // Initialize stories
  useEffect(() => {
    setStories(generateStories());
  }, [generateStories]);

  // Clean up all timers and animations
  const cleanupTimers = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isTransitioningRef.current = false;
  }, []);

  // Handle scroll position and arrow visibility
  const updateArrowVisibility = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      setScrollPosition(scrollLeft);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      updateArrowVisibility();
      container.addEventListener('scroll', updateArrowVisibility);
      
      // Also check on resize
      const handleResize = () => updateArrowVisibility();
      window.addEventListener('resize', handleResize);
      
      return () => {
        container.removeEventListener('scroll', updateArrowVisibility);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [stories, updateArrowVisibility]);

  // Scroll functions with bounds checking
  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -250,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 250,
        behavior: 'smooth'
      });
    }
  }, []);

  // Find valid story indices (skip add story slots)
  const findValidStoryIndex = useCallback((startIndex, direction) => {
    let index = startIndex;
    
    while (index >= 0 && index < stories.length) {
      if (!stories[index]?.isAddStory) {
        return index;
      }
      index += direction;
    }
    
    return -1;
  }, [stories]);

  // Navigate to previous story
  const goToPreviousStory = useCallback(() => {
    if (!selectedStory || !stories.length || isTransitioningRef.current) return;

    cleanupTimers();
    isTransitioningRef.current = true;

    const currentIndex = stories.findIndex(s => s.id === selectedStory.id);
    const prevIndex = findValidStoryIndex(currentIndex - 1, -1);
    
    if (prevIndex >= 0) {
      const prevStory = stories[prevIndex];
      
      // Reset all states
      progressStartTimeRef.current = null;
      setSelectedStory(prevStory);
      setCurrentStoryIndex(prevIndex);
      setProgressWidth(0);
      setImageLoaded(false);
      setImageError(false);
      setShowPerformance(false);
      setIsPlaying(true);
      
      if (progressRef.current) {
        progressRef.current.style.width = '0%';
      }
    }
    
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 100);
  }, [selectedStory, stories, cleanupTimers, findValidStoryIndex]);

  // Navigate to next story
  const goToNextStory = useCallback(() => {
    if (!selectedStory || !stories.length || isTransitioningRef.current) return;

    cleanupTimers();
    isTransitioningRef.current = true;

    const currentIndex = stories.findIndex(s => s.id === selectedStory.id);
    const nextIndex = findValidStoryIndex(currentIndex + 1, 1);
    
    if (nextIndex >= 0) {
      const nextStory = stories[nextIndex];
      
      // Reset all states
      progressStartTimeRef.current = null;
      setSelectedStory(nextStory);
      setCurrentStoryIndex(nextIndex);
      setProgressWidth(0);
      setImageLoaded(false);
      setImageError(false);
      setShowPerformance(false);
      setIsPlaying(true);
      
      if (progressRef.current) {
        progressRef.current.style.width = '0%';
      }
    } else {
      // No more stories, close viewer
      closeStoryViewer();
      return;
    }
    
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 100);
  }, [selectedStory, stories, cleanupTimers, findValidStoryIndex]);

  // Smooth progress bar animation with proper auto-advance
  const updateProgressBar = useCallback(() => {
    if (!selectedStory || !isPlaying || !imageLoaded || !isStoryViewerOpen || isTransitioningRef.current || showPerformance) {
      return;
    }

    const now = Date.now();
    const duration = (selectedStory.content?.duration || 15) * 1000;
    
    if (!progressStartTimeRef.current) {
      progressStartTimeRef.current = now;
    }

    const elapsed = now - progressStartTimeRef.current;
    const progress = Math.min((elapsed / duration) * 100, 100);
    
    setProgressWidth(progress);
    
    if (progressRef.current) {
      progressRef.current.style.width = `${progress}%`;
    }

    if (progress >= 100) {
      // Story completed, transition to next
      cleanupTimers();
      setTimeout(() => {
        goToNextStory();
      }, 200);
      return;
    }

    animationFrameRef.current = requestAnimationFrame(updateProgressBar);
  }, [selectedStory, isPlaying, imageLoaded, isStoryViewerOpen, showPerformance, goToNextStory, cleanupTimers]);

  // Start progress animation
  useEffect(() => {
    if (selectedStory && isPlaying && imageLoaded && isStoryViewerOpen && !showPerformance && !isTransitioningRef.current) {
      progressStartTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(updateProgressBar);
    } else {
      cleanupTimers();
    }

    return cleanupTimers;
  }, [selectedStory?.id, isPlaying, imageLoaded, isStoryViewerOpen, showPerformance, updateProgressBar, cleanupTimers]);

  // Handle story click
  const handleStoryClick = useCallback(async (story) => {
    if (story.isAddStory) {
      setShowUploadModal(true);
      return;
    }

    cleanupTimers();
    progressStartTimeRef.current = null;

    // Set all states
    setSelectedStory(story);
    setCurrentStoryIndex(stories.findIndex(s => s.id === story.id));
    setIsPlaying(true);
    setIsStoryViewerOpen(true);
    setProgressWidth(0);
    setImageLoaded(false);
    setImageError(false);
    setShowPerformance(false);
    
    if (progressRef.current) {
      progressRef.current.style.width = '0%';
    }

    // Log story view safely
    if (logUserAction) {
      try {
        await logUserAction('story_viewed', {
          story_id: story.id,
          story_owner: story.user?.username || 'unknown',
          story_type: story.content?.type || 'unknown',
          has_monetization: Boolean(story.hasMonetization)
        });
      } catch (error) {
        console.warn('Failed to log story view:', error);
      }
    }
  }, [stories, logUserAction, cleanupTimers]);

  // Close story viewer
  const closeStoryViewer = useCallback(() => {
    cleanupTimers();
    progressStartTimeRef.current = null;

    setSelectedStory(null);
    setIsPlaying(false);
    setIsStoryViewerOpen(false);
    setImageLoaded(false);
    setImageError(false);
    setShowPerformance(false);
    setProgressWidth(0);
    
    if (progressRef.current) {
      progressRef.current.style.width = '0%';
    }
  }, [cleanupTimers]);

  // Image handlers
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

  // Analytics handlers - Fixed single click handling
  const handleAnalyticsClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Immediate state update
    setShowPerformance(prev => !prev);
    
    // Pause/resume playback
    if (!showPerformance) {
      setIsPlaying(false);
    } else if (imageLoaded) {
      setIsPlaying(true);
    }
  }, [showPerformance, imageLoaded]);

  const closeAnalytics = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setShowPerformance(false);
    
    if (imageLoaded) {
      setIsPlaying(true);
    }
  }, [imageLoaded]);

  // Permission checks - Updated to hide analytics for fans
  const canViewPerformance = useCallback((story) => {
    if (!user || !story) return false;
    // Hide analytics completely for fan accounts
    if (isFanUser) return false;
    if (story.user?.username === user.username) return true;
    if (user.role === 'admin' || user.role === 'moderator') return true;
    if ((user.userType === 'artist' || user.userType === 'producer') && story.hasMonetization) {
      return true;
    }
    return false;
  }, [user, isFanUser]);

  // Navigation availability checks
  const hasPreviousStory = useCallback(() => {
    if (!selectedStory || !stories.length) return false;
    const currentIndex = stories.findIndex(s => s.id === selectedStory.id);
    return findValidStoryIndex(currentIndex - 1, -1) >= 0;
  }, [selectedStory, stories, findValidStoryIndex]);

  const hasNextStory = useCallback(() => {
    if (!selectedStory || !stories.length) return false;
    const currentIndex = stories.findIndex(s => s.id === selectedStory.id);
    return findValidStoryIndex(currentIndex + 1, 1) >= 0;
  }, [selectedStory, stories, findValidStoryIndex]);

  // Utility functions
  const formatTimeAgo = useCallback((timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) {
      return `${hours}h ago`;
    } else {
      return `${minutes}m ago`;
    }
  }, []);

  const formatEarnings = useCallback((amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
    return `$${amount.toFixed(2)}`;
  }, []);

  const formatCount = useCallback((count) => {
    if (typeof count !== 'number' || isNaN(count)) return '0';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }, []);

  // Handle upload modal submission
  const handleUploadSubmit = useCallback(() => {
    // Reset form
    setUploadTitle('');
    setUploadDescription('');
    setShowUploadModal(false);
    
    // Here you would typically handle the actual upload
    console.log('Story upload submitted:', { uploadType, uploadTitle, uploadDescription });
  }, [uploadType, uploadTitle, uploadDescription]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTimers();
    };
  }, [cleanupTimers]);

  // Upload Modal Component
  const UploadModal = useCallback(() => (
    <AnimatePresence>
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-smokey-900 border border-smokey-700 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} flex items-center justify-center`}>
                <SafeIcon icon={FiCamera} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Create Story</h3>
              <p className="text-smokey-400">
                {isFanUser 
                  ? 'Share your music experiences with the community' 
                  : 'Share your latest creation with your audience'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setUploadType('photo')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  uploadType === 'photo'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-smokey-700 hover:border-smokey-600'
                }`}
              >
                <SafeIcon icon={FiCamera} className={`w-8 h-8 mx-auto mb-2 ${uploadType === 'photo' ? 'text-emerald-500' : 'text-smokey-400'}`} />
                <span className={`text-sm font-medium ${uploadType === 'photo' ? 'text-emerald-500' : 'text-smokey-400'}`}>
                  Photo
                </span>
              </button>
              
              <button
                onClick={() => setUploadType('video')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  uploadType === 'video'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-smokey-700 hover:border-smokey-600'
                }`}
              >
                <SafeIcon icon={FiVideo} className={`w-8 h-8 mx-auto mb-2 ${uploadType === 'video' ? 'text-emerald-500' : 'text-smokey-400'}`} />
                <span className={`text-sm font-medium ${uploadType === 'video' ? 'text-emerald-500' : 'text-smokey-400'}`}>
                  Video
                </span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Story Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder={
                    isFanUser 
                      ? "What's your music vibe today?" 
                      : "What's happening?"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Description</label>
                <textarea
                  rows="3"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-smokey-800 border border-smokey-700 rounded-lg text-white placeholder-smokey-400 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  placeholder={
                    isFanUser 
                      ? "Share your music discovery or experience..." 
                      : "Tell your story..."
                  }
                />
              </div>

              <div className="border-2 border-dashed border-smokey-700 rounded-lg p-6 text-center">
                <SafeIcon icon={FiUpload} className="w-8 h-8 text-smokey-400 mx-auto mb-2" />
                <p className="text-smokey-400 mb-2">Drop your {uploadType} here or click to browse</p>
                <p className="text-xs text-smokey-500">
                  {uploadType === 'photo' ? 'JPG, PNG (Max 10MB)' : 'MP4, MOV (Max 50MB, 60s)'}
                </p>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-3 px-4 bg-smokey-800 text-white rounded-lg hover:bg-smokey-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                className={`flex-1 py-3 px-4 bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                Share Story
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ), [showUploadModal, theme?.gradient, isFanUser, uploadType, uploadTitle, uploadDescription, handleUploadSubmit]);

  // Performance Panel Component - Hidden for fans
  const PerformancePanel = useCallback(() => {
    // Hide entire analytics panel for fan users
    if (!selectedStory?.hasMonetization || !selectedStory?.metrics || isFanUser) return null;

    return (
      <AnimatePresence mode="wait">
        {showPerformance && (
          <motion.div
            key="performance-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              ease: "easeOut"
            }}
            className="absolute bottom-20 left-4 right-4 z-[60]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Header with Back Button */}
              <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-emerald-500/20 to-blue-500/20">
                <button
                  type="button"
                  onClick={closeAnalytics}
                  className="flex items-center space-x-2 text-white hover:text-emerald-400 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/10 active:scale-95 select-none touch-manipulation"
                >
                  <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                  <span className="text-sm font-medium">Back</span>
                </button>
                
                <h3 className="text-white font-semibold flex items-center space-x-2">
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4" />
                  <span>Real-time Analytics</span>
                </h3>
                
                {selectedStory.metrics.realTime?.isLive && (
                  <div className="flex items-center space-x-1 text-green-400 text-xs bg-green-400/20 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-medium">LIVE</span>
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="p-4">
                {/* Top Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <SafeIcon icon={FiEye} className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-lg font-bold">{formatCount(selectedStory.metrics.views || 0)}</span>
                    </div>
                    <p className="text-white/60 text-xs font-medium">Total Views</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <SafeIcon icon={FiHeart} className="w-4 h-4 text-red-400" />
                      <span className="text-white text-lg font-bold">{formatCount(selectedStory.metrics.likes || 0)}</span>
                    </div>
                    <p className="text-white/60 text-xs font-medium">Likes</p>
                  </div>
                </div>

                {/* Secondary Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <SafeIcon icon={FiMessageCircle} className="w-3 h-3 text-blue-400" />
                      <span className="text-white text-sm font-bold">{formatCount(selectedStory.metrics.comments || 0)}</span>
                    </div>
                    <p className="text-white/60 text-xs">Comments</p>
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <SafeIcon icon={FiShare2} className="w-3 h-3 text-green-400" />
                      <span className="text-white text-sm font-bold">{formatCount(selectedStory.metrics.shares || 0)}</span>
                    </div>
                    <p className="text-white/60 text-xs">Shares</p>
                  </div>
                </div>

                {/* Earnings Section - Only show for non-fan users */}
                {selectedStory.metrics.earnings && !isFanUser && (
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex items-center justify-between mb-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiDollarSign} className="w-5 h-5 text-green-400" />
                        <span className="text-white/70 text-sm font-medium">Total Earnings</span>
                      </div>
                      <span className="text-green-400 text-xl font-bold">{formatEarnings(selectedStory.metrics.earnings.total)}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-white/60 text-sm">Streams</span>
                        </div>
                        <span className="text-white font-medium">{formatEarnings(selectedStory.metrics.earnings.streams || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-white/60 text-sm">Tips</span>
                        </div>
                        <span className="text-white font-medium">{formatEarnings(selectedStory.metrics.earnings.tips || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-white/60 text-sm">Shares</span>
                        </div>
                        <span className="text-white font-medium">{formatEarnings(selectedStory.metrics.earnings.shares || 0)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Last Updated */}
                {selectedStory.metrics.realTime?.lastUpdate && (
                  <div className="flex items-center justify-center mt-4 pt-3 border-t border-white/20">
                    <div className="flex items-center space-x-2 text-white/60 text-xs bg-white/5 px-3 py-2 rounded-full">
                      <SafeIcon icon={FiClock} className="w-3 h-3" />
                      <span>Updated {Math.floor((Date.now() - selectedStory.metrics.realTime.lastUpdate) / 60000)}m ago</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }, [showPerformance, selectedStory, isFanUser, formatCount, formatEarnings, closeAnalytics]);

  // Story Viewer Component with fixed click handling and repositioned back button
  const StoryViewer = useCallback(() => {
    if (!isStoryViewerOpen || !selectedStory) return null;

    return (
      <div
        className="fixed inset-0 bg-black z-[50] flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeStoryViewer();
          }
        }}
      >
        <div 
          ref={storyContainerRef}
          className="relative w-full h-full max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div className="absolute top-4 left-4 right-4 z-[51]">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                ref={progressRef}
                className="h-full bg-white rounded-full transition-none"
                style={{ 
                  width: `${progressWidth}%`,
                  transform: 'translateZ(0)',
                  willChange: 'width'
                }}
              />
            </div>
          </div>

          {/* Navigation Arrows - Fixed single click handling */}
          {hasPreviousStory() && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPreviousStory();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[52] w-12 h-12 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all hover:scale-110 active:scale-95 select-none touch-manipulation"
            >
              <SafeIcon icon={FiChevronLeft} className="w-6 h-6" />
            </button>
          )}

          {hasNextStory() && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNextStory();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[52] w-12 h-12 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all hover:scale-110 active:scale-95 select-none touch-manipulation"
            >
              <SafeIcon icon={FiChevronRight} className="w-6 h-6" />
            </button>
          )}

          {/* Story Media Container */}
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-smokey-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafeIcon icon={FiX} className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-semibold mb-2">Failed to load story</p>
                  <p className="text-smokey-400">Please try again later</p>
                </div>
              </div>
            )}

            {selectedStory?.content?.media && (
              <img
                src={selectedStory.content.media}
                alt={selectedStory.content?.title || 'Story'}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
            
            {imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            )}
          </div>

          {/* Story Info with repositioned controls */}
          {imageLoaded && selectedStory?.user && (
            <div className="absolute top-16 left-4 right-4 z-[51]">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={selectedStory.user.avatar}
                  alt={selectedStory.user.name}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white font-semibold">{selectedStory.user.name}</h3>
                    {selectedStory.user.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiCheck} className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-white/70 text-sm">{formatTimeAgo(selectedStory.timestamp)}</p>
                </div>
                
                {/* Control buttons aligned horizontally */}
                <div className="flex items-center space-x-2">
                  {/* Back Button - Now inline with play/pause */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      closeStoryViewer();
                    }}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95 select-none touch-manipulation"
                  >
                    <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                  </button>
                  
                  {/* Play/Pause Button */}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsPlaying(!isPlaying);
                    }}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors active:scale-95 select-none touch-manipulation"
                  >
                    <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Story Content */}
          {imageLoaded && selectedStory?.content && (
            <div className="absolute bottom-20 left-4 right-4 z-[51]">
              <h2 className="text-white text-xl font-bold mb-2">{selectedStory.content.title}</h2>
              <p className="text-white/90 mb-4">{selectedStory.content.description}</p>
            </div>
          )}

          {/* Performance Metrics Panel */}
          <PerformancePanel />

          {/* Interaction Buttons - Fixed single click handling */}
          {imageLoaded && selectedStory?.metrics && (
            <div className="absolute bottom-4 left-4 right-4 z-[52]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors active:scale-95 select-none touch-manipulation"
                  >
                    <SafeIcon icon={FiHeart} className="w-6 h-6" />
                    <span className="text-sm">{formatCount(selectedStory.metrics.likes || 0)}</span>
                  </button>
                  <button 
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors active:scale-95 select-none touch-manipulation"
                  >
                    <SafeIcon icon={FiMessageCircle} className="w-6 h-6" />
                    <span className="text-sm">{formatCount(selectedStory.metrics.comments || 0)}</span>
                  </button>
                  <button 
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex items-center space-x-2 text-white hover:text-green-400 transition-colors active:scale-95 select-none touch-manipulation"
                  >
                    <SafeIcon icon={FiShare2} className="w-6 h-6" />
                    <span className="text-sm">{formatCount(selectedStory.metrics.shares || 0)}</span>
                  </button>
                  
                  {/* Analytics Button - Hidden for fan users */}
                  {canViewPerformance(selectedStory) && selectedStory.hasMonetization && !isFanUser && (
                    <button 
                      type="button"
                      onMouseDown={handleAnalyticsClick}
                      className={`flex items-center space-x-2 transition-all duration-200 ${
                        showPerformance 
                          ? 'text-emerald-400 bg-emerald-400/20 shadow-lg scale-105' 
                          : 'text-white hover:text-emerald-400 hover:bg-white/10'
                      } px-3 py-2 rounded-full border border-transparent ${
                        showPerformance ? 'border-emerald-400/30' : 'hover:border-white/20'
                      } active:scale-95 select-none touch-manipulation`}
                    >
                      <SafeIcon icon={FiBarChart3} className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {showPerformance ? 'Close Analytics' : 'Analytics'}
                      </span>
                    </button>
                  )}
                </div>
                
                {/* Tip Button - Hidden for fan users and fan stories */}
                {selectedStory.hasMonetization && !isFanUser && selectedStory.user?.role !== 'fan' && (
                  <button 
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex items-center space-x-2 bg-green-500 px-3 py-1 rounded-full hover:bg-green-600 transition-colors active:scale-95 select-none touch-manipulation"
                  >
                    <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">Tip</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [
    isStoryViewerOpen, selectedStory, progressWidth, hasPreviousStory, hasNextStory,
    goToPreviousStory, goToNextStory, closeStoryViewer, imageLoaded, imageError,
    handleImageLoad, handleImageError, formatTimeAgo, isPlaying, canViewPerformance,
    isFanUser, showPerformance, handleAnalyticsClick, formatCount, PerformancePanel
  ]);

  return (
    <>
      <div className="mb-8 relative">
        <div className="flex items-center">
          {/* Left Navigation Arrow */}
          <AnimatePresence>
            {showLeftArrow && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={scrollLeft}
                className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform backdrop-blur-sm mr-4`}
              >
                <SafeIcon icon={FiChevronLeft} className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Stories Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="flex items-start space-x-8 overflow-x-auto scrollbar-hide pb-20 flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {stories.map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 cursor-pointer"
                onClick={() => handleStoryClick(story)}
              >
                {story.isAddStory ? (
                  <div className="relative flex flex-col items-center">
                    <div className={`w-24 h-24 rounded-xl bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} flex items-center justify-center border-2 border-smokey-700 shadow-lg`}>
                      <SafeIcon icon={FiPlus} className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium text-center mt-4 w-24 leading-tight">Add Story</p>
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center">
                    <div className={`w-24 h-24 rounded-xl p-1 shadow-lg ${
                      story.user?.role === 'fan' 
                        ? 'bg-gradient-to-r from-purple-400 to-pink-500' 
                        : story.hasMonetization 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                        : 'bg-gradient-to-r from-purple-400 to-pink-500'
                    }`}>
                      <img
                        src={story.user?.avatar}
                        alt={story.user?.name || 'User'}
                        className="w-full h-full rounded-lg object-cover border-2 border-smokey-900"
                      />
                    </div>

                    {story.hasMonetization && story.user?.role !== 'fan' && story.metrics?.realTime?.isLive && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full border border-smokey-900 font-bold shadow-lg">
                        LIVE
                      </div>
                    )}

                    <p className="text-white text-sm font-medium text-center mt-4 w-28 leading-tight">
                      {story.user?.name || 'Unknown User'}
                    </p>

                    <div className="flex flex-col items-center mt-2 space-y-1">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiHeart} className="w-4 h-4 text-red-400" />
                          <span className="text-white text-sm font-medium">{formatCount(story.metrics?.likes || 0)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiEye} className="w-4 h-4 text-blue-400" />
                          <span className="text-white text-sm font-medium">{formatCount(story.metrics?.views || 0)}</span>
                        </div>
                      </div>
                      
                      {/* Hide earnings display for fan users */}
                      {story.hasMonetization && story.user?.role !== 'fan' && story.metrics?.earnings && !isFanUser && (
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm font-bold">{formatEarnings(story.metrics.earnings.total)}</span>
                        </div>
                      )}
                    </div>

                    <div className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-smokey-900 shadow-lg ${
                      story.user?.role === 'artist' 
                        ? 'bg-emerald-500' 
                        : story.user?.role === 'producer'
                        ? 'bg-purple-500'
                        : 'bg-blue-500'
                    }`}>
                      <SafeIcon 
                        icon={story.user?.role === 'artist' ? FiMic : story.user?.role === 'producer' ? FiDisc : FiHeadphones} 
                        className="w-4 h-4 text-white" 
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Navigation Arrow */}
          <AnimatePresence>
            {showRightArrow && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={scrollRight}
                className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${theme?.gradient || 'from-emerald-500 to-blue-600'} shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform backdrop-blur-sm ml-4`}
              >
                <SafeIcon icon={FiChevronRight} className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <UploadModal />
      <StoryViewer />
    </>
  );
};

export default StoriesReel;
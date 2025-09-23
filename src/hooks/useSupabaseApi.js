import { useState, useEffect } from 'react';
import { userApi, feedApi, socialApi, musicApi, analyticsApi, playlistApi } from '../lib/supabaseApi';

// Hook for user data
export const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      const result = await userApi.getUserProfile(userId);
      
      if (result.success) {
        setUser(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  const updateProfile = async (updates) => {
    const result = await userApi.updateProfile(userId, updates);
    if (result.success) {
      setUser(prev => ({ ...prev, ...updates }));
    }
    return result;
  };

  return { user, loading, error, updateProfile };
};

// Hook for feed data
export const useFeed = (userId, pageSize = 20) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchFeed = async (reset = false) => {
    if (!userId) return;

    setLoading(true);
    const currentPage = reset ? 0 : page;
    
    const result = await feedApi.getUserFeed(userId, pageSize, currentPage * pageSize);
    
    if (result.success) {
      if (reset) {
        setPosts(result.data);
      } else {
        setPosts(prev => [...prev, ...result.data]);
      }
      setHasMore(result.data.length === pageSize);
      setPage(currentPage + 1);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed(true);
  }, [userId]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchFeed(false);
    }
  };

  const refresh = () => {
    setPage(0);
    fetchFeed(true);
  };

  return { posts, loading, error, hasMore, loadMore, refresh };
};

// Hook for trending content
export const useTrending = (timePeriod = 7) => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      const result = await feedApi.getTrendingContent(timePeriod);
      
      if (result.success) {
        setTrending(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchTrending();
  }, [timePeriod]);

  return { trending, loading, error };
};

// Hook for social interactions
export const useSocialActions = () => {
  const [loading, setLoading] = useState(false);

  const toggleLike = async (userId, postId) => {
    setLoading(true);
    const result = await socialApi.toggleLike(userId, postId);
    setLoading(false);
    return result;
  };

  const toggleFollow = async (followerId, followingId) => {
    setLoading(true);
    const result = await socialApi.toggleFollow(followerId, followingId);
    setLoading(false);
    return result;
  };

  const addComment = async (userId, postId, content, parentCommentId = null) => {
    setLoading(true);
    const result = await socialApi.addComment(userId, postId, content, parentCommentId);
    setLoading(false);
    return result;
  };

  return { toggleLike, toggleFollow, addComment, loading };
};

// Hook for user posts
export const useUserPosts = (userId, limit = 20) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      setLoading(true);
      const result = await feedApi.getUserPosts(userId, limit);
      
      if (result.success) {
        setPosts(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [userId, limit]);

  return { posts, loading, error };
};

// Hook for notifications
export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      setLoading(true);
      const result = await analyticsApi.getNotifications(userId);
      
      if (result.success) {
        setNotifications(result.data);
        setUnreadCount(result.data.filter(n => !n.is_read).length);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationIds = null) => {
    const result = await analyticsApi.markNotificationsRead(userId, notificationIds);
    if (result.success) {
      setNotifications(prev => 
        prev.map(n => 
          notificationIds ? 
            (notificationIds.includes(n.id) ? { ...n, is_read: true } : n) :
            { ...n, is_read: true }
        )
      );
      setUnreadCount(0);
    }
    return result;
  };

  return { notifications, loading, error, unreadCount, markAsRead };
};

// Hook for earnings
export const useEarnings = (userId, startDate = null, endDate = null) => {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchEarnings = async () => {
      setLoading(true);
      const result = await analyticsApi.getUserEarnings(userId, startDate, endDate);
      
      if (result.success) {
        setEarnings(result.data);
        setTotalEarnings(result.data.reduce((sum, earning) => sum + parseFloat(earning.amount), 0));
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchEarnings();
  }, [userId, startDate, endDate]);

  return { earnings, totalEarnings, loading, error };
};

// Hook for playlists
export const useUserPlaylists = (userId, includePrivate = false) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchPlaylists = async () => {
      setLoading(true);
      const result = await playlistApi.getUserPlaylists(userId, includePrivate);
      
      if (result.success) {
        setPlaylists(result.data);
        setError(null);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchPlaylists();
  }, [userId, includePrivate]);

  const createPlaylist = async (title, description = '', isPublic = true) => {
    const result = await playlistApi.createPlaylist(userId, title, description, isPublic);
    if (result.success) {
      setPlaylists(prev => [result.data, ...prev]);
    }
    return result;
  };

  return { playlists, loading, error, createPlaylist };
};

// Hook for music streaming
export const useStreamingSession = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const startStream = async (userId, trackId, deviceInfo = {}) => {
    setCurrentTrack(trackId);
    setIsPlaying(true);
    setDuration(0);

    // Start tracking duration
    const startTime = Date.now();
    
    return {
      endStream: async (completionPercentage = 100) => {
        const sessionDuration = Math.floor((Date.now() - startTime) / 1000);
        setIsPlaying(false);
        setDuration(sessionDuration);

        const result = await musicApi.recordStream(
          userId, 
          trackId, 
          sessionDuration, 
          completionPercentage, 
          deviceInfo
        );

        return result;
      }
    };
  };

  return { currentTrack, isPlaying, duration, startStream };
};
import supabase from './supabase';

// User Management API
export const userApi = {
  // Get user profile with stats
  async getUserProfile(userId, requestingUserId = null) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_profile', {
          profile_user_id: userId,
          requesting_user_id: requestingUserId
        });

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  },

  // Search users
  async searchUsers(query, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, full_name, avatar_url, user_type, is_verified')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error searching users:', error);
      return { success: false, error: error.message };
    }
  }
};

// Posts and Feed API
export const feedApi = {
  // Get user feed
  async getUserFeed(userId, pageSize = 20, pageOffset = 0) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_feed', {
          user_uuid: userId,
          page_size: pageSize,
          page_offset: pageOffset
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting user feed:', error);
      return { success: false, error: error.message };
    }
  },

  // Get trending content
  async getTrendingContent(timePeriod = 7) {
    try {
      const { data, error } = await supabase
        .rpc('get_trending_content', {
          time_period: timePeriod
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting trending content:', error);
      return { success: false, error: error.message };
    }
  },

  // Create a music post
  async createMusicPost(postData) {
    try {
      const { data, error } = await supabase
        .rpc('create_music_post', {
          p_user_id: postData.userId,
          p_content: postData.content,
          p_media_data: postData.mediaData,
          p_track_title: postData.trackTitle,
          p_artist_name: postData.artistName,
          p_album: postData.album,
          p_genre: postData.genre,
          p_duration: postData.duration,
          p_file_url: postData.fileUrl,
          p_cover_art_url: postData.coverArtUrl
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating music post:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user posts
  async getUserPosts(userId, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          music_tracks(*),
          users(username, full_name, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting user posts:', error);
      return { success: false, error: error.message };
    }
  }
};

// Social Interaction API
export const socialApi = {
  // Toggle like on post
  async toggleLike(userId, postId) {
    try {
      const { data, error } = await supabase
        .rpc('toggle_like', {
          p_user_id: userId,
          p_post_id: postId
        });

      if (error) throw error;
      return { success: true, isLiked: data };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { success: false, error: error.message };
    }
  },

  // Toggle follow user
  async toggleFollow(followerId, followingId) {
    try {
      const { data, error } = await supabase
        .rpc('toggle_follow', {
          p_follower_id: followerId,
          p_following_id: followingId
        });

      if (error) throw error;
      return { success: true, isFollowing: data };
    } catch (error) {
      console.error('Error toggling follow:', error);
      return { success: false, error: error.message };
    }
  },

  // Add comment
  async addComment(userId, postId, content, parentCommentId = null) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: userId,
          post_id: postId,
          content,
          parent_comment_id: parentCommentId
        })
        .select(`
          *,
          users(username, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  },

  // Get comments for post
  async getComments(postId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users(username, full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting comments:', error);
      return { success: false, error: error.message };
    }
  }
};

// Music and Streaming API
export const musicApi = {
  // Record streaming session
  async recordStream(userId, trackId, duration, completionPercentage = 100, deviceInfo = {}) {
    try {
      const { data, error } = await supabase
        .rpc('record_stream', {
          p_user_id: userId,
          p_track_id: trackId,
          p_duration: duration,
          p_completion_percentage: completionPercentage,
          p_device_info: deviceInfo
        });

      if (error) throw error;
      return { success: true, earnings: data };
    } catch (error) {
      console.error('Error recording stream:', error);
      return { success: false, error: error.message };
    }
  },

  // Get track details
  async getTrackDetails(trackId) {
    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select(`
          *,
          posts(
            *,
            users(username, full_name, avatar_url, is_verified)
          )
        `)
        .eq('id', trackId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting track details:', error);
      return { success: false, error: error.message };
    }
  },

  // Search tracks
  async searchTracks(query, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select(`
          *,
          posts(
            *,
            users(username, full_name, avatar_url, is_verified)
          )
        `)
        .or(`title.ilike.%${query}%,artist_name.ilike.%${query}%,album.ilike.%${query}%`)
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error searching tracks:', error);
      return { success: false, error: error.message };
    }
  }
};

// Analytics and Notifications API
export const analyticsApi = {
  // Get user earnings
  async getUserEarnings(userId, startDate = null, endDate = null) {
    try {
      let query = supabase
        .from('earnings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('created_at', startDate);
      }
      if (endDate) {
        query = query.lte('created_at', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting user earnings:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user notifications
  async getNotifications(userId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          from_user:users!notifications_from_user_id_fkey(username, full_name, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting notifications:', error);
      return { success: false, error: error.message };
    }
  },

  // Mark notifications as read
  async markNotificationsRead(userId, notificationIds = null) {
    try {
      let query = supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId);

      if (notificationIds && notificationIds.length > 0) {
        query = query.in('id', notificationIds);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return { success: false, error: error.message };
    }
  }
};

// Playlist API
export const playlistApi = {
  // Create playlist
  async createPlaylist(userId, title, description = '', isPublic = true) {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          user_id: userId,
          title,
          description,
          is_public: isPublic
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating playlist:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user playlists
  async getUserPlaylists(userId, includePrivate = false) {
    try {
      let query = supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!includePrivate) {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting user playlists:', error);
      return { success: false, error: error.message };
    }
  },

  // Add track to playlist
  async addTrackToPlaylist(playlistId, trackId, position = null) {
    try {
      // Get current max position if position not specified
      if (position === null) {
        const { data: tracks } = await supabase
          .from('playlist_tracks')
          .select('position')
          .eq('playlist_id', playlistId)
          .order('position', { ascending: false })
          .limit(1);

        position = tracks && tracks.length > 0 ? tracks[0].position + 1 : 1;
      }

      const { data, error } = await supabase
        .from('playlist_tracks')
        .insert({
          playlist_id: playlistId,
          track_id: trackId,
          position
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      return { success: false, error: error.message };
    }
  }
};

// Real-time subscriptions
export const realtimeApi = {
  // Subscribe to notifications
  subscribeToNotifications(userId, callback) {
    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to post likes
  subscribeToPostLikes(postId, callback) {
    return supabase
      .channel('post_likes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes',
          filter: `post_id=eq.${postId}`
        },
        callback
      )
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe(subscription) {
    return supabase.removeChannel(subscription);
  }
};

export default {
  userApi,
  feedApi,
  socialApi,
  musicApi,
  analyticsApi,
  playlistApi,
  realtimeApi
};
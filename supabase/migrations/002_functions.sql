-- Function to get user feed
CREATE OR REPLACE FUNCTION get_user_feed(user_uuid UUID, page_size INTEGER DEFAULT 20, page_offset INTEGER DEFAULT 0)
RETURNS TABLE (
  post_id UUID,
  user_id UUID,
  username VARCHAR,
  full_name VARCHAR,
  avatar_url TEXT,
  content TEXT,
  post_type post_type_enum,
  media_data JSONB,
  likes_count INTEGER,
  comments_count INTEGER,
  shares_count INTEGER,
  streams_count INTEGER,
  earnings DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE,
  is_liked BOOLEAN,
  music_track JSONB
) LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT 
    p.id as post_id,
    p.user_id,
    u.username,
    u.full_name,
    u.avatar_url,
    p.content,
    p.post_type,
    p.media_data,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.streams_count,
    p.earnings,
    p.created_at,
    EXISTS(SELECT 1 FROM likes l WHERE l.user_id = user_uuid AND l.post_id = p.id) as is_liked,
    CASE 
      WHEN mt.id IS NOT NULL THEN
        jsonb_build_object(
          'id', mt.id,
          'title', mt.title,
          'artist_name', mt.artist_name,
          'duration', mt.duration,
          'cover_art_url', mt.cover_art_url,
          'genre', mt.genre
        )
      ELSE NULL
    END as music_track
  FROM posts p
  JOIN users u ON p.user_id = u.id
  LEFT JOIN music_tracks mt ON p.id = mt.post_id
  WHERE 
    p.visibility = 'public' 
    OR p.user_id = user_uuid
    OR EXISTS(SELECT 1 FROM follows f WHERE f.follower_id = user_uuid AND f.following_id = p.user_id)
  ORDER BY p.created_at DESC
  LIMIT page_size OFFSET page_offset;
$$;

-- Function to get trending content
CREATE OR REPLACE FUNCTION get_trending_content(time_period INTEGER DEFAULT 7)
RETURNS TABLE (
  post_id UUID,
  user_id UUID,
  username VARCHAR,
  full_name VARCHAR,
  avatar_url TEXT,
  content TEXT,
  post_type post_type_enum,
  media_data JSONB,
  likes_count INTEGER,
  comments_count INTEGER,
  shares_count INTEGER,
  streams_count INTEGER,
  earnings DECIMAL,
  trend_score DECIMAL,
  music_track JSONB
) LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT 
    p.id as post_id,
    p.user_id,
    u.username,
    u.full_name,
    u.avatar_url,
    p.content,
    p.post_type,
    p.media_data,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.streams_count,
    p.earnings,
    -- Simple trending algorithm: weighted combination of engagement metrics
    (p.likes_count * 1.0 + p.comments_count * 2.0 + p.shares_count * 3.0 + p.streams_count * 0.5) / 
    EXTRACT(EPOCH FROM (NOW() - p.created_at)) * 86400 as trend_score,
    CASE 
      WHEN mt.id IS NOT NULL THEN
        jsonb_build_object(
          'id', mt.id,
          'title', mt.title,
          'artist_name', mt.artist_name,
          'duration', mt.duration,
          'cover_art_url', mt.cover_art_url,
          'genre', mt.genre
        )
      ELSE NULL
    END as music_track
  FROM posts p
  JOIN users u ON p.user_id = u.id
  LEFT JOIN music_tracks mt ON p.id = mt.post_id
  WHERE 
    p.created_at >= NOW() - INTERVAL '%s days' 
    AND p.visibility = 'public'
  ORDER BY trend_score DESC
  LIMIT 50;
$$;

-- Function to get user profile with stats
CREATE OR REPLACE FUNCTION get_user_profile(profile_user_id UUID, requesting_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  user_id UUID,
  email VARCHAR,
  username VARCHAR,
  full_name VARCHAR,
  avatar_url TEXT,
  bio TEXT,
  user_type user_type_enum,
  theme_preference VARCHAR,
  is_verified BOOLEAN,
  location VARCHAR,
  website_url TEXT,
  social_links JSONB,
  followers_count INTEGER,
  following_count INTEGER,
  posts_count INTEGER,
  total_streams INTEGER,
  total_earnings DECIMAL,
  is_following BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT 
    u.id as user_id,
    u.email,
    u.username,
    u.full_name,
    u.avatar_url,
    u.bio,
    u.user_type,
    u.theme_preference,
    u.is_verified,
    u.location,
    u.website_url,
    u.social_links,
    COALESCE(us.followers_count, 0) as followers_count,
    COALESCE(us.following_count, 0) as following_count,
    COALESCE(us.posts_count, 0) as posts_count,
    COALESCE(us.total_streams, 0) as total_streams,
    CASE 
      WHEN u.privacy_settings->>'show_earnings' = 'true' OR u.id = requesting_user_id 
      THEN COALESCE(us.total_earnings, 0.00)
      ELSE 0.00 
    END as total_earnings,
    CASE 
      WHEN requesting_user_id IS NOT NULL 
      THEN EXISTS(SELECT 1 FROM follows f WHERE f.follower_id = requesting_user_id AND f.following_id = u.id)
      ELSE FALSE 
    END as is_following,
    u.created_at
  FROM users u
  LEFT JOIN user_stats us ON u.id = us.user_id
  WHERE u.id = profile_user_id;
$$;

-- Function to create a post with music track
CREATE OR REPLACE FUNCTION create_music_post(
  p_user_id UUID,
  p_content TEXT,
  p_media_data JSONB,
  p_track_title VARCHAR,
  p_artist_name VARCHAR DEFAULT NULL,
  p_album VARCHAR DEFAULT NULL,
  p_genre VARCHAR DEFAULT NULL,
  p_duration INTEGER DEFAULT NULL,
  p_file_url TEXT DEFAULT NULL,
  p_cover_art_url TEXT DEFAULT NULL
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  new_post_id UUID;
  new_track_id UUID;
BEGIN
  -- Insert the post
  INSERT INTO posts (user_id, content, post_type, media_data)
  VALUES (p_user_id, p_content, 'music', p_media_data)
  RETURNING id INTO new_post_id;

  -- Insert the music track
  INSERT INTO music_tracks (
    post_id, title, artist_name, album, genre, 
    duration, file_url, cover_art_url
  )
  VALUES (
    new_post_id, p_track_title, p_artist_name, p_album, p_genre,
    p_duration, p_file_url, p_cover_art_url
  )
  RETURNING id INTO new_track_id;

  -- Update user stats
  UPDATE user_stats 
  SET posts_count = posts_count + 1
  WHERE user_id = p_user_id;

  RETURN new_post_id;
END;
$$;

-- Function to handle likes
CREATE OR REPLACE FUNCTION toggle_like(p_user_id UUID, p_post_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  like_exists BOOLEAN;
BEGIN
  -- Check if like exists
  SELECT EXISTS(SELECT 1 FROM likes WHERE user_id = p_user_id AND post_id = p_post_id) INTO like_exists;
  
  IF like_exists THEN
    -- Unlike
    DELETE FROM likes WHERE user_id = p_user_id AND post_id = p_post_id;
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = p_post_id;
    RETURN FALSE;
  ELSE
    -- Like
    INSERT INTO likes (user_id, post_id) VALUES (p_user_id, p_post_id);
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = p_post_id;
    
    -- Create notification for post owner
    INSERT INTO notifications (user_id, from_user_id, type, title, message, data)
    SELECT 
      p.user_id,
      p_user_id,
      'like',
      'New Like',
      u.full_name || ' liked your post',
      jsonb_build_object('post_id', p_post_id)
    FROM posts p
    JOIN users u ON u.id = p_user_id
    WHERE p.id = p_post_id AND p.user_id != p_user_id;
    
    RETURN TRUE;
  END IF;
END;
$$;

-- Function to handle follows
CREATE OR REPLACE FUNCTION toggle_follow(p_follower_id UUID, p_following_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  follow_exists BOOLEAN;
BEGIN
  -- Check if follow exists
  SELECT EXISTS(SELECT 1 FROM follows WHERE follower_id = p_follower_id AND following_id = p_following_id) INTO follow_exists;
  
  IF follow_exists THEN
    -- Unfollow
    DELETE FROM follows WHERE follower_id = p_follower_id AND following_id = p_following_id;
    
    -- Update stats
    UPDATE user_stats SET following_count = following_count - 1 WHERE user_id = p_follower_id;
    UPDATE user_stats SET followers_count = followers_count - 1 WHERE user_id = p_following_id;
    
    RETURN FALSE;
  ELSE
    -- Follow
    INSERT INTO follows (follower_id, following_id) VALUES (p_follower_id, p_following_id);
    
    -- Update stats
    UPDATE user_stats SET following_count = following_count + 1 WHERE user_id = p_follower_id;
    UPDATE user_stats SET followers_count = followers_count + 1 WHERE user_id = p_following_id;
    
    -- Create notification
    INSERT INTO notifications (user_id, from_user_id, type, title, message, data)
    SELECT 
      p_following_id,
      p_follower_id,
      'follow',
      'New Follower',
      u.full_name || ' started following you',
      jsonb_build_object('user_id', p_follower_id)
    FROM users u 
    WHERE u.id = p_follower_id;
    
    RETURN TRUE;
  END IF;
END;
$$;

-- Function to record streaming session and calculate earnings
CREATE OR REPLACE FUNCTION record_stream(
  p_user_id UUID,
  p_track_id UUID,
  p_duration INTEGER,
  p_completion_percentage DECIMAL DEFAULT 100.00,
  p_device_info JSONB DEFAULT '{}'
)
RETURNS DECIMAL LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  earnings_amount DECIMAL := 0.0000;
  track_owner_id UUID;
BEGIN
  -- Get track owner
  SELECT p.user_id INTO track_owner_id
  FROM music_tracks mt
  JOIN posts p ON mt.post_id = p.id
  WHERE mt.id = p_track_id;

  -- Calculate earnings (simple algorithm: $0.001 per complete stream)
  IF p_completion_percentage >= 80.00 THEN
    earnings_amount := 0.0010;
  ELSIF p_completion_percentage >= 50.00 THEN
    earnings_amount := 0.0005;
  ELSE
    earnings_amount := 0.0001;
  END IF;

  -- Record streaming session
  INSERT INTO streaming_sessions (
    user_id, track_id, session_duration, completion_percentage,
    earnings_generated, device_info
  ) VALUES (
    p_user_id, p_track_id, p_duration, p_completion_percentage,
    earnings_amount, p_device_info
  );

  -- Record earnings for track owner
  IF track_owner_id IS NOT NULL THEN
    INSERT INTO earnings (user_id, track_id, amount, source, transaction_data)
    VALUES (
      track_owner_id, p_track_id, earnings_amount, 'stream',
      jsonb_build_object(
        'listener_id', p_user_id,
        'completion_percentage', p_completion_percentage,
        'session_duration', p_duration
      )
    );

    -- Update user stats
    UPDATE user_stats 
    SET 
      total_streams = total_streams + 1,
      total_earnings = total_earnings + earnings_amount,
      monthly_streams = monthly_streams + 1,
      monthly_earnings = monthly_earnings + earnings_amount
    WHERE user_id = track_owner_id;

    -- Update post stats
    UPDATE posts 
    SET 
      streams_count = streams_count + 1,
      earnings = earnings + earnings_amount
    WHERE id = (SELECT post_id FROM music_tracks WHERE id = p_track_id);
  END IF;

  RETURN earnings_amount;
END;
$$;
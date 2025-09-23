-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaming_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view public profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- User stats policies
CREATE POLICY "Anyone can view user stats" ON user_stats
  FOR SELECT USING (true);

CREATE POLICY "System can manage user stats" ON user_stats
  FOR ALL USING (true);

-- Posts policies
CREATE POLICY "Anyone can view public posts" ON posts
  FOR SELECT USING (
    visibility = 'public' OR 
    user_id::text = auth.uid()::text OR
    (visibility = 'followers' AND EXISTS(
      SELECT 1 FROM follows 
      WHERE follower_id::text = auth.uid()::text 
      AND following_id = posts.user_id
    ))
  );

CREATE POLICY "Users can create own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Music tracks policies
CREATE POLICY "Anyone can view music tracks for visible posts" ON music_tracks
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM posts 
      WHERE posts.id = music_tracks.post_id 
      AND (
        posts.visibility = 'public' OR 
        posts.user_id::text = auth.uid()::text OR
        (posts.visibility = 'followers' AND EXISTS(
          SELECT 1 FROM follows 
          WHERE follower_id::text = auth.uid()::text 
          AND following_id = posts.user_id
        ))
      )
    )
  );

CREATE POLICY "Users can manage own music tracks" ON music_tracks
  FOR ALL USING (
    EXISTS(
      SELECT 1 FROM posts 
      WHERE posts.id = music_tracks.post_id 
      AND posts.user_id::text = auth.uid()::text
    )
  );

-- Follows policies
CREATE POLICY "Anyone can view follows" ON follows
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own follows" ON follows
  FOR ALL USING (auth.uid()::text = follower_id::text);

-- Likes policies
CREATE POLICY "Anyone can view likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON likes
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Comments policies
CREATE POLICY "Anyone can view comments for visible posts" ON comments
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM posts 
      WHERE posts.id = comments.post_id 
      AND (
        posts.visibility = 'public' OR 
        posts.user_id::text = auth.uid()::text OR
        (posts.visibility = 'followers' AND EXISTS(
          SELECT 1 FROM follows 
          WHERE follower_id::text = auth.uid()::text 
          AND following_id = posts.user_id
        ))
      )
    )
  );

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Playlists policies
CREATE POLICY "Anyone can view public playlists" ON playlists
  FOR SELECT USING (is_public = true OR auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own playlists" ON playlists
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Playlist tracks policies
CREATE POLICY "Users can view playlist tracks for accessible playlists" ON playlist_tracks
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_tracks.playlist_id 
      AND (playlists.is_public = true OR playlists.user_id::text = auth.uid()::text)
    )
  );

CREATE POLICY "Users can manage own playlist tracks" ON playlist_tracks
  FOR ALL USING (
    EXISTS(
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_tracks.playlist_id 
      AND playlists.user_id::text = auth.uid()::text
    )
  );

-- Streaming sessions policies
CREATE POLICY "Users can view own streaming sessions" ON streaming_sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create streaming sessions" ON streaming_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);

-- Earnings policies
CREATE POLICY "Users can view own earnings" ON earnings
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can create earnings" ON earnings
  FOR INSERT WITH CHECK (true);

-- User actions policies (for analytics)
CREATE POLICY "Users can view own actions" ON user_actions
  FOR SELECT USING (auth.uid()::text = user_id::text OR user_id IS NULL);

CREATE POLICY "Anyone can log actions" ON user_actions
  FOR INSERT WITH CHECK (true);
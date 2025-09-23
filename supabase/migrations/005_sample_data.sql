-- Insert sample users
INSERT INTO users (id, email, username, full_name, user_type, bio, is_verified, theme_preference) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'olivia@example.com', 'oliviarodrigo', 'Olivia Rodrigo', 'artist', '🎵 Singer-songwriter | Creating music that speaks to the heart', true, 'emerald'),
  ('550e8400-e29b-41d4-a716-446655440001', 'weeknd@example.com', 'theweeknd', 'The Weeknd', 'artist', '🌙 R&B Artist | XO', true, 'crimson'),
  ('550e8400-e29b-41d4-a716-446655440002', 'circles@example.com', 'circlesmusic', 'Circles', 'artist', '🎶 Electronic Music Producer | Collaborative vibes', true, 'cobalt'),
  ('550e8400-e29b-41d4-a716-446655440003', 'fan1@example.com', 'musiclover123', 'Alex Johnson', 'fan', 'Music enthusiast | Always discovering new sounds', false, 'magenta'),
  ('550e8400-e29b-41d4-a716-446655440004', 'producer@example.com', 'beatmaker', 'Jordan Smith', 'producer', '🎛️ Beat Producer | Creating the next hits', false, 'tangerine');

-- Insert sample posts
INSERT INTO posts (id, user_id, content, post_type, media_data, likes_count, comments_count, streams_count, earnings) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Just dropped my latest track! This one''s been in the works for months and I can''t wait for you all to hear it. The emotions in this song run deep 🎵', 'music', '{"thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop"}', 386, 133, 125000, 1247.50),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Working on something special in the studio tonight. The creative process never stops 🌙', 'music', '{"thumbnail": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"}', 892, 234, 89000, 2156.75),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Collaboration is the heart of music. Excited to share this new project! 🎶', 'music', '{"thumbnail": "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop"}', 445, 87, 45000, 567.25);

-- Insert sample music tracks
INSERT INTO music_tracks (post_id, title, artist_name, album, genre, duration, cover_art_url) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', 'drivers license', 'Olivia Rodrigo', 'SOUR', 'Pop', 242, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop'),
  ('660e8400-e29b-41d4-a716-446655440001', 'Blinding Lights', 'The Weeknd', 'After Hours', 'R&B', 200, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Eternal Vibes', 'Circles', 'Electronic Dreams', 'Electronic', 195, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop');

-- Insert sample follows
INSERT INTO follows (follower_id, following_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000'),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample likes
INSERT INTO likes (user_id, post_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440000'),
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440000');

-- Update user stats to match sample data
UPDATE user_stats SET 
  followers_count = 2,
  posts_count = 1,
  total_streams = 125000,
  total_earnings = 1247.50
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';

UPDATE user_stats SET 
  followers_count = 1,
  posts_count = 1,
  total_streams = 89000,
  total_earnings = 2156.75
WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE user_stats SET 
  followers_count = 1,
  posts_count = 1,
  total_streams = 45000,
  total_earnings = 567.25
WHERE user_id = '550e8400-e29b-41d4-a716-446655440002';

UPDATE user_stats SET 
  following_count = 2
WHERE user_id = '550e8400-e29b-41d4-a716-446655440003';

UPDATE user_stats SET 
  following_count = 2
WHERE user_id = '550e8400-e29b-41d4-a716-446655440004';
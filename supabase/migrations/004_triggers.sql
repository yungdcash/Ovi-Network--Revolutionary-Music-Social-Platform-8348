-- Trigger to automatically create user stats when user is created
CREATE OR REPLACE FUNCTION create_user_stats_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_user_stats
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_stats_trigger();

-- Trigger to update post counts when posts are created/deleted
CREATE OR REPLACE FUNCTION update_post_count_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_stats SET posts_count = posts_count + 1 WHERE user_id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_stats SET posts_count = posts_count - 1 WHERE user_id = OLD.user_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_count_insert
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_post_count_trigger();

CREATE TRIGGER trigger_update_post_count_delete
  AFTER DELETE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_post_count_trigger();

-- Trigger to update comment counts
CREATE OR REPLACE FUNCTION update_comment_count_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_count_insert
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_count_trigger();

CREATE TRIGGER trigger_update_comment_count_delete
  AFTER DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_count_trigger();

-- Trigger to update playlist track counts
CREATE OR REPLACE FUNCTION update_playlist_stats_trigger()
RETURNS TRIGGER AS $$
DECLARE
  total_dur INTEGER := 0;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Get duration and update playlist
    SELECT COALESCE(duration, 0) INTO total_dur FROM music_tracks WHERE id = NEW.track_id;
    
    UPDATE playlists 
    SET 
      tracks_count = tracks_count + 1,
      total_duration = total_duration + total_dur
    WHERE id = NEW.playlist_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Get duration and update playlist
    SELECT COALESCE(duration, 0) INTO total_dur FROM music_tracks WHERE id = OLD.track_id;
    
    UPDATE playlists 
    SET 
      tracks_count = tracks_count - 1,
      total_duration = total_duration - total_dur
    WHERE id = OLD.playlist_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_playlist_stats_insert
  AFTER INSERT ON playlist_tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_playlist_stats_trigger();

CREATE TRIGGER trigger_update_playlist_stats_delete
  AFTER DELETE ON playlist_tracks
  FOR EACH ROW
  EXECUTE FUNCTION update_playlist_stats_trigger();
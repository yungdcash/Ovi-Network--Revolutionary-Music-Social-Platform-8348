# Ovi Network - Supabase Backend Documentation

## Overview

This document provides comprehensive information about the Supabase backend implementation for Ovi Network, a revolutionary real-time social media music networking platform.

## Database Schema

### Core Tables

#### Users (`users`)
- **Purpose**: Store user profiles and account information
- **Key Fields**: 
  - `id` (UUID): Primary key
  - `email`, `username`: Unique identifiers
  - `user_type`: ENUM (artist, fan, producer)
  - `theme_preference`: User's selected theme
  - `privacy_settings`: JSONB for privacy controls

#### Posts (`posts`)
- **Purpose**: Store user posts (music, text, images, videos)
- **Key Fields**:
  - `post_type`: ENUM for different content types
  - `media_data`: JSONB for media metadata
  - `earnings`: Real-time earnings tracking
  - `visibility`: public, followers, private

#### Music Tracks (`music_tracks`)
- **Purpose**: Detailed metadata for music content
- **Key Fields**:
  - `title`, `artist_name`, `album`, `genre`
  - `duration`, `file_url`, `cover_art_url`
  - `streaming_stats`: JSONB for analytics

#### User Stats (`user_stats`)
- **Purpose**: Aggregated user statistics
- **Key Fields**:
  - `followers_count`, `following_count`
  - `total_streams`, `total_earnings`
  - `monthly_streams`, `monthly_earnings`

### Social Features

#### Follows (`follows`)
- **Purpose**: User following relationships
- **Features**: Automatic stat updates via triggers

#### Likes (`likes`)
- **Purpose**: Post likes with real-time updates
- **Features**: Notification creation, engagement tracking

#### Comments (`comments`)
- **Purpose**: Hierarchical commenting system
- **Features**: Nested replies, like counts

### Analytics & Monetization

#### Streaming Sessions (`streaming_sessions`)
- **Purpose**: Track music playback for analytics and earnings
- **Key Fields**:
  - `session_duration`, `completion_percentage`
  - `earnings_generated`, `device_info`

#### Earnings (`earnings`)
- **Purpose**: Detailed earnings tracking
- **Key Fields**:
  - `amount`, `source` (stream, tip, share)
  - `transaction_data`: JSONB for detailed info

#### User Actions (`user_actions`)
- **Purpose**: Analytics and user behavior tracking
- **Features**: Session tracking, action logging

## API Functions

### Core Functions

#### `get_user_feed(user_uuid, page_size, page_offset)`
- Returns paginated user feed with social context
- Includes like status, music metadata
- Respects privacy settings and following relationships

#### `get_trending_content(time_period)`
- Algorithm-based trending content discovery
- Weighted scoring based on engagement metrics
- Time-decay factor for relevance

#### `get_user_profile(profile_user_id, requesting_user_id)`
- Complete user profile with statistics
- Privacy-aware earnings display
- Following status for requesting user

### Social Functions

#### `toggle_like(user_id, post_id)`
- Atomic like/unlike operations
- Automatic notification creation
- Real-time counter updates

#### `toggle_follow(follower_id, following_id)`
- Follow/unfollow with stat updates
- Notification system integration
- Bi-directional relationship management

### Music Functions

#### `create_music_post(user_id, content, media_data, track_details)`
- Atomic post and track creation
- Automatic user stat updates
- Media metadata storage

#### `record_stream(user_id, track_id, duration, completion_percentage)`
- Streaming session recording
- Dynamic earnings calculation
- Real-time analytics updates

## Security & Privacy

### Row Level Security (RLS)
- Comprehensive RLS policies on all tables
- User-specific data access controls
- Privacy setting enforcement

### Data Protection
- Email verification system
- Secure user authentication
- GDPR-compliant data handling

## Real-time Features

### Supabase Realtime
- Live notifications
- Real-time like/comment updates
- Streaming analytics

### WebSocket Subscriptions
- Post engagement tracking
- Notification delivery
- Live user activity

## API Integration

### Frontend Integration
```javascript
// Example usage
import { feedApi } from '../lib/supabaseApi';

// Get user feed
const feed = await feedApi.getUserFeed(userId, 20, 0);

// Toggle like
const result = await socialApi.toggleLike(userId, postId);

// Record stream
const earnings = await musicApi.recordStream(userId, trackId, duration);
```

### Custom Hooks
- `useFeed()`: Paginated feed with infinite scroll
- `useUser()`: User profile management
- `useSocialActions()`: Social interaction handling
- `useNotifications()`: Real-time notification management

## Performance Optimizations

### Database Indexes
- Strategic indexing on frequently queried columns
- Composite indexes for complex queries
- Performance monitoring and optimization

### Caching Strategy
- Function result caching
- Computed statistics caching
- Real-time data synchronization

### Scalability
- Horizontal scaling support
- Connection pooling
- Query optimization

## Analytics & Insights

### User Behavior Tracking
- Comprehensive action logging
- Session analysis
- Engagement metrics

### Revenue Analytics
- Real-time earnings tracking
- Revenue source attribution
- Performance insights

### Content Analytics
- Trending algorithm
- Engagement scoring
- Discovery optimization

## Development Workflow

### Migration System
```bash
# Apply migrations
supabase db push

# Generate types
supabase gen types typescript --local > types/database.types.ts

# Run locally
supabase start
```

### Testing
- Unit tests for database functions
- Integration tests for API endpoints
- Performance testing for scalability

## Production Deployment

### Environment Configuration
- Production database setup
- Security policy configuration
- Performance tuning

### Monitoring
- Real-time performance monitoring
- Error tracking and alerting
- Usage analytics

## Future Enhancements

### Planned Features
- Advanced recommendation engine
- Collaborative playlists
- Live streaming integration
- NFT marketplace integration

### Scalability Improvements
- Microservices architecture
- Edge function optimization
- Global CDN integration

## Support & Maintenance

### Backup Strategy
- Automated daily backups
- Point-in-time recovery
- Disaster recovery procedures

### Security Updates
- Regular security audits
- Dependency updates
- Vulnerability monitoring

## API Reference

For detailed API documentation, see the generated Supabase documentation at:
- Local: `http://localhost:54323`
- Production: Your Supabase project dashboard

## Contributing

When contributing to the backend:
1. Follow the migration naming convention
2. Add appropriate RLS policies for new tables
3. Update API functions for new features
4. Include comprehensive tests
5. Update this documentation

## Contact

For backend-related questions or issues, please refer to the main project documentation or create an issue in the repository.
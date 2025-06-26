# Movono Production Setup Guide

## 🚀 Production-Ready Movie Synchronization System

This guide will help you set up Movono for production with automatic movie synchronization from multiple sources.

## 📋 Features Implemented

### ✅ **Automatic Movie Synchronization**
- **YTS Integration**: Automatically syncs latest downloadable movies from YTS
- **TMDB Integration**: Syncs upcoming movies from TMDB
- **Smart Updates**: Existing movies are updated with better quality data
- **Rate Limiting**: Built-in delays to avoid API restrictions
- **Error Handling**: Comprehensive error handling and logging

### ✅ **Database Integration**
- **Supabase Integration**: All movies stored in `movies_mini` table
- **YTS Fields**: Added YTS-specific fields for better data quality
- **Indexing**: Optimized database indexes for performance
- **Source Tracking**: Track data source (manual, tmdb, yts)

### ✅ **Admin Interface**
- **Sync Dashboard**: Real-time sync status and controls
- **Manual Triggers**: Sync YTS, TMDB, or both
- **Statistics**: Detailed sync results and metrics
- **User-Friendly**: Easy-to-use interface in profile page

## 🔧 Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# API Keys
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key

# Authentication (for sync API)
SYNC_API_TOKEN=your_secure_token_here
```

## 🗄️ Database Setup

### 1. Run the Migration
Apply the new migration to add YTS fields:

```sql
-- This will be run automatically when you deploy
-- File: supabase/migrations/20240324000000_add_yts_fields.sql
```

### 2. Verify Database Structure
Your `movies_mini` table should now include:
- `yts_id` - YTS movie ID
- `source` - Data source (manual, tmdb, yts)
- `torrents` - JSON array of torrent information
- `yt_trailer_code` - YouTube trailer code
- `mpa_rating` - MPA rating
- `background_image` - Background image URL
- `date_uploaded` - Upload date
- `date_uploaded_unix` - Unix timestamp

## 🚀 Deployment Setup

### 1. Vercel Deployment
The `vercel.json` file configures:
- **Automatic Cron Jobs**: Runs every 6 hours
- **Function Timeout**: 5 minutes for sync operations
- **Production Optimization**: Optimized for production workloads

### 2. Supabase Setup
1. Deploy your Supabase project
2. Run all migrations
3. Set up Row Level Security (RLS) policies
4. Configure environment variables

### 3. API Security
Update the sync API authentication in `app/api/sync-movies/route.ts`:

```typescript
// Replace with your secure authentication
const authHeader = request.headers.get('authorization');
if (!authHeader || !authHeader.startsWith('Bearer ') || 
    authHeader !== `Bearer ${process.env.SYNC_API_TOKEN}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

## 📊 Monitoring & Analytics

### 1. Sync Dashboard
Access the sync dashboard at: `/members/profile?tab=sync`

Features:
- Real-time sync status
- Manual trigger buttons
- Detailed statistics
- Error reporting

### 2. Database Monitoring
Monitor your database for:
- New movies added
- Sync frequency
- Error rates
- Performance metrics

### 3. Logs
Check Vercel function logs for:
- Sync execution times
- Error details
- API rate limiting
- Database performance

## 🔄 Automatic Sync Schedule

### Production Schedule
- **Frequency**: Every 6 hours
- **Sources**: YTS + TMDB
- **Duration**: ~2-3 minutes
- **Movies per sync**: ~20-40 movies

### Manual Triggers
- **YTS Only**: Sync latest downloadable movies
- **TMDB Only**: Sync upcoming movies
- **Full Sync**: Both sources together

## 🛡️ Production Best Practices

### 1. Rate Limiting
- Built-in delays between API calls
- Respects API rate limits
- Graceful error handling

### 2. Error Handling
- Comprehensive error logging
- Graceful degradation
- Retry mechanisms

### 3. Performance
- Database indexing
- Efficient queries
- Background processing

### 4. Security
- API authentication
- Environment variable protection
- Database RLS policies

## 📈 Scaling Considerations

### 1. Database Performance
- Monitor query performance
- Add indexes as needed
- Consider partitioning for large datasets

### 2. API Limits
- Monitor API usage
- Implement caching where possible
- Consider multiple API keys

### 3. Storage
- Monitor database size
- Implement cleanup strategies
- Consider archiving old data

## 🔍 Troubleshooting

### Common Issues

1. **Sync Failing**
   - Check API keys
   - Verify database connection
   - Check function logs

2. **Rate Limiting**
   - Increase delays between calls
   - Check API usage limits
   - Implement exponential backoff

3. **Database Errors**
   - Verify table structure
   - Check RLS policies
   - Monitor connection limits

### Debug Commands

```bash
# Check sync status
curl -X POST /api/sync-movies \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"type": "yts"}'

# View function logs
vercel logs --follow
```

## 🎯 Next Steps

### Immediate
1. Deploy to production
2. Test sync functionality
3. Monitor performance
4. Set up alerts

### Future Enhancements
1. **Popular Movies Sync**: Add TMDB popular movies
2. **Trending Movies**: Real-time trending data
3. **User Notifications**: Notify users of new movies
4. **Advanced Filtering**: Genre-based sync
5. **Analytics Dashboard**: Detailed sync analytics

## 📞 Support

For issues or questions:
1. Check the logs first
2. Review this documentation
3. Test in development environment
4. Contact support with detailed error information

---

**Your Movono project is now production-ready with comprehensive movie synchronization! 🎬✨** 
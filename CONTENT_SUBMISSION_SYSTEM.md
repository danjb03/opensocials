# Content Submission and Campaign Proof-Tracking System

## Overview

Production-ready backend system for managing creator content submissions, brand reviews, and campaign proof tracking. Built with Supabase (PostgreSQL) and Edge Functions.

## Architecture

### Database Schema

#### Core Tables
- **`campaign_briefs`** - Campaign-specific content requirements and briefs
- **`uploads`** - Creator content submissions with approval workflow
- **`upload_deliverables`** - Links uploads to specific deliverable requirements
- **`upload_reviews`** - Brand review actions, comments, and feedback
- **`proof_log`** - Tracks when content was posted live with metrics
- **`campaign_analytics`** - Aggregated campaign performance data
- **`notification_queue`** - Queued notifications for email/push delivery

#### Key Relationships
```sql
campaigns -> campaign_briefs -> uploads -> upload_reviews
                              |
                              v
                          proof_log -> campaign_analytics
```

### Edge Functions

1. **`submit-content`** - Creator content submission
2. **`review-content`** - Brand approval/rejection workflow
3. **`submit-proof`** - Manual proof submission by creators
4. **`get-campaign-report`** - Comprehensive campaign analytics
5. **`process-notifications`** - Notification delivery system
6. **`ai-content-detector`** - Automated content detection

## Workflow

### 1. Content Submission
**Creator uploads content**
```bash
POST /functions/v1/submit-content
```
- Links to specific brief and campaign
- Sets status to `pending_review`
- **Trigger**: Automatically notifies brand via `notification_queue`

### 2. Brand Review
**Brand reviews submission**
```bash
POST /functions/v1/review-content
```
- Actions: `approve`, `reject`, `request_revision`
- **Trigger**: Automatically notifies creator with decision
- **Approved**: "You're good to go. POST NOW."
- **Rejected**: "Brand requested changes: [reason]"

### 3. Content Posting
**Creator posts approved content**

### 4. Proof Submission
**Two methods:**

#### A. Manual Submission
```bash
POST /functions/v1/submit-proof
```
Creator submits live link with metrics

#### B. AI Detection
```bash
POST /functions/v1/ai-content-detector
```
Scheduled system detects posts via platform APIs

### 5. Campaign Reporting
**Generate comprehensive reports**
```bash
GET /functions/v1/get-campaign-report?campaign_id=xxx
```

## API Reference

### Submit Content
```typescript
POST /functions/v1/submit-content
{
  campaign_id: string;
  brief_id: string;
  file_url: string;
  file_name: string;
  content_type: 'video' | 'image' | 'story' | 'post';
  platform: 'instagram' | 'tiktok' | 'youtube';
  title?: string;
  description?: string;
  deliverable_specs: Array<{
    deliverable_type: string;
    deliverable_spec: object;
    is_primary: boolean;
  }>;
}
```

### Review Content
```typescript
POST /functions/v1/review-content
{
  upload_id: string;
  action: 'approve' | 'reject' | 'request_revision';
  comments?: string;
  feedback_data?: object;
}
```

### Submit Proof
```typescript
POST /functions/v1/submit-proof
{
  upload_id: string;
  proof_url: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  post_type: 'story' | 'post' | 'reel' | 'video';
  posted_at: string; // ISO timestamp
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    shares?: number;
  };
}
```

### Get Campaign Report
```typescript
GET /functions/v1/get-campaign-report?campaign_id=xxx&creator_id=yyy
Response: {
  campaign_id: string;
  campaign_name: string;
  total_creators: number;
  total_uploads: number;
  approved_uploads: number;
  live_posts: number;
  creators: Array<{
    creator_name: string;
    uploads_count: number;
    live_posts_count: number;
    proof_urls: string[];
  }>;
  proof_log: Array<{
    creator_name: string;
    platform: string;
    proof_url: string;
    posted_at: string;
    metrics: object;
  }>;
}
```

## Security

### Row Level Security (RLS)
- **Brand Access**: Can manage their own campaigns and view related uploads
- **Creator Access**: Can manage their own uploads and view assigned briefs
- **Admin Access**: Full system access for platform administrators

### Authentication
All endpoints require valid Supabase JWT tokens via `Authorization: Bearer <token>` header.

## Notifications

### Automatic Triggers
1. **Upload Submitted** → Brand notification
2. **Content Reviewed** → Creator notification  
3. **Proof Submitted** → Brand notification
4. **Campaign Live** → Brand notification

### Delivery Methods
- Email notifications (integrate with Resend/SendGrid)
- Push notifications (integrate with Firebase/Pusher)
- In-app notifications
- SMS notifications (integrate with Twilio)

## AI Content Detection

### Automated Scanning
Periodically scans creator social media accounts for posted content:

1. **Platform Integration**: Instagram, TikTok, YouTube APIs
2. **Content Matching**: AI/ML analysis of visual and textual similarity
3. **Confidence Scoring**: Machine learning confidence thresholds
4. **Automatic Logging**: Creates proof entries for high-confidence matches

### Scheduling
Run via cron job every 30 minutes:
```bash
curl -X POST "https://your-project.supabase.co/functions/v1/ai-content-detector"
```

## Analytics & Reporting

### Campaign Metrics
- Total uploads vs approved vs rejected
- Creator participation rates
- Live post tracking with proof URLs
- Engagement metrics aggregation
- Timeline analysis of submission-to-post workflow

### Export Capabilities
- Per-creator reports
- Full campaign reports
- CSV/JSON export formats
- Real-time analytics dashboard data

## Deployment

### Migration
```sql
-- Run the migration
supabase db reset
supabase migration up
```

### Edge Functions
```bash
# Deploy all functions
supabase functions deploy submit-content
supabase functions deploy review-content
supabase functions deploy submit-proof
supabase functions deploy get-campaign-report
supabase functions deploy process-notifications
supabase functions deploy ai-content-detector
```

### Environment Variables
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key  # For email notifications
FCM_SERVER_KEY=your_fcm_key         # For push notifications
```

## Performance Considerations

### Indexing
All foreign keys and frequently queried columns have proper indexes:
- `uploads(campaign_id, creator_id, status)`
- `proof_log(campaign_id, creator_id, posted_at)`
- `notification_queue(user_id, status, scheduled_for)`

### Batching
- Notification processing in batches of 50
- AI detection scanning optimized with date ranges
- Campaign analytics calculated incrementally

### Caching
- Campaign reports cached at database level
- Analytics summaries updated via triggers
- Real-time data for critical workflow steps

## Monitoring

### Health Checks
- Function execution logs
- Database trigger performance
- Notification delivery rates
- AI detection accuracy metrics

### Error Handling
- Comprehensive error logging
- Fallback mechanisms for failed notifications
- Retry logic for platform API calls
- Graceful degradation for AI detection

This system handles the complete creator-brand content workflow from submission to proof tracking, with production-ready scalability and monitoring capabilities.
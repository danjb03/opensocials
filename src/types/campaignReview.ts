
export interface CampaignSubmission {
  id: string;
  campaign_id: string;
  creator_id: string;
  submission_type: string; // Changed from union type to string to match database
  content_data: {
    files?: Array<{
      url: string;
      type: 'image' | 'video';
      name: string;
      size?: number;
    }>;
    caption?: string;
    hashtags?: string[];
    platform?: string;
    scheduled_date?: string;
  };
  status: string; // Changed from union type to string to match database
  submission_notes?: string | null;
  created_at: string | null;
  updated_at: string | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  creator_info?: {
    id: string;
    name: string;
    avatar_url?: string | null;
  };
}

export interface SubmissionReview {
  id: string;
  submission_id: string;
  reviewer_id: string;
  action: 'approve' | 'request_revision' | 'reject';
  feedback_text?: string | null;
  review_data: Record<string, any>;
  created_at: string;
}

export interface CampaignNotification {
  id: string;
  user_id: string;
  campaign_id?: string | null;
  submission_id?: string | null;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean | null;
  created_at: string | null;
}

export type ReviewStage = 'campaign_setup' | 'awaiting_submissions' | 'reviewing_content' | 'ready_to_launch' | 'live' | 'completed';

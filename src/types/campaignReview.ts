
export interface CampaignSubmission {
  id: string;
  campaign_id: string;
  creator_id: string;
  submission_type: 'content' | 'revision';
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
  status: 'draft' | 'submitted' | 'approved' | 'revision_requested' | 'rejected';
  submission_notes?: string;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  reviewed_at?: string;
  creator_info?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

export interface SubmissionReview {
  id: string;
  submission_id: string;
  reviewer_id: string;
  action: 'approve' | 'request_revision' | 'reject';
  feedback_text?: string;
  review_data: Record<string, any>;
  created_at: string;
}

export interface CampaignNotification {
  id: string;
  user_id: string;
  campaign_id?: string;
  submission_id?: string;
  notification_type: 'submission_received' | 'review_completed' | 'revision_requested' | 'campaign_launched';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type ReviewStage = 'campaign_setup' | 'awaiting_submissions' | 'reviewing_content' | 'ready_to_launch' | 'live' | 'completed';

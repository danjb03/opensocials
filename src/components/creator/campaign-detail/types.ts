
export interface UploadItem {
  id: string;
  filename?: string;
  url?: string;
  uploadedAt?: string;
  status?: string;
  title?: string;
  created_at?: string;
  content_data?: {
    files?: Array<{
      url: string;
      type: 'image' | 'video';
      name: string;
    }>;
    caption?: string;
    hashtags?: string[];
    platform?: string;
  };
  submission_notes?: string;
  reviewed_at?: string;
  feedback_text?: string;
  revision_count?: number;
  proof?: {
    id: string;
    proof_url: string;
    posted_at: string;
    status: string;
  };
}

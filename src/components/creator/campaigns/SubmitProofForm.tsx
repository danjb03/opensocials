import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface SubmitProofFormProps {
  submissionId: string;
  campaignId: string;
  onSuccess?: () => void;
}

const SubmitProofForm: React.FC<SubmitProofFormProps> = ({ 
  submissionId, 
  campaignId,
  onSuccess 
}) => {
  const [proofUrl, setProofUrl] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube' | ''>('');
  const [postType, setPostType] = useState<'post' | 'story' | 'reel' | 'video' | ''>('');
  const [metrics, setMetrics] = useState({
    likes: '',
    comments: '',
    views: '',
    shares: ''
  });
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const submitProof = useMutation({
    mutationFn: async () => {
      if (!proofUrl.trim()) {
        throw new Error('Post URL is required');
      }

      if (!platform) {
        throw new Error('Platform is required');
      }

      if (!postType) {
        throw new Error('Post type is required');
      }

      // URL validation
      try {
        new URL(proofUrl);
      } catch (e) {
        throw new Error('Please enter a valid URL');
      }

      // Platform-specific URL validation
      if (platform === 'instagram' && !proofUrl.includes('instagram.com')) {
        throw new Error('Please enter a valid Instagram URL');
      } else if (platform === 'tiktok' && !proofUrl.includes('tiktok.com')) {
        throw new Error('Please enter a valid TikTok URL');
      } else if (platform === 'youtube' && !proofUrl.includes('youtube.com') && !proofUrl.includes('youtu.be')) {
        throw new Error('Please enter a valid YouTube URL');
      }

      const { error } = await supabase.functions.invoke('submit-proof', {
        body: {
          upload_id: submissionId,
          campaign_id: campaignId,
          proof_url: proofUrl,
          platform,
          post_type: postType,
          posted_at: new Date().toISOString(),
          metrics: {
            likes: metrics.likes ? parseInt(metrics.likes) : undefined,
            comments: metrics.comments ? parseInt(metrics.comments) : undefined,
            views: metrics.views ? parseInt(metrics.views) : undefined,
            shares: metrics.shares ? parseInt(metrics.shares) : undefined,
          },
          notes
        }
      });

      if (error) throw error;

      return { success: true };
    },
    onSuccess: () => {
      toast.success('Proof submitted successfully! Your payment will be processed soon.');
      queryClient.invalidateQueries({ queryKey: ['creator-campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-submissions', campaignId] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit proof');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProof.mutate();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Submit Proof of Posting</CardTitle>
        <CardDescription>
          Provide the link to your published content to release payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={(value) => setPlatform(value as any)}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="postType">Content Type</Label>
            <Select value={postType} onValueChange={(value) => setPostType(value as any)}>
              <SelectTrigger id="postType">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="reel">Reel</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proofUrl">Post URL <span className="text-red-500">*</span></Label>
            <div className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="proofUrl"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Initial Metrics (Optional)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="likes" className="text-xs">Likes</Label>
                <Input
                  id="likes"
                  type="number"
                  min="0"
                  value={metrics.likes}
                  onChange={(e) => setMetrics({...metrics, likes: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="comments" className="text-xs">Comments</Label>
                <Input
                  id="comments"
                  type="number"
                  min="0"
                  value={metrics.comments}
                  onChange={(e) => setMetrics({...metrics, comments: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="views" className="text-xs">Views</Label>
                <Input
                  id="views"
                  type="number"
                  min="0"
                  value={metrics.views}
                  onChange={(e) => setMetrics({...metrics, views: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="shares" className="text-xs">Shares</Label>
                <Input
                  id="shares"
                  type="number"
                  min="0"
                  value={metrics.shares}
                  onChange={(e) => setMetrics({...metrics, shares: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about your post..."
              rows={3}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 space-y-2">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <div>
                <h4 className="font-medium text-amber-800">Valid Proof Requirements</h4>
                <ul className="text-sm text-amber-700 list-disc pl-5 mt-1 space-y-1">
                  <li>URL must be a direct link to the published content</li>
                  <li>Content must match what was approved by the brand</li>
                  <li>Content must be publicly accessible</li>
                  <li>Stories must be highlighted to remain visible</li>
                  <li>Content must include required brand mentions/tags</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          disabled={submitProof.isPending}
          className="w-full"
        >
          {submitProof.isPending ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            <span className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit Proof
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubmitProofForm;

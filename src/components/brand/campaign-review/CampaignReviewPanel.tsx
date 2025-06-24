
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, MessageSquare, Eye, Calendar } from 'lucide-react';
import { useCampaignSubmissions, useReviewSubmission } from '@/hooks/useCampaignSubmissions';
import type { CampaignSubmission } from '@/types/campaignReview';

interface CampaignReviewPanelProps {
  campaignId: string;
  campaignName: string;
}

const CampaignReviewPanel: React.FC<CampaignReviewPanelProps> = ({
  campaignId,
  campaignName
}) => {
  const { data: submissions, isLoading } = useCampaignSubmissions(campaignId);
  const reviewSubmission = useReviewSubmission();
  
  const [selectedSubmission, setSelectedSubmission] = useState<CampaignSubmission | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'request_revision' | 'reject' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleReviewAction = (submission: CampaignSubmission, action: 'approve' | 'request_revision' | 'reject') => {
    setSelectedSubmission(submission);
    setReviewAction(action);
    setFeedbackText('');
    setShowConfirmModal(true);
  };

  const confirmReview = async () => {
    if (!selectedSubmission || !reviewAction) return;

    await reviewSubmission.mutateAsync({
      submissionId: selectedSubmission.id,
      action: reviewAction,
      feedbackText: feedbackText || undefined
    });

    setShowConfirmModal(false);
    setSelectedSubmission(null);
    setReviewAction(null);
    setFeedbackText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'revision_requested': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return 'Awaiting Review';
      case 'approved': return 'Approved';
      case 'revision_requested': return 'Revision Requested';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const pendingSubmissions = submissions?.filter(s => s.status === 'submitted') || [];
  const reviewedSubmissions = submissions?.filter(s => s.status !== 'submitted' && s.status !== 'draft') || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{campaignName} - Content Review</h2>
        <p className="text-muted-foreground">Review and approve creator submissions</p>
      </div>

      {/* Pending Reviews */}
      {pendingSubmissions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Pending Review ({pendingSubmissions.length})</h3>
          <div className="grid gap-4">
            {pendingSubmissions.map((submission) => (
              <Card key={submission.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={submission.creator_info?.avatar_url} />
                        <AvatarFallback>
                          {submission.creator_info?.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{submission.creator_info?.name || 'Creator'}</CardTitle>
                        <CardDescription>
                          Submitted {new Date(submission.submitted_at || submission.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(submission.status)}>
                      {getStatusText(submission.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Content Preview */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Content Preview:</h4>
                    {submission.content_data.caption && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{submission.content_data.caption}</p>
                      </div>
                    )}
                    {submission.content_data.files && submission.content_data.files.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {submission.content_data.files.map((file, index) => (
                          <div key={index} className="relative">
                            {file.type === 'image' ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-20 h-20 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
                                <span className="text-xs text-gray-500">Video</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleReviewAction(submission, 'approve')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept & Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReviewAction(submission, 'request_revision')}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Request Revisions
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReviewAction(submission, 'reject')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Submissions */}
      {reviewedSubmissions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Reviewed Content ({reviewedSubmissions.length})</h3>
          <div className="grid gap-3">
            {reviewedSubmissions.map((submission) => (
              <Card key={submission.id} className="border-l-4 border-l-gray-300">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={submission.creator_info?.avatar_url} />
                        <AvatarFallback>
                          {submission.creator_info?.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{submission.creator_info?.name || 'Creator'}</p>
                        <p className="text-xs text-muted-foreground">
                          Reviewed {submission.reviewed_at ? new Date(submission.reviewed_at).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(submission.status)}>
                      {getStatusText(submission.status)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {submissions?.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Yet</h3>
            <p className="text-gray-500">Waiting for creators to submit their content for review.</p>
          </CardContent>
        </Card>
      )}

      {/* Review Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' && 'Approve Content'}
              {reviewAction === 'request_revision' && 'Request Revisions'}
              {reviewAction === 'reject' && 'Reject Content'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve' && 'Are you sure you want to approve this content? The creator will be notified to post it live.'}
              {reviewAction === 'request_revision' && 'Please provide feedback for the creator to revise their content.'}
              {reviewAction === 'reject' && 'Please provide a reason for rejecting this content.'}
            </DialogDescription>
          </DialogHeader>

          {(reviewAction === 'request_revision' || reviewAction === 'reject') && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Feedback</label>
              <Textarea
                placeholder="Provide specific feedback..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmReview}
              disabled={reviewSubmission.isPending || ((reviewAction === 'request_revision' || reviewAction === 'reject') && !feedbackText.trim())}
              className={
                reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                reviewAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''
              }
            >
              {reviewSubmission.isPending ? 'Processing...' : 
               reviewAction === 'approve' ? 'Approve' :
               reviewAction === 'request_revision' ? 'Request Revisions' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignReviewPanel;


import { useState } from 'react';
import { Campaign } from '@/types/creator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Upload, ExternalLink, MessageSquare, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SubmitProofForm from '@/components/creator/campaigns/SubmitProofForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UploadItem {
  id: string;
  filename?: string;
  url?: string;
  uploadedAt?: string;
  status: string;
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

interface CampaignUploadsProps {
  campaign: Campaign;
  isCompleted: boolean;
}

export const CampaignUploads = ({ campaign, isCompleted }: CampaignUploadsProps) => {
  const navigate = useNavigate();
  const [selectedUpload, setSelectedUpload] = useState<UploadItem | null>(null);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const getStatusBadge = (upload: UploadItem) => {
    // If there's proof, it's been posted
    if (upload.proof) {
      return (
        <Badge className="bg-green-100 text-green-800">
          Posted
        </Badge>
      );
    }

    switch (upload.status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800">
            Approved - Post Required
          </Badge>
        );
      case 'revision_requested':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Revision Requested {upload.revision_count ? `(${upload.revision_count}/2)` : ''}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        );
      case 'submitted':
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Under Review
          </Badge>
        );
    }
  };

  const handleViewDetails = (upload: UploadItem) => {
    setSelectedUpload(upload);
    setShowDetailsDialog(true);
  };

  const handleSubmitProof = (upload: UploadItem) => {
    setSelectedUpload(upload);
    setShowProofDialog(true);
  };

  const handleProofSubmitted = () => {
    setShowProofDialog(false);
    // Could add a success message or refresh data here
  };

  // Format upload date from either created_at or uploadedAt
  const getUploadDate = (upload: UploadItem) => {
    const dateStr = upload.created_at || upload.uploadedAt;
    return dateStr ? format(new Date(dateStr), 'MMM d, yyyy') : 'Unknown date';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Your Uploads</h3>
        
        {!isCompleted && (
          <Button onClick={() => navigate(`/creator/campaigns/${campaign.id}/upload`)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload New Content
          </Button>
        )}
      </div>
      
      {campaign.uploads && campaign.uploads.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {campaign.uploads.map((upload: UploadItem) => (
            <Card key={upload.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{upload.title || 'Uploaded Content'}</h4>
                    <p className="text-sm text-muted-foreground">
                      Uploaded {getUploadDate(upload)}
                    </p>
                    {upload.status === 'revision_requested' && (
                      <p className="text-xs text-yellow-600 flex items-center mt-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Feedback provided
                      </p>
                    )}
                    {upload.proof && (
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Proof submitted
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(upload)}
                  
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(upload)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  
                  {upload.status === 'approved' && !upload.proof && (
                    <Button size="sm" onClick={() => handleSubmitProof(upload)}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Submit Proof
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No Uploads Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You haven't uploaded any content for this campaign yet.
            </p>
            {!isCompleted && (
              <Button onClick={() => navigate(`/creator/campaigns/${campaign.id}/upload`)}>
                Upload Content
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submission Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              View your submission and feedback
            </DialogDescription>
          </DialogHeader>

          {selectedUpload && (
            <Tabs defaultValue="content">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                {selectedUpload.content_data?.files && selectedUpload.content_data.files.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedUpload.content_data.files.map((file, index) => (
                      <div key={index} className="relative">
                        {file.type === 'image' ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-auto rounded-md object-cover"
                          />
                        ) : (
                          <video
                            src={file.url}
                            controls
                            className="w-full h-auto rounded-md"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedUpload.content_data?.caption && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1">Caption</h4>
                    <p className="text-sm p-3 bg-gray-100 rounded-md">{selectedUpload.content_data.caption}</p>
                  </div>
                )}
                
                {selectedUpload.content_data?.hashtags && selectedUpload.content_data.hashtags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Hashtags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedUpload.content_data.hashtags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedUpload.content_data?.platform && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Platform</h4>
                    <Badge>{selectedUpload.content_data.platform}</Badge>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="feedback" className="space-y-4">
                {selectedUpload.status === 'approved' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="text-green-800 font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Content Approved
                    </h4>
                    <p className="text-green-700 text-sm mt-1">
                      Your content has been approved by the brand. 
                      {!selectedUpload.proof && " Please post it and submit the proof link."}
                    </p>
                  </div>
                )}
                
                {selectedUpload.status === 'revision_requested' && selectedUpload.feedback_text && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h4 className="text-yellow-800 font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Revision Requested
                    </h4>
                    <div className="mt-2 text-yellow-700 text-sm whitespace-pre-wrap">
                      {selectedUpload.feedback_text}
                    </div>
                    <p className="mt-3 text-xs text-yellow-600">
                      {selectedUpload.revision_count !== undefined && (
                        <>Revision {selectedUpload.revision_count}/2 • </>
                      )}
                      Requested on {selectedUpload.reviewed_at && format(new Date(selectedUpload.reviewed_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
                
                {selectedUpload.proof && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="text-blue-800 font-medium">Proof of Posting</h4>
                    <a 
                      href={selectedUpload.proof.proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center text-sm mt-1"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {selectedUpload.proof.proof_url}
                    </a>
                    <p className="text-xs text-blue-600 mt-1">
                      Posted on {format(new Date(selectedUpload.proof.posted_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
                
                {!selectedUpload.feedback_text && selectedUpload.status !== 'approved' && (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No feedback provided yet.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Submit Proof Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Proof of Posting</DialogTitle>
            <DialogDescription>
              Provide the link to your published content to release payment
            </DialogDescription>
          </DialogHeader>
          
          {selectedUpload && (
            <SubmitProofForm 
              submissionId={selectedUpload.id}
              campaignId={campaign.id}
              onSuccess={handleProofSubmitted}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

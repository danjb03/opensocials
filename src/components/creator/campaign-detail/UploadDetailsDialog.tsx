
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, MessageSquare, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { UploadItem } from './types';

interface UploadDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  upload: UploadItem | null;
}

export const UploadDetailsDialog = ({ open, onOpenChange, upload }: UploadDetailsDialogProps) => {
  if (!upload) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>
            View your submission and feedback
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            {upload.content_data?.files && upload.content_data.files.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {upload.content_data.files.map((file, index) => (
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
            
            {upload.content_data?.caption && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Caption</h4>
                <p className="text-sm p-3 bg-gray-100 rounded-md">{upload.content_data.caption}</p>
              </div>
            )}
            
            {upload.content_data?.hashtags && upload.content_data.hashtags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Hashtags</h4>
                <div className="flex flex-wrap gap-1">
                  {upload.content_data.hashtags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {upload.content_data?.platform && (
              <div>
                <h4 className="text-sm font-medium mb-1">Platform</h4>
                <Badge>{upload.content_data.platform}</Badge>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="feedback" className="space-y-4">
            {upload.status === 'approved' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h4 className="text-green-800 font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Content Approved
                </h4>
                <p className="text-green-700 text-sm mt-1">
                  Your content has been approved by the brand. 
                  {!upload.proof && " Please post it and submit the proof link."}
                </p>
              </div>
            )}
            
            {upload.status === 'revision_requested' && upload.feedback_text && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="text-yellow-800 font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Revision Requested
                </h4>
                <div className="mt-2 text-yellow-700 text-sm whitespace-pre-wrap">
                  {upload.feedback_text}
                </div>
                <p className="mt-3 text-xs text-yellow-600">
                  {upload.revision_count !== undefined && (
                    <>Revision {upload.revision_count}/2 • </>
                  )}
                  Requested on {upload.reviewed_at && format(new Date(upload.reviewed_at), 'MMM d, yyyy')}
                </p>
              </div>
            )}
            
            {upload.proof && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-blue-800 font-medium">Proof of Posting</h4>
                <a 
                  href={upload.proof.proof_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center text-sm mt-1"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  {upload.proof.proof_url}
                </a>
                <p className="text-xs text-blue-600 mt-1">
                  Posted on {format(new Date(upload.proof.posted_at), 'MMM d, yyyy')}
                </p>
              </div>
            )}
            
            {!upload.feedback_text && upload.status !== 'approved' && (
              <div className="text-center p-4">
                <p className="text-muted-foreground">No feedback provided yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

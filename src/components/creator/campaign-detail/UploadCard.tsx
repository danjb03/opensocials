
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, ExternalLink, MessageSquare, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { UploadItem } from './types';
import { UploadStatusBadge } from './UploadStatusBadge';

interface UploadCardProps {
  upload: UploadItem;
  onViewDetails: (upload: UploadItem) => void;
  onSubmitProof: (upload: UploadItem) => void;
}

export const UploadCard = ({ upload, onViewDetails, onSubmitProof }: UploadCardProps) => {
  // Format upload date from either created_at or uploadedAt
  const getUploadDate = (upload: UploadItem) => {
    const dateStr = upload.created_at || upload.uploadedAt;
    return dateStr ? format(new Date(dateStr), 'MMM d, yyyy') : 'Unknown date';
  };

  return (
    <Card>
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
          <UploadStatusBadge upload={upload} />
          
          <Button variant="outline" size="sm" onClick={() => onViewDetails(upload)}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          
          {upload.status === 'approved' && !upload.proof && (
            <Button size="sm" onClick={() => onSubmitProof(upload)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Submit Proof
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

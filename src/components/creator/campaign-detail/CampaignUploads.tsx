
import { useState } from 'react';
import { Campaign } from '@/types/creator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface UploadItem {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
  status?: 'pending' | 'approved' | 'rejected';
  title?: string;
  created_at: string;
}

interface CampaignUploadsProps {
  campaign: Campaign;
  isCompleted: boolean;
}

export const CampaignUploads = ({ campaign, isCompleted }: CampaignUploadsProps) => {
  const navigate = useNavigate();

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
                      Uploaded {format(new Date(upload.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={upload.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : upload.status === 'rejected' 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {upload.status === 'approved' 
                      ? 'Approved' 
                      : upload.status === 'rejected' 
                      ? 'Needs Revision'
                      : 'Under Review'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
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
    </div>
  );
};

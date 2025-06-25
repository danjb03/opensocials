
import { useState } from 'react';
import { Campaign } from '@/types/creator';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UploadItem } from './types';
import { UploadCard } from './UploadCard';
import { UploadDetailsDialog } from './UploadDetailsDialog';
import { ProofSubmissionDialog } from './ProofSubmissionDialog';
import { EmptyUploadsState } from './EmptyUploadsState';

interface CampaignUploadsProps {
  campaign: Campaign;
  isCompleted: boolean;
}

export const CampaignUploads = ({ campaign, isCompleted }: CampaignUploadsProps) => {
  const navigate = useNavigate();
  const [selectedUpload, setSelectedUpload] = useState<UploadItem | null>(null);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

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

  const handleUploadClick = () => {
    navigate(`/creator/campaigns/${campaign.id}/upload`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Your Uploads</h3>
        
        {!isCompleted && (
          <Button onClick={handleUploadClick}>
            <Upload className="h-4 w-4 mr-2" />
            Upload New Content
          </Button>
        )}
      </div>
      
      {campaign.uploads && campaign.uploads.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {campaign.uploads.map((upload: UploadItem) => (
            <UploadCard
              key={upload.id}
              upload={upload}
              onViewDetails={handleViewDetails}
              onSubmitProof={handleSubmitProof}
            />
          ))}
        </div>
      ) : (
        <EmptyUploadsState 
          isCompleted={isCompleted}
          onUploadClick={handleUploadClick}
        />
      )}

      <UploadDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        upload={selectedUpload}
      />

      <ProofSubmissionDialog
        open={showProofDialog}
        onOpenChange={setShowProofDialog}
        upload={selectedUpload}
        campaignId={campaign.id}
        onSuccess={handleProofSubmitted}
      />
    </div>
  );
};

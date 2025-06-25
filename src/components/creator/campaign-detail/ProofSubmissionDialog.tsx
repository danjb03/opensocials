
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SubmitProofForm from '@/components/creator/campaigns/SubmitProofForm';
import { UploadItem } from './types';

interface ProofSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  upload: UploadItem | null;
  campaignId: string;
  onSuccess: () => void;
}

export const ProofSubmissionDialog = ({ 
  open, 
  onOpenChange, 
  upload, 
  campaignId, 
  onSuccess 
}: ProofSubmissionDialogProps) => {
  if (!upload) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Proof of Posting</DialogTitle>
          <DialogDescription>
            Provide the link to your published content to release payment
          </DialogDescription>
        </DialogHeader>
        
        <SubmitProofForm 
          submissionId={upload.id}
          campaignId={campaignId}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

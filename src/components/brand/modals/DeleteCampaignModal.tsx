
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { deleteCampaign } from '@/utils/campaign';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DeleteCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignName?: string;
}

export const DeleteCampaignModal: React.FC<DeleteCampaignModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  campaignName
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const { success } = await deleteCampaign(campaignId);

      if (success) {
        toast({
          title: "Campaign deleted",
          description: "The campaign has been successfully deleted."
        });
        
        onClose();
        navigate('/brand/dashboard');
      } else {
        toast({
          title: "Error",
          description: "Failed to delete campaign. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            Are you sure you want to delete this campaign?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 mt-2">
            This action is irreversible. All campaign data will be permanently lost.
            {campaignName && (
              <span className="block mt-2 font-medium text-gray-800">
                Campaign: "{campaignName}"
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel 
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </div>
            ) : (
              'Delete Campaign'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

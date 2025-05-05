
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { OrderStage, orderStageLabels } from '@/types/orders';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface CampaignStageNavProps {
  currentStageIndex: number;
  stages: OrderStage[];
  previousStage?: OrderStage;
  nextStage?: OrderStage;
  onClose: () => void;
  onMovePrevious: () => void;
  onMoveNext: () => void;
  canMovePrevious: boolean;
  canMoveNext: boolean;
  orderId: string;
}

const CampaignStageNav: React.FC<CampaignStageNavProps> = ({
  currentStageIndex,
  stages,
  previousStage,
  nextStage,
  onClose,
  onMovePrevious,
  onMoveNext,
  canMovePrevious,
  canMoveNext,
  orderId,
}) => {
  const currentStage = stages[currentStageIndex];
  const isContractPaymentStage = currentStage === 'contract_payment';
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Simplified message for stage info
  const getStageMessage = () => {
    if (isContractPaymentStage) {
      return "Complete all required steps to proceed";
    }
    return `Stage: ${currentStageIndex + 1} of ${stages.length}`;
  };

  const handleDeleteCampaign = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      
      toast({
        title: "Campaign deleted",
        description: "The campaign has been successfully deleted."
      });
      
      // Navigate back to campaigns list
      navigate('/brand/orders');
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to campaigns
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 hover:bg-red-50 text-red-600 border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete Campaign
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this campaign? This action cannot be undone and will remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteCampaign} 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Campaign"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="flex space-x-3">
          {canMovePrevious && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onMovePrevious}
              className="shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous Stage
            </Button>
          )}
          
          {canMoveNext && !isContractPaymentStage && (
            <Button 
              size="sm" 
              onClick={onMoveNext}
              className="shadow-sm bg-black text-white hover:bg-gray-800"
            >
              Complete Next Steps <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="border-t bg-gray-50 flex justify-between p-4 mt-4">
        <div className="text-sm text-gray-500">
          {getStageMessage()}
        </div>
      </div>
    </div>
  );
};

export default CampaignStageNav;

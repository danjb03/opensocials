
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';

interface ContractPaymentStageProps {
  order: Order;
  onComplete: () => void;
}

const ContractPaymentStage: React.FC<ContractPaymentStageProps> = ({ 
  order,
  onComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleComplete = () => {
    setIsLoading(true);
    
    // Simulate contract completion and payment processing
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Contract completed",
        description: "The contract has been finalized and payment processed."
      });
      
      onComplete();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Contract & Payment</h3>
        <p className="text-gray-600 mb-4">
          Review and complete the contract terms and process payment for your campaign.
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-md bg-gray-50 border">
            <h4 className="font-medium text-sm mb-2">Campaign Budget</h4>
            <p className="text-lg font-bold">{order.currency} {order.budget.toLocaleString()}</p>
          </div>
          
          <div className="p-4 rounded-md bg-gray-50 border">
            <h4 className="font-medium text-sm mb-2">Selected Creators</h4>
            <p className="text-lg font-bold">{order.creators.length}</p>
          </div>
          
          <div className="p-4 rounded-md bg-gray-50 border">
            <h4 className="font-medium text-sm mb-2">Payment Terms</h4>
            <p className="text-gray-700">50% upon contract signing, 50% upon campaign completion</p>
          </div>
        </div>
        
        <Button 
          className="w-full bg-black text-white hover:bg-gray-800"
          disabled={isLoading}
          onClick={handleComplete}
        >
          {isLoading ? "Processing..." : "Finalize Contract & Process Payment"}
        </Button>
      </div>
    </div>
  );
};

export default ContractPaymentStage;

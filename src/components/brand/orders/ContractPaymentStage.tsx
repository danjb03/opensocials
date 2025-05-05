
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Upload, FileCheck, CreditCard } from 'lucide-react';

interface ContractPaymentStageProps {
  order: Order;
  onComplete: () => void;
}

const ContractPaymentStage: React.FC<ContractPaymentStageProps> = ({ 
  order,
  onComplete
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [contractFiles, setContractFiles] = useState<File[]>([]);
  const [briefFiles, setBriefFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleContractFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setContractFiles(Array.from(e.target.files));
    }
  };

  const handleBriefFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBriefFiles(Array.from(e.target.files));
    }
  };

  const handleProcessPayment = () => {
    setIsLoading(true);
    
    // Simulate contract upload and payment processing
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Payment processed",
        description: "Contract uploaded and payment processed successfully."
      });
      
      onComplete();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Contract & Payment</h3>
        <p className="text-gray-600 mb-4">
          Upload contract documents, campaign brief, and process payment to finalize your campaign.
        </p>
        
        {/* Contract Upload Section */}
        <div className="mb-6 p-4 border rounded-md">
          <h4 className="font-medium text-sm mb-3">1. Upload Contract Documents</h4>
          <div className="bg-gray-50 border-2 border-dashed rounded-lg p-4 mb-3">
            <div className="flex flex-col items-center py-2">
              <FileUp className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Drag and drop your contract files, or</p>
              <label htmlFor="contract-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">Browse files</span>
                <input 
                  id="contract-upload" 
                  name="contract-upload" 
                  type="file" 
                  className="sr-only" 
                  multiple
                  onChange={handleContractFileChange}
                />
              </label>
            </div>
          </div>
          
          {contractFiles.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Selected Contract Files:</p>
              <div className="space-y-2">
                {contractFiles.map((file, index) => (
                  <div key={index} className="flex items-center p-2 rounded-md bg-blue-50 border border-blue-100">
                    <FileCheck className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Campaign Brief Upload Section */}
        <div className="mb-6 p-4 border rounded-md">
          <h4 className="font-medium text-sm mb-3">2. Upload Campaign Brief</h4>
          <div className="bg-gray-50 border-2 border-dashed rounded-lg p-4 mb-3">
            <div className="flex flex-col items-center py-2">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Upload your campaign brief and materials</p>
              <label htmlFor="brief-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-800 text-sm font-medium">Select files</span>
                <input 
                  id="brief-upload" 
                  name="brief-upload" 
                  type="file" 
                  className="sr-only" 
                  multiple
                  onChange={handleBriefFileChange}
                />
              </label>
            </div>
          </div>
          
          {briefFiles.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Selected Brief Files:</p>
              <div className="space-y-2">
                {briefFiles.map((file, index) => (
                  <div key={index} className="flex items-center p-2 rounded-md bg-green-50 border border-green-100">
                    <FileCheck className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Payment Section */}
        <div className="mb-6 p-4 border rounded-md">
          <h4 className="font-medium text-sm mb-3">3. Process Payment</h4>
          <div className="space-y-4 mb-4">
            <div className="p-3 rounded-md bg-gray-50 border flex items-center justify-between">
              <div>
                <p className="font-medium">Campaign Total</p>
                <p className="text-lg font-bold">{order.currency} {order.budget.toLocaleString()}</p>
              </div>
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
            
            <div className="p-3 rounded-md bg-gray-50 border">
              <p className="font-medium text-sm mb-1">Payment Terms</p>
              <p className="text-sm text-gray-700">
                50% deposit due now ({order.currency} {(order.budget * 0.5).toLocaleString()})<br/>
                50% due upon campaign completion
              </p>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <Button 
          className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
          disabled={isLoading || (contractFiles.length === 0 && briefFiles.length === 0)}
          onClick={handleProcessPayment}
        >
          {isLoading ? "Processing..." : (
            <>
              <CreditCard className="h-4 w-4" />
              Process Payment & Finalize Contract
            </>
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-3">
          By proceeding, you agree to the terms and conditions of this campaign.
        </p>
      </div>
    </div>
  );
};

export default ContractPaymentStage;

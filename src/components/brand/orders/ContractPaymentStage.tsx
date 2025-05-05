
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/orders';
import { useToast } from '@/hooks/use-toast';
import { FileText, Upload, CreditCard, Info, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
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

  const initiatePayment = () => {
    if (contractFiles.length === 0 || briefFiles.length === 0) {
      toast({
        title: "Files Required",
        description: "Please upload both contract documents and campaign brief before proceeding to payment.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPaymentDialogOpen(true);
  };

  const handleProcessPayment = () => {
    setIsLoading(true);
    
    // Here you would integrate with Stripe
    // This is just a placeholder for the actual Stripe integration
    setTimeout(() => {
      setIsLoading(false);
      setIsPaymentDialogOpen(false);
      setIsPaymentSuccessOpen(true);
    }, 2000);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentSuccessOpen(false);
    toast({
      title: "Payment processed",
      description: "Contract uploaded and payment processed successfully."
    });
    onComplete();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#f8fafc] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Contract & Payment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Campaign Brief Upload Section */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-gray-800 mb-2">Campaign Brief</h4>
              <p className="text-gray-600 text-sm mb-4">
                Upload the campaign brief document with all project details
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white hover:border-blue-300 transition-colors">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-blue-500 mb-4" />
                  <p className="text-sm font-medium mb-2">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-500 mb-4">PDF, DOCX, or PPT files</p>
                  
                  <label htmlFor="brief-upload">
                    <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                      <FileText className="mr-2 h-4 w-4" />
                      Select Brief Files
                    </Button>
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
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected Brief Files:</p>
                  <div className="space-y-2">
                    {briefFiles.map((file, index) => (
                      <div key={index} className="flex items-center p-2 rounded-lg bg-white border border-gray-200 shadow-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Contract Documents Upload Section */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-gray-800 mb-2">Contract Documents</h4>
              <p className="text-gray-600 text-sm mb-4">
                Upload the signed contract and any other legal documents
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white hover:border-blue-300 transition-colors">
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-blue-500 mb-4" />
                  <p className="text-sm font-medium mb-2">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-500 mb-4">PDF or DOCX files</p>
                  
                  <label htmlFor="contract-upload">
                    <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                      <FileText className="mr-2 h-4 w-4" />
                      Select Contract Files
                    </Button>
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
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Selected Contract Files:</p>
                  <div className="space-y-2">
                    {contractFiles.map((file, index) => (
                      <div key={index} className="flex items-center p-2 rounded-lg bg-white border border-gray-200 shadow-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Payment Section */}
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4">Payment</h4>
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center mb-6">
                <div className="bg-blue-50 p-3 rounded-full mb-4">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <h5 className="text-lg font-semibold mb-1 text-gray-900">Process Payment</h5>
                <p className="text-gray-600 text-sm">Complete payment to process campaign</p>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-4 mb-6 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h6 className="font-semibold text-gray-900">Campaign Invoice</h6>
                  <span className="text-gray-500 text-sm">#{order.id.substring(0, 8)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Campaign cost</span>
                  <span className="font-medium">{order.currency} {order.budget.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between pt-3 font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{order.currency} {order.budget.toLocaleString()}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-base py-2.5 shadow-sm transition-all"
                disabled={contractFiles.length === 0 || briefFiles.length === 0 || isLoading}
                onClick={initiatePayment}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Process Payment
              </Button>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                Campaign will automatically progress once all steps are completed. Please upload the required documents and complete payment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Complete Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-900">Campaign: {order.title}</h4>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600">Deposit (50%)</span>
                <span className="font-medium">{order.currency} {(order.budget * 0.5).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-gray-900">
                <span>Total Due Now</span>
                <span>{order.currency} {(order.budget * 0.5).toLocaleString()}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              You will be redirected to Stripe's secure payment page to complete your transaction.
            </p>
            
            <Button
              className="w-full bg-[#5469d4] hover:bg-[#4a5bc7] text-white font-medium py-2.5 rounded-lg shadow-sm"
              onClick={handleProcessPayment}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Pay with Stripe"}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Payments are securely processed by Stripe. We do not store your payment details.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Success Dialog */}
      <AlertDialog open={isPaymentSuccessOpen} onOpenChange={setIsPaymentSuccessOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-green-600">Payment Successful!</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Your payment has been processed and the campaign is now ready to move to the planning stage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handlePaymentSuccess} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContractPaymentStage;

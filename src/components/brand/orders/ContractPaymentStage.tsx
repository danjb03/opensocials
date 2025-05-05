
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/types/orders';
import { FileText, Upload, CreditCard, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';

interface ContractPaymentStageProps {
  order: Order;
  onMoveStage: (id: string, newStage: 'planning_creation') => void;
}

const ContractPaymentStage: React.FC<ContractPaymentStageProps> = ({ order, onMoveStage }) => {
  const { toast } = useToast();
  const [briefFiles, setBriefFiles] = useState<File[]>([]);
  const [contractFiles, setContractFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [briefUploaded, setBriefUploaded] = useState(false);
  const [contractUploaded, setContractUploaded] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBriefFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBriefFiles(Array.from(e.target.files));
    }
  };

  const handleContractFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setContractFiles(Array.from(e.target.files));
    }
  };

  const handleUploadBrief = async () => {
    if (briefFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // In a real implementation, upload files to storage
    // For demo purposes, we're simulating a successful upload
    setTimeout(() => {
      setBriefUploaded(true);
      setIsUploading(false);
      toast({
        title: "Brief uploaded",
        description: "Campaign brief has been uploaded successfully",
      });
    }, 1500);
  };

  const handleUploadContract = async () => {
    if (contractFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // In a real implementation, upload files to storage
    // For demo purposes, we're simulating a successful upload
    setTimeout(() => {
      setContractUploaded(true);
      setIsUploading(false);
      toast({
        title: "Contract uploaded",
        description: "Contract documents have been uploaded successfully",
      });
    }, 1500);
  };

  const handlePaymentComplete = () => {
    // In a real implementation, this would be called after successful Stripe payment
    setPaymentComplete(true);
    toast({
      title: "Payment completed",
      description: "Your payment has been processed successfully",
    });
  };

  const handleProceedToNextStage = () => {
    if (!briefUploaded || !contractUploaded || !paymentComplete) {
      toast({
        title: "Cannot proceed",
        description: "Please complete all required steps before proceeding",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Move to next stage
    setTimeout(() => {
      onMoveStage(order.id, 'planning_creation');
      setIsProcessing(false);
      toast({
        title: "Campaign advanced",
        description: "Campaign has moved to Planning & Creation stage",
      });
    }, 1000);
  };

  const handleInitiatePayment = async () => {
    if (!briefUploaded || !contractUploaded) {
      toast({
        title: "Cannot process payment",
        description: "Please upload campaign brief and contract before payment",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would invoke a Supabase Edge Function to create a Stripe checkout session
    toast({
      title: "Redirecting to payment",
      description: "You will be redirected to the payment page",
    });

    // Simulate opening Stripe Checkout
    // In a real implementation, you would redirect to the Stripe Checkout URL
    setTimeout(() => {
      handlePaymentComplete();
    }, 2000);
  };

  const isReadyToProgress = briefUploaded && contractUploaded && paymentComplete;

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-xl">Contract & Payment</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Campaign Brief Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Campaign Brief</h3>
              {briefUploaded && <Check className="h-5 w-5 text-green-500" />}
            </div>
            <p className="text-sm text-gray-500">
              Upload the campaign brief document with all project details
            </p>
            
            <div className={`border-2 ${briefUploaded ? 'border-green-200 bg-green-50' : 'border-dashed'} rounded-lg p-4`}>
              {briefUploaded ? (
                <div className="flex items-center text-green-700">
                  <FileText className="h-5 w-5 mr-2" />
                  <span>Brief uploaded successfully</span>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium mb-1">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-500 mb-2">PDF, DOCX, or PPT files</p>
                  
                  <label htmlFor="brief-upload" className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground px-3 py-2 rounded-md inline-flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Select Brief Files
                    </div>
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
              )}
              
              {!briefUploaded && briefFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">Selected files ({briefFiles.length}):</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {briefFiles.map((file, index) => (
                      <li key={index} className="flex items-center">
                        <FileText className="h-3 w-3 mr-1 text-blue-500" />
                        {file.name}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={handleUploadBrief} 
                    className="mt-2 w-full text-sm"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Brief'}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Contract Upload Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Contract Documents</h3>
              {contractUploaded && <Check className="h-5 w-5 text-green-500" />}
            </div>
            <p className="text-sm text-gray-500">
              Upload the signed contract and any other legal documents
            </p>
            
            <div className={`border-2 ${contractUploaded ? 'border-green-200 bg-green-50' : 'border-dashed'} rounded-lg p-4`}>
              {contractUploaded ? (
                <div className="flex items-center text-green-700">
                  <FileText className="h-5 w-5 mr-2" />
                  <span>Contract uploaded successfully</span>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium mb-1">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-500 mb-2">PDF or DOCX files</p>
                  
                  <label htmlFor="contract-upload" className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground px-3 py-2 rounded-md inline-flex items-center text-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Select Contract Files
                    </div>
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
              )}
              
              {!contractUploaded && contractFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">Selected files ({contractFiles.length}):</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {contractFiles.map((file, index) => (
                      <li key={index} className="flex items-center">
                        <FileText className="h-3 w-3 mr-1 text-blue-500" />
                        {file.name}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={handleUploadContract} 
                    className="mt-2 w-full text-sm"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Contract'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Separator />
        
        {/* Payment Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Payment</h3>
            {paymentComplete && <Check className="h-5 w-5 text-green-500" />}
          </div>
          
          <div className={`p-4 rounded-lg border ${paymentComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
            {paymentComplete ? (
              <div className="text-center text-green-700">
                <Check className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Payment Complete</p>
                <p className="text-sm">Invoice #{order.id.substring(0, 8)} has been paid</p>
              </div>
            ) : (
              <div className="text-center">
                <CreditCard className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <p className="font-medium mb-1">Process Payment</p>
                <p className="text-sm text-gray-500 mb-3">
                  Complete payment to process campaign
                </p>
                
                <div className="bg-white rounded border p-3 mb-4 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Campaign Invoice</span>
                    <span className="text-sm font-medium">#{order.id.substring(0, 8)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Campaign cost</span>
                    <span>{formatCurrency(order.budget, order.currency)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(order.budget, order.currency)}</span>
                  </div>
                </div>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      className="w-full"
                      disabled={!briefUploaded || !contractUploaded || isUploading}
                      onClick={(e) => {
                        // Prevent Sheet from opening if conditions aren't met
                        if (!briefUploaded || !contractUploaded) {
                          e.preventDefault();
                          toast({
                            title: "Cannot process payment",
                            description: "Please upload campaign brief and contract before payment",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Complete Payment</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                          <div className="text-sm text-blue-700">
                            <p className="font-medium mb-1">Payment Simulation</p>
                            <p>In a real implementation, this would connect to Stripe Checkout</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white rounded border p-3">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Invoice Total</span>
                            <span className="text-sm font-medium">{formatCurrency(order.budget, order.currency)}</span>
                          </div>
                        </div>
                        
                        <Button onClick={handleInitiatePayment} className="w-full">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay {formatCurrency(order.budget, order.currency)}
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-sm text-blue-700">
                Campaign will automatically progress once all steps are completed. 
                Please upload the required documents and complete payment.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleProceedToNextStage}
            disabled={!isReadyToProgress || isProcessing}
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Proceed to Planning & Creation'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function for formatting currency (imported from utils, but included here for completeness)
const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
};

export default ContractPaymentStage;

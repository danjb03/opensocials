
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const StripePaymentSetup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSetupPayments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-account-link');
      
      if (error) throw error;
      
      if (data?.success && data?.account_link) {
        // Open Stripe onboarding in new tab
        window.open(data.account_link, '_blank');
        toast.success('Payment setup link opened in new tab');
      } else {
        throw new Error(data?.error || 'Failed to create setup link');
      }
    } catch (error: any) {
      toast.error('Failed to setup payments', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Set up your payment account to receive payments from brands when you complete campaigns.
        </p>
        
        <Button 
          onClick={handleSetupPayments}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          {isLoading ? 'Setting up...' : 'Setup Stripe Payments'}
        </Button>
        
        <div className="text-sm text-gray-500">
          <p>• Secure payment processing via Stripe</p>
          <p>• Direct deposits to your bank account</p>
          <p>• Complete verification required to receive payments</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripePaymentSetup;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, ExternalLink, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

const StripePaymentSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkPaymentMethod();
  }, []);

  const checkPaymentMethod = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-payment-method');
      
      if (error) throw error;
      
      if (data?.payment_method) {
        setPaymentMethod(data.payment_method);
        setIsConnected(true);
      }
    } catch (error: any) {
      // Silently fail if no payment method exists
      console.log('No payment method found:', error.message);
    }
  };

  const handleSetupPayments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-brand-setup-intent');
      
      if (error) throw error;
      
      if (data?.success && data?.setup_url) {
        // Open Stripe setup in new tab
        window.open(data.setup_url, '_blank');
        toast.success('Payment setup opened in new tab');
        
        // Check for updates after a delay
        setTimeout(() => {
          checkPaymentMethod();
        }, 3000);
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

  const handleUpdatePayment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-brand-portal-session');
      
      if (error) throw error;
      
      if (data?.success && data?.portal_url) {
        // Open Stripe customer portal in new tab
        window.open(data.portal_url, '_blank');
        toast.success('Payment management opened in new tab');
      } else {
        throw new Error(data?.error || 'Failed to open payment portal');
      }
    } catch (error: any) {
      toast.error('Failed to open payment management', {
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
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected && paymentMethod ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">
                    {paymentMethod.brand.toUpperCase()} •••• •••• •••• {paymentMethod.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires {paymentMethod.exp_month}/{paymentMethod.exp_year}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleUpdatePayment}
                disabled={isLoading}
              >
                Update
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Connect your payment method to pay for campaigns and manage billing.
            </p>
            
            <Button 
              onClick={handleSetupPayments}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              {isLoading ? 'Setting up...' : 'Setup Payment Method'}
            </Button>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Secure payment processing via Stripe</p>
          <p>• Used for campaign payments and platform fees</p>
          <p>• You can update or change your payment method anytime</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripePaymentSetup;

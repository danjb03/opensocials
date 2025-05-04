
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send an email using the Resend API via Supabase Edge Function
 */
export const sendEmail = async ({ to, subject, html, from }: SendEmailProps) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html, from },
    });

    if (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error sending email:', err);
    toast.error('Failed to send email');
    return { success: false, error: err };
  }
};

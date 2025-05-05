
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async ({ to, subject, html, from = 'OpenSocials <noreply@opensocials.net>' }: SendEmailProps) => {
  try {
    console.log('Sending email to:', to);
    console.log('With subject:', subject);
    
    // Using Supabase Edge Function to send the email
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html, from }
    });
    
    if (error) {
      console.error('Error invoking send-email function:', error);
      toast.error('Failed to send email. Please try again later.');
      return { success: false, error };
    }
    
    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Error sending email:', err);
    toast.error('Failed to send email. Please try again later.');
    return { success: false, error: err };
  }
};

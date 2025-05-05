
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
    console.log('Using Supabase built-in email system');
    console.log('Sending email to:', to);
    console.log('With subject:', subject);
    
    // Using Supabase's built-in email functionality directly
    // Since we can't use the strongly-typed RPC function due to TypeScript definition limitations,
    // we'll use the more flexible functions.invoke method
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to_email: to,
        email_subject: subject,
        email_content: html,
        from_email: from
      }
    });
    
    if (error) {
      console.error('Error sending email via Supabase:', error);
      toast.error('Failed to send email. Please try again later.');
      return { success: false, error };
    }
    
    console.log('Email sent successfully via Supabase built-in system');
    return { success: true, data };
  } catch (err) {
    console.error('Error sending email:', err);
    toast.error('Failed to send email. Please try again later.');
    return { success: false, error: err };
  }
};

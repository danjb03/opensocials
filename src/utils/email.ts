
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// This file is kept as a placeholder in case email functionality is needed in the future
// The Resend functionality has been removed in favor of Supabase's built-in email system

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Placeholder function that logs but doesn't send emails
export const sendEmail = async ({ to, subject, html, from = 'OpenSocials <noreply@opensocials.net>' }: SendEmailProps) => {
  console.log('Email sending has been disabled. Using Supabase native email system instead.');
  console.log('Would have sent email to:', to);
  console.log('With subject:', subject);
  
  return { success: true, data: null };
};

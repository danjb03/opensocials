
-- Create a function to send emails through Supabase
CREATE OR REPLACE FUNCTION public.send_email(
  to_email TEXT,
  email_subject TEXT,
  email_content TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Send the email using Supabase's internal email functionality
  PERFORM net.http_post(
    url := 'https://api.supabase.com/v1/project/' || current_setting('request.jwt.claims', true)::json->>'iss' || '/send-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.jwt.claims', true)::json->>'service_role'
    ),
    body := jsonb_build_object(
      'to', to_email,
      'subject', email_subject,
      'html', email_content
    )
  );
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Grant permissions to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.send_email TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_email TO anon;

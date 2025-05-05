
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface for the email request
interface EmailRequest {
  to_email: string;
  email_subject: string;
  email_content: string;
  from_email?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to_email, email_subject, email_content, from_email }: EmailRequest = await req.json();
    
    // Call the Supabase database function to send the email
    const response = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/rest/v1/rpc/send_email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          "apikey": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
        },
        body: JSON.stringify({
          to_email,
          email_subject,
          email_content
        }),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error calling send_email database function:", errorData);
      throw new Error(`Failed to send email: ${JSON.stringify(errorData)}`);
    }
    
    const result = await response.json();
    console.log("Email sent successfully via database function");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully via Supabase built-in system",
        data: result 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

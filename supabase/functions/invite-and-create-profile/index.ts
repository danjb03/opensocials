
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resendApiKey = Deno.env.get("RESEND_API_KEY");

// Full CORS headers
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400"
};

interface InviteRequest {
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

serve(async (req) => {
  // 💣 PREVENT OPTIONS FAILURE - Handle OPTIONS request before any other logic
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Validate auth token
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user: adminUser } } = await supabase.auth.getUser(token);
    if (!adminUser) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders
      });
    }
    
    // Verify admin role
    const { data: adminRoleData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", adminUser.id)
      .single();
      
    if (!adminRoleData || (adminRoleData.role !== "admin" && adminRoleData.role !== "super_admin")) {
      return new Response(JSON.stringify({ success: false, error: "Forbidden - Requires admin privileges" }), {
        status: 403,
        headers: corsHeaders
      });
    }

    // Get invite data from request - Add try/catch to prevent crash on malformed JSON
    let inviteData: InviteRequest;
    try {
      inviteData = await req.json();
    } catch (jsonError) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid JSON in request body"
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    
    const { email, role, first_name, last_name } = inviteData;

    if (!email || !role) {
      return new Response(JSON.stringify({ success: false, error: "Email and role are required" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Log the invitation attempt
    const { error: logError } = await supabase
      .from("invite_logs")
      .insert({
        email,
        role,
        status: "pending",
        triggered_by: adminUser.id
      });

    if (logError) {
      console.error("Error logging invitation:", logError);
      // Continue with the invitation process even if logging fails
    }

    // Check if user already exists
    const { data: existingUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .limit(1);
      
    if (fetchError) {
      // Update invitation log with error
      await supabase
        .from("invite_logs")
        .update({
          status: "failed",
          error_message: `Error checking for existing user: ${fetchError.message}`
        })
        .eq("email", email)
        .eq("triggered_by", adminUser.id)
        .order("sent_at", { ascending: false })
        .limit(1);
        
      throw new Error(`Error checking for existing user: ${fetchError.message}`);
    }
    
    if (existingUsers && existingUsers.length > 0) {
      // Update invitation log with duplicate status
      await supabase
        .from("invite_logs")
        .update({
          status: "duplicate",
          error_message: "User already invited"
        })
        .eq("email", email)
        .eq("triggered_by", adminUser.id)
        .order("sent_at", { ascending: false })
        .limit(1);
        
      return new Response(JSON.stringify({ success: false, error: "User already invited" }), {
        status: 409,
        headers: corsHeaders
      });
    }

    // Create the user in Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { 
        first_name: first_name || '',
        last_name: last_name || '',
        invited_by: adminUser.id,
        invited_at: new Date().toISOString(),
        role: role
      }
    });

    if (userError) {
      // Update invitation log with error
      await supabase
        .from("invite_logs")
        .update({
          status: "failed",
          error_message: `Failed to create user: ${userError.message}`
        })
        .eq("email", email)
        .eq("triggered_by", adminUser.id)
        .order("sent_at", { ascending: false })
        .limit(1);
        
      throw new Error(`Failed to create user: ${userError.message}`);
    }

    if (!userData.user) {
      // Update invitation log with error
      await supabase
        .from("invite_logs")
        .update({
          status: "failed",
          error_message: "User creation returned no user data"
        })
        .eq("email", email)
        .eq("triggered_by", adminUser.id)
        .order("sent_at", { ascending: false })
        .limit(1);
        
      throw new Error('User creation returned no user data');
    }

    // Create profile entry
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userData.user.id,
        email,
        role,
        first_name: first_name || '',
        last_name: last_name || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'pending'
      });
      
    if (profileError) {
      // Update invitation log with error
      await supabase
        .from("invite_logs")
        .update({
          status: "failed",
          error_message: `Failed to create profile: ${profileError.message}`
        })
        .eq("email", email)
        .eq("triggered_by", adminUser.id)
        .order("sent_at", { ascending: false })
        .limit(1);
        
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }
    
    // Generate a sign-in link
    const { data: signInData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${Deno.env.get("PUBLIC_SITE_URL") || "https://opensocials.net"}/auth?setup=true`
      }
    });

    if (linkError || !signInData || !signInData.properties?.action_link) {
      // Update invitation log with error
      await supabase
        .from("invite_logs")
        .update({
          status: "failed",
          error_message: "Failed to generate sign-in link"
        })
        .eq("email", email)
        .eq("triggered_by", adminUser.id)
        .order("sent_at", { ascending: false })
        .limit(1);
        
      throw new Error("Failed to generate sign-in link");
    }

    const signInLink = signInData.properties.action_link;
    
    let emailResponse = null;
    
    // Send email via Resend if API key is available
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        emailResponse = await resend.emails.send({
          from: "team@opensocials.net",
          to: email,
          subject: `You've been invited to OpenSocials as a ${role}!`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>Welcome to OpenSocials!</h1>
              <p>You've been invited to join OpenSocials as a ${role}.</p>
              <p>To get started, click the button below to set up your account:</p>
              <a href="${signInLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                Accept Invitation
              </a>
              <p>This link will expire in 24 hours.</p>
              <p>If you did not expect this invitation, you can safely ignore this email.</p>
              <p>Best regards,<br>The OpenSocials Team</p>
            </div>
          `,
        });
        
        // Update invitation log with success status
        await supabase
          .from("invite_logs")
          .update({
            status: "sent",
            sent_at: new Date().toISOString()
          })
          .eq("email", email)
          .eq("triggered_by", adminUser.id)
          .order("sent_at", { ascending: false })
          .limit(1);
          
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        emailResponse = { id: "email-failed", message: emailError.message };
        
        // Update invitation log with email failure
        await supabase
          .from("invite_logs")
          .update({
            status: "email_failed",
            error_message: emailError.message
          })
          .eq("email", email)
          .eq("triggered_by", adminUser.id)
          .order("sent_at", { ascending: false })
          .limit(1);
        // Continue execution - don't throw an error that would break the function
      }
    } else {
      console.warn("RESEND_API_KEY not configured, email notification skipped");
      emailResponse = { id: "email-skipped", message: "RESEND_API_KEY not configured" };
      
      // Update invitation log with skipped status
      await supabase
        .from("invite_logs")
        .update({
          status: "email_skipped",
          error_message: "RESEND_API_KEY not configured"
        })
        .eq("email", email)
        .eq("triggered_by", adminUser.id)
        .order("sent_at", { ascending: false })
        .limit(1);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: emailResponse,
      userCreated: true,
      signInLink: signInLink
    }), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("Error in invite-and-create-profile:", error);

    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || "Failed to process invitation" 
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

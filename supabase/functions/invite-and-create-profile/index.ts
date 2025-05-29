
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import { validateEmail, sanitizeString, checkRateLimit, logSecurityEvent, extractClientInfo } from '../shared/security-utils.ts'

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resendApiKey = Deno.env.get("RESEND_API_KEY");

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
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const clientInfo = extractClientInfo(req);
    
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
    
    // Verify admin role using new security function
    const { data: isAdmin } = await supabase.rpc('is_admin_user');
    
    if (!isAdmin) {
      await logSecurityEvent(supabase, {
        user_id: adminUser.id,
        action: 'unauthorized_invite_attempt',
        resource_type: 'user_invitation',
        ...clientInfo
      });
      
      return new Response(JSON.stringify({ success: false, error: "Forbidden - Requires admin privileges" }), {
        status: 403,
        headers: corsHeaders
      });
    }

    // Rate limiting - max 10 invitations per hour per admin
    const rateLimitPassed = await checkRateLimit(supabase, {
      identifier: adminUser.id,
      action: 'send_invitation',
      maxRequests: 10,
      windowMinutes: 60
    });

    if (!rateLimitPassed) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Rate limit exceeded. Please wait before sending more invitations."
      }), {
        status: 429,
        headers: corsHeaders
      });
    }

    // Get and validate invite data
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

    // Enhanced input validation
    if (!email || !role) {
      return new Response(JSON.stringify({ success: false, error: "Email and role are required" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid email format" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const allowedRoles = ['creator', 'brand', 'admin'];
    if (!allowedRoles.includes(role)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid role" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Sanitize inputs
    const sanitizedFirstName = first_name ? sanitizeString(first_name, 50) : '';
    const sanitizedLastName = last_name ? sanitizeString(last_name, 50) : '';

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
    }

    // Check if user already exists with better error handling
    const { data: existingUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .limit(1);
      
    if (fetchError) {
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

    // Create the user in Supabase Auth with sanitized data
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { 
        first_name: sanitizedFirstName,
        last_name: sanitizedLastName,
        invited_by: adminUser.id,
        invited_at: new Date().toISOString(),
        role: role
      }
    });

    if (userError) {
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

    // Create profile entry with sanitized data
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userData.user.id,
        email,
        role,
        first_name: sanitizedFirstName || '',
        last_name: sanitizedLastName || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'pending'
      });
      
    if (profileError) {
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
      }
    } else {
      console.warn("RESEND_API_KEY not configured, email notification skipped");
      emailResponse = { id: "email-skipped", message: "RESEND_API_KEY not configured" };
      
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

    // Log successful invitation
    await logSecurityEvent(supabase, {
      user_id: adminUser.id,
      action: 'user_invited',
      resource_type: 'user_invitation',
      resource_id: userData.user.id,
      ...clientInfo
    });

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

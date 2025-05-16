
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

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
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
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

    // Get invite data from request
    const { email, role, first_name, last_name }: InviteRequest = await req.json();

    if (!email || !role) {
      return new Response(JSON.stringify({ success: false, error: "Email and role are required" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Check if user already exists
    const { data: existingUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .limit(1);
      
    if (fetchError) {
      throw new Error(`Error checking for existing user: ${fetchError.message}`);
    }
    
    if (existingUsers && existingUsers.length > 0) {
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
      throw new Error(`Failed to create user: ${userError.message}`);
    }

    if (!userData.user) {
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
      throw new Error("Failed to generate sign-in link");
    }

    const signInLink = signInData.properties.action_link;
    
    // Send email via Resend
    const emailResponse = await resend.emails.send({
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

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("Error in invite-and-create-profile:", error);

    return new Response(JSON.stringify({ success: false, error: error.message || "Failed to process invitation" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

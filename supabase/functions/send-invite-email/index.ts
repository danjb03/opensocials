
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
};

interface InviteRequest {
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

async function checkIfAlreadyInvited(supabase, email: string): Promise<boolean> {
  // Check if user already exists
  const { data: existingUsers } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', email)
    .limit(1);
    
  if (existingUsers && existingUsers.length > 0) {
    return true;
  }
  
  // Check if invite was already sent
  const { data: existingInvites } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('status', 'pending')
    .limit(1);

  if (existingInvites && existingInvites.length > 0) {
    const { data: userWithEmail } = await supabase.auth.admin.listUsers();
    const invitedUser = userWithEmail.users.find(u => 
      u.email === email && 
      existingInvites.some(invite => invite.user_id === u.id)
    );
    
    return !!invitedUser;
  }
  
  return false;
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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
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
      return new Response(JSON.stringify({ error: "Forbidden - Requires admin privileges" }), {
        status: 403,
        headers: corsHeaders
      });
    }

    // Get invite data from request
    const { email, role, firstName, lastName }: InviteRequest = await req.json();

    if (!email || !role) {
      return new Response(JSON.stringify({ error: "Email and role are required" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Check if user is already invited
    const alreadyInvited = await checkIfAlreadyInvited(supabase, email);
    if (alreadyInvited) {
      return new Response(JSON.stringify({ message: "User already invited or exists" }), {
        status: 409,
        headers: corsHeaders
      });
    }

    // Create the user in Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { 
        first_name: firstName || '',
        last_name: lastName || '',
        invited_by: adminUser.id,
        invited_at: new Date().toISOString()
      },
      role: role
    });

    if (userError) {
      throw userError;
    }

    // Create user role entry
    await supabase
      .from("user_roles")
      .insert({
        user_id: userData.user?.id,
        role,
        status: "pending"
      });
    
    // Generate a sign-in link
    const { data: signInData } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${Deno.env.get("PUBLIC_SITE_URL") || "https://opensocials.net"}/auth?setup=true`
      }
    });

    if (!signInData || !signInData.properties?.action_link) {
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
    console.error("Error sending invite email:", error);

    return new Response(JSON.stringify({ error: error.message || "Failed to send invite email" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

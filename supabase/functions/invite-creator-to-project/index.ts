
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteRequest {
  project_id: string;
  creator_id: string;
  agreed_amount?: number;
  currency?: string;
  content_requirements?: any;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get the user from the auth header
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { project_id, creator_id, agreed_amount, currency = 'USD', content_requirements, notes }: InviteRequest = await req.json();

    // Verify the user owns this project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('name, brand_id')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      throw new Error('Project not found');
    }

    // Get brand profile to verify ownership
    const { data: brandProfile, error: brandError } = await supabase
      .from('brand_profiles')
      .select('user_id, company_name')
      .eq('user_id', user.id)
      .single();

    if (brandError || !brandProfile) {
      throw new Error('Brand profile not found');
    }

    // Get creator profile and email
    const { data: creatorProfile, error: creatorError } = await supabase
      .from('creator_profiles')
      .select('user_id, first_name, last_name')
      .eq('user_id', creator_id)
      .single();

    if (creatorError || !creatorProfile) {
      throw new Error('Creator profile not found');
    }

    // Get creator email from profiles table
    const { data: creatorUser, error: creatorUserError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', creator_id)
      .single();

    if (creatorUserError || !creatorUser?.email) {
      throw new Error('Creator email not found');
    }

    // Create project creator invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('project_creators')
      .insert({
        project_id,
        creator_id,
        status: 'invited',
        agreed_amount,
        currency,
        content_requirements,
        notes,
        invitation_date: new Date().toISOString()
      })
      .select()
      .single();

    if (inviteError) {
      throw inviteError;
    }

    // Send invitation email
    const creatorName = `${creatorProfile.first_name || ''} ${creatorProfile.last_name || ''}`.trim();
    const brandName = brandProfile.company_name || 'A brand';

    const emailResponse = await supabase.functions.invoke('send-email', {
      body: {
        to_email: creatorUser.email,
        email_subject: `Campaign Invitation from ${brandName}`,
        email_content: `
          <h2>You've Been Invited to a Campaign!</h2>
          <p>Hi ${creatorName},</p>
          <p>${brandName} has invited you to participate in their campaign: <strong>${project.name}</strong></p>
          ${agreed_amount ? `<p><strong>Offered Amount:</strong> ${currency} ${agreed_amount}</p>` : ''}
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
          <p>Log in to your creator dashboard to view the full details and respond to this invitation.</p>
          <p><a href="${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/creator/invitations" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Invitation</a></p>
          <p>Best regards,<br>The OpenSocials Team</p>
        `,
        from_email: 'OpenSocials <noreply@opensocials.net>'
      }
    });

    console.log('Invitation created and email sent:', { invitation, emailResponse });

    return new Response(JSON.stringify({ 
      success: true, 
      invitation,
      message: `Invitation sent to ${creatorName}` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('Error in invite-creator-to-project:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);

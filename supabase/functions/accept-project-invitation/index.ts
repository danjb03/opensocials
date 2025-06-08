
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AcceptRequest {
  invitation_id: string;
  action: 'accept' | 'decline';
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

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { invitation_id, action, notes }: AcceptRequest = await req.json();

    // Get the invitation and verify ownership
    const { data: invitation, error: inviteError } = await supabase
      .from('project_creators')
      .select(`
        *,
        projects!inner(name, brand_id),
        creator_profiles!inner(first_name, last_name)
      `)
      .eq('id', invitation_id)
      .eq('creator_id', user.id)
      .eq('status', 'invited')
      .single();

    if (inviteError || !invitation) {
      throw new Error('Invitation not found or already responded to');
    }

    // Update invitation status
    const newStatus = action === 'accept' ? 'accepted' : 'declined';
    const { error: updateError } = await supabase
      .from('project_creators')
      .update({
        status: newStatus,
        response_date: new Date().toISOString(),
        notes: notes || invitation.notes
      })
      .eq('id', invitation_id);

    if (updateError) {
      throw updateError;
    }

    // If accepted, create initial deal structure
    if (action === 'accept' && invitation.agreed_amount) {
      const { error: dealError } = await supabase
        .from('creator_deals')
        .insert({
          project_id: invitation.project_id,
          creator_id: user.id,
          deal_value: invitation.agreed_amount,
          status: 'accepted',
          invited_at: invitation.invitation_date,
          responded_at: new Date().toISOString()
        });

      if (dealError) {
        console.error('Error creating deal:', dealError);
      }
    }

    // Get brand email for notification
    const { data: brandProfile, error: brandError } = await supabase
      .from('brand_profiles')
      .select('user_id')
      .eq('id', invitation.projects.brand_id)
      .single();

    if (!brandError && brandProfile) {
      const { data: brandUser, error: brandUserError } = await supabase
        .from('profiles')
        .select('email, company_name')
        .eq('id', brandProfile.user_id)
        .single();

      if (!brandUserError && brandUser?.email) {
        const creatorName = `${invitation.creator_profiles.first_name || ''} ${invitation.creator_profiles.last_name || ''}`.trim();
        const actionText = action === 'accept' ? 'accepted' : 'declined';

        // Send notification email to brand
        await supabase.functions.invoke('send-email', {
          body: {
            to_email: brandUser.email,
            email_subject: `Creator ${actionText} your campaign invitation`,
            email_content: `
              <h2>Campaign Invitation ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}</h2>
              <p>${creatorName} has ${actionText} your invitation for the campaign: <strong>${invitation.projects.name}</strong></p>
              ${notes ? `<p><strong>Creator Notes:</strong> ${notes}</p>` : ''}
              <p>Log in to your brand dashboard to view the updated campaign status.</p>
              <p><a href="${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/brand/projects" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Campaign</a></p>
              <p>Best regards,<br>The OpenSocials Team</p>
            `,
            from_email: 'OpenSocials <noreply@opensocials.net>'
          }
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      status: newStatus,
      message: `Invitation ${actionText} successfully` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error) {
    console.error('Error in accept-project-invitation:', error);
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

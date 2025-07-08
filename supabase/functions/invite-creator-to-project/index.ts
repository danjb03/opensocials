
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log('🎯 invite-creator-to-project function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error('❌ No authorization header');
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      console.error('❌ Invalid user token:', userError);
      throw new Error("Invalid user token");
    }

    console.log('✅ Authenticated user:', userData.user.id);

    const { project_id, creator_id, agreed_amount, currency = 'USD', content_requirements, notes } = await req.json();

    if (!project_id || !creator_id) {
      console.error('❌ Missing required fields');
      throw new Error("Missing required fields: project_id and creator_id");
    }

    console.log('🎯 Inviting creator:', { project_id, creator_id, agreed_amount });

    // Verify brand owns the project (RLS will handle this, but double-check)
    const { data: project, error: projectError } = await supabaseClient
      .from('projects_new')
      .select('brand_id, name, status')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      console.error('❌ Project not found:', projectError);
      throw new Error("Project not found");
    }

    if (project.brand_id !== userData.user.id) {
      console.error('❌ Unauthorized: User does not own project');
      throw new Error("Unauthorized: You don't own this project");
    }

    console.log('✅ Project verified:', project.name);

    // Check if creator already invited to this project
    const { data: existingInvitation } = await supabaseClient
      .from('project_creators')
      .select('id, status')
      .eq('project_id', project_id)
      .eq('creator_id', creator_id)
      .single();

    if (existingInvitation) {
      console.error('❌ Creator already invited');
      throw new Error(`Creator already ${existingInvitation.status} for this project`);
    }

    // Create project_creators entry
    const { data: invitation, error: invitationError } = await supabaseClient
      .from('project_creators')
      .insert({
        project_id,
        creator_id,
        status: 'invited',
        agreed_amount,
        currency,
        content_requirements,
        notes,
        invitation_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (invitationError) {
      console.error('❌ Failed to create invitation:', invitationError);
      throw new Error(`Failed to create invitation: ${invitationError.message}`);
    }

    console.log('✅ Invitation created:', invitation.id);

    // Get creator info for response
    const { data: creator } = await supabaseClient
      .from('creator_profiles')
      .select('first_name, last_name')
      .eq('user_id', creator_id)
      .single();

    const creatorName = creator ? `${creator.first_name || ''} ${creator.last_name || ''}`.trim() : 'Creator';

    console.log('✅ Invitation sent successfully');

    return new Response(JSON.stringify({
      success: true,
      message: `Invitation sent to ${creatorName}`,
      invitation_id: invitation.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Error in invite-creator-to-project:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

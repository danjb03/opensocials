
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
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
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Invalid user token");

    const { project_id, negotiated_amount, notes } = await req.json();

    if (!project_id) {
      throw new Error("Missing required field: project_id");
    }

    // Find the invitation
    const { data: invitation, error: invitationError } = await supabaseClient
      .from('project_creators')
      .select('*')
      .eq('project_id', project_id)
      .eq('creator_id', userData.user.id)
      .eq('status', 'invited')
      .single();

    if (invitationError || !invitation) {
      throw new Error("No pending invitation found for this project");
    }

    // Update invitation status to accepted
    const updateData: any = {
      status: 'accepted',
      response_date: new Date().toISOString(),
    };

    if (negotiated_amount) {
      updateData.agreed_amount = negotiated_amount;
    }

    if (notes) {
      updateData.notes = notes;
    }

    const { error: updateError } = await supabaseClient
      .from('project_creators')
      .update(updateData)
      .eq('id', invitation.id);

    if (updateError) {
      throw new Error(`Failed to accept invitation: ${updateError.message}`);
    }

    // Create a creator deal for payment tracking
    const { error: dealError } = await supabaseClient
      .from('creator_deals')
      .insert({
        project_id,
        creator_id: userData.user.id,
        deal_value: negotiated_amount || invitation.agreed_amount,
        status: 'accepted',
        payment_status: 'pending',
      });

    if (dealError) {
      console.warn('Failed to create deal record:', dealError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Invitation accepted successfully'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in accept-project-invitation:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

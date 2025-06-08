
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

    const { deal_id, amount, payment_method = 'platform' } = await req.json();

    if (!deal_id || !amount) {
      throw new Error("Missing required fields: deal_id and amount");
    }

    // Get the deal and verify brand ownership
    const { data: deal, error: dealError } = await supabaseClient
      .from('creator_deals')
      .select(`
        *,
        projects!inner(brand_id, name)
      `)
      .eq('id', deal_id)
      .single();

    if (dealError || !deal) {
      throw new Error("Deal not found");
    }

    if (deal.projects.brand_id !== userData.user.id) {
      throw new Error("Unauthorized: You don't own this project");
    }

    if (deal.status !== 'accepted') {
      throw new Error("Deal must be accepted before payment can be processed");
    }

    if (deal.payment_status === 'paid') {
      throw new Error("Payment already completed for this deal");
    }

    // Update deal payment status
    const { error: updateError } = await supabaseClient
      .from('creator_deals')
      .update({
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', deal_id);

    if (updateError) {
      throw new Error(`Failed to update payment status: ${updateError.message}`);
    }

    // Create earnings record
    const { error: earningsError } = await supabaseClient
      .from('deal_earnings')
      .insert({
        deal_id,
        creator_id: deal.creator_id,
        amount
      });

    if (earningsError) {
      console.warn('Failed to create earnings record:', earningsError);
    }

    // Get creator info for notification
    const { data: creator } = await supabaseClient
      .from('creator_profiles')
      .select('first_name, last_name')
      .eq('user_id', deal.creator_id)
      .single();

    const creatorName = creator ? `${creator.first_name || ''} ${creator.last_name || ''}`.trim() : 'Creator';

    // Send payment confirmation email
    try {
      await supabaseClient.functions.invoke('send-email', {
        body: {
          to: deal.creator_id,
          subject: 'Payment Processed',
          template: 'payment-confirmation',
          data: {
            amount,
            project_name: deal.projects.name,
            payment_method
          }
        }
      });
    } catch (emailError) {
      console.warn('Failed to send payment confirmation email:', emailError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Payment of $${amount} processed for ${creatorName}`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in process-creator-payment:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-CREATOR-PAYMENT] ${step}${detailsStr}`);
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

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    logStep("Stripe initialized");

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Invalid user token");
    logStep("User authenticated", { userId: userData.user.id });

    const { deal_id, amount } = await req.json();

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

    logStep("Deal validation passed", { dealId: deal_id, amount });

    // Get creator profile and payment info
    const { data: creatorProfile, error: creatorError } = await supabaseClient
      .from('creator_profiles')
      .select('first_name, last_name, user_id, stripe_account_id')
      .eq('user_id', deal.creator_id)
      .single();

    if (creatorError || !creatorProfile) {
      throw new Error("Creator profile not found");
    }

    const creatorName = `${creatorProfile.first_name || ''} ${creatorProfile.last_name || ''}`.trim() || 'Creator';
    logStep("Creator profile found", { creatorName, stripeAccountId: creatorProfile.stripe_account_id });

    // Check if creator has Stripe account, create if needed
    let stripeAccountId = creatorProfile.stripe_account_id;
    
    if (!stripeAccountId) {
      logStep("Creating Stripe Express account for creator");
      
      // Create Stripe Express account for creator
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US', // Default to US, should be configurable
        capabilities: {
          transfers: { requested: true },
        },
      });

      stripeAccountId = account.id;
      logStep("Stripe account created", { accountId: stripeAccountId });

      // Update creator profile with Stripe account ID
      const { error: updateError } = await supabaseClient
        .from('creator_profiles')
        .update({ stripe_account_id: stripeAccountId })
        .eq('user_id', deal.creator_id);

      if (updateError) {
        console.warn('Failed to update creator profile with Stripe account:', updateError);
      }
    }

    // Check if creator's Stripe account is ready for transfers
    const account = await stripe.accounts.retrieve(stripeAccountId);
    logStep("Stripe account retrieved", { 
      accountId: stripeAccountId, 
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled 
    });

    if (!account.charges_enabled || !account.payouts_enabled) {
      // Create account link for creator to complete onboarding
      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${req.headers.get("origin")}/creator/setup-payments`,
        return_url: `${req.headers.get("origin")}/creator/dashboard`,
        type: 'account_onboarding',
      });

      return new Response(JSON.stringify({
        success: false,
        requires_onboarding: true,
        account_link: accountLink.url,
        message: `${creatorName} needs to complete their payment setup before receiving payments`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Process the transfer to creator
    logStep("Processing Stripe transfer", { amount, accountId: stripeAccountId });
    
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      destination: stripeAccountId,
      description: `Payment for project: ${deal.projects.name}`,
      metadata: {
        deal_id,
        project_id: deal.project_id,
        creator_id: deal.creator_id,
      },
    });

    logStep("Stripe transfer successful", { transferId: transfer.id });

    // Update deal payment status
    const { error: updateError } = await supabaseClient
      .from('creator_deals')
      .update({
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stripe_transfer_id: transfer.id
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
        amount,
        stripe_transfer_id: transfer.id
      });

    if (earningsError) {
      console.warn('Failed to create earnings record:', earningsError);
    }

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
            transfer_id: transfer.id
          }
        }
      });
    } catch (emailError) {
      console.warn('Failed to send payment confirmation email:', emailError);
    }

    logStep("Payment processing completed successfully");

    return new Response(JSON.stringify({
      success: true,
      message: `Payment of $${amount} processed successfully for ${creatorName}`,
      transfer_id: transfer.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-creator-payment", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

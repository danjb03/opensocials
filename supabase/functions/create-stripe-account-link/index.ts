
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-STRIPE-ACCOUNT-LINK] ${step}${detailsStr}`);
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

    // Get creator profile
    const { data: creatorProfile, error: creatorError } = await supabaseClient
      .from('creator_profiles')
      .select('first_name, last_name, stripe_account_id')
      .eq('user_id', userData.user.id)
      .single();

    if (creatorError || !creatorProfile) {
      throw new Error("Creator profile not found");
    }

    let stripeAccountId = creatorProfile.stripe_account_id;

    // Create Stripe account if it doesn't exist
    if (!stripeAccountId) {
      logStep("Creating new Stripe Express account");
      
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        capabilities: {
          transfers: { requested: true },
        },
        metadata: {
          creator_id: userData.user.id,
        },
      });

      stripeAccountId = account.id;
      logStep("Stripe account created", { accountId: stripeAccountId });

      // Update creator profile with Stripe account ID
      const { error: updateError } = await supabaseClient
        .from('creator_profiles')
        .update({ stripe_account_id: stripeAccountId })
        .eq('user_id', userData.user.id);

      if (updateError) {
        throw new Error(`Failed to update creator profile: ${updateError.message}`);
      }
    }

    // Create account link for onboarding
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${origin}/creator/setup-payments`,
      return_url: `${origin}/creator/dashboard`,
      type: 'account_onboarding',
    });

    logStep("Account link created", { url: accountLink.url });

    return new Response(JSON.stringify({
      success: true,
      account_link: accountLink.url,
      account_id: stripeAccountId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-stripe-account-link", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-BRAND-SETUP-INTENT] ${step}${detailsStr}`);
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

    // Get brand profile
    const { data: brandProfile, error: brandError } = await supabaseClient
      .from('brand_profiles')
      .select('user_id, company_name, stripe_customer_id')
      .eq('user_id', userData.user.id)
      .single();

    if (brandError || !brandProfile) {
      throw new Error("Brand profile not found");
    }

    let stripeCustomerId = brandProfile.stripe_customer_id;

    // Create Stripe customer if it doesn't exist
    if (!stripeCustomerId) {
      logStep("Creating new Stripe customer");
      
      const customer = await stripe.customers.create({
        email: userData.user.email,
        name: brandProfile.company_name || userData.user.email,
        metadata: {
          brand_id: userData.user.id,
        },
      });

      stripeCustomerId = customer.id;
      logStep("Stripe customer created", { customerId: stripeCustomerId });

      // Update brand profile with Stripe customer ID
      const { error: updateError } = await supabaseClient
        .from('brand_profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('user_id', userData.user.id);

      if (updateError) {
        throw new Error(`Failed to update brand profile: ${updateError.message}`);
      }
    }

    // Create setup intent for payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      usage: 'off_session',
      payment_method_types: ['card'],
    });

    // Create checkout session for setup
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'setup',
      success_url: `${origin}/brand/settings?setup=success`,
      cancel_url: `${origin}/brand/settings?setup=cancelled`,
    });

    logStep("Setup session created", { sessionId: session.id });

    return new Response(JSON.stringify({
      success: true,
      setup_url: session.url,
      setup_intent_id: setupIntent.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-brand-setup-intent", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

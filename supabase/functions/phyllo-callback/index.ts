import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { code, state, platform } = await req.json();

    if (!code || !state || !platform) {
      return new Response(
        JSON.stringify({ error: "Missing code, state or platform" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid auth token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const basicAuth = Deno.env.get("PHYLLO_BASIC_TOKEN")!;

    const exchangeRes = await fetch("https://api.staging.getphyllo.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, state }),
    });

    if (!exchangeRes.ok) {
      const text = await exchangeRes.text();
      console.error("Phyllo token exchange failed", text);
      return new Response(
        JSON.stringify({ error: "Token exchange failed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenData = await exchangeRes.json();

    const expires_at = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null;

    const { error } = await supabase
      .from("connected_accounts")
      .upsert({
        creator_id: user.id,
        platform,
        external_user_id: tokenData.external_id ?? null,
        access_token: tokenData.access_token ?? null,
        refresh_token: tokenData.refresh_token ?? null,
        expires_at,
        connected_at: new Date().toISOString(),
      }, { onConflict: "creator_id,platform" });

    if (error) {
      console.error("Database insert failed", error);
      return new Response(
        JSON.stringify({ error: "Failed to store connection" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

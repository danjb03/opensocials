import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface InsightRequest {
  platform: string;
  username: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    let body: InsightRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { platform, username } = body;
    if (!platform || !username) {
      return new Response(
        JSON.stringify({ error: "platform and username are required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const apiKey = Deno.env.get("INSIGHTIQ_API_KEY");
    if (!apiKey) {
      console.error("Missing INSIGHTIQ_API_KEY secret");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const response = await fetch("https://api.insightiq.io/v1/social-data", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platform, username }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      await supabase.from("social_profiles").upsert({
        creator_id: user.id,
        platform,
        username,
        status: "error",
        error_message: `${response.status}: ${errorText}`,
        last_synced: new Date().toISOString(),
      }, { onConflict: 'creator_id,platform' });

      return new Response(JSON.stringify({ error: "InsightIQ request failed" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const data = await response.json();
    const followerCount = data.followers ?? data.follower_count ?? 0;
    const engagementRate = data.engagement_rate ?? 0;

    const { error: upsertError } = await supabase.from("social_profiles").upsert({
      creator_id: user.id,
      platform,
      username,
      follower_count: followerCount,
      engagement_rate: engagementRate,
      last_synced: new Date().toISOString(),
      status: "connected",
      error_message: null,
    }, { onConflict: 'creator_id,platform' });

    if (upsertError) {
      console.error('DB upsert error:', upsertError);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ success: true, follower_count: followerCount, engagement_rate: engagementRate }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("insightiq function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});


import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Shared headers for CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map platforms to their recommended Apify actors
const PLATFORM_ACTORS = {
  // Use official Apify actors as PRIMARY for better reliability.
  // Keep a well-known community actor as SECONDARY backup.
  instagram: "apify/instagram-profile-scraper",
  tiktok: {
    primary: "apify/tiktok-scraper",
    secondary: "clockworks/tiktok-profile-scraper"
  },
  youtube: {
    primary: "apify/youtube-channel-scraper",
    secondary: "streamers/youtube-channel-scraper"
  },
  linkedin: {
    primary: "apify/linkedin-profile-scraper",
    secondary: "ahmed-khaled/linkedin-engagement-scraper"
  },
  twitter: "apify/twitter-scraper"
};

/**
 * Triggers an Apify actor run.
 * IMPORTANT: It correctly URL-encodes the actor ID by replacing '/' with '~'.
 * @param actorId The ID of the actor to run (e.g., "apify/instagram-profile-scraper").
 * @param handle The social media handle to pass as input.
 * @param apifyToken Your Apify API token.
 * @returns The response from the Apify API.
 */
async function triggerApifyRun(actorId: string, handle: string, apifyToken: string) {
  // Apify API requires actor IDs with '/' to be encoded with '~'
  const encodedActorId = actorId.replace('/', '~');
  const url = `https://api.apify.com/v2/acts/${encodedActorId}/runs?token=${apifyToken}`;
  
  const apifyResponse = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Using a consistent input structure for simplicity
    body: JSON.stringify({ username: handle }) 
  });
  
  if (!apifyResponse.ok) {
    const errorText = await apifyResponse.text();
    throw new Error(`Failed to trigger Apify actor ${actorId}: ${errorText}`);
  }
  
  return await apifyResponse.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { platform, handle, creator_id } = await req.json();

    // Validate inputs
    if (!platform || !handle || !creator_id) {
      return new Response(JSON.stringify({ error: "Missing required fields: platform, handle, creator_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client with service role key for backend operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get Apify token from environment variables
    const apifyToken = Deno.env.get("APIFY_TOKEN");
    if (!apifyToken) {
      throw new Error("APIFY_TOKEN environment variable not set");
    }

    const platformConfig = PLATFORM_ACTORS[platform];
    if (!platformConfig) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const isDualActor = typeof platformConfig === 'object';
    const actorMetadata = isDualActor ? JSON.stringify(platformConfig) : platformConfig;

    // Create or update the social account record
    const { data: account, error: upsertError } = await supabase
      .from("creators_social_accounts")
      .upsert({
        creator_id: creator_id,
        platform: platform,
        handle: handle,
        actor_id: actorMetadata,
        status: 'pending',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'creator_id, platform' })
      .select()
      .single();

    if (upsertError) throw upsertError;

    const accountId = account.id;
    const jobPromises = [];
    const jobResults = [];
    const now = new Date().toISOString();

    // Trigger Apify runs and prepare job records
    if (isDualActor) {
      // Primary actor
      jobPromises.push(
        triggerApifyRun(platformConfig.primary, handle, apifyToken).then(result => ({ type: 'primary', result }))
      );
      // Secondary actor
      jobPromises.push(
        triggerApifyRun(platformConfig.secondary, handle, apifyToken).then(result => ({ type: 'secondary', result }))
      );
    } else {
      // Single actor
      jobPromises.push(
        triggerApifyRun(platformConfig, handle, apifyToken).then(result => ({ type: 'primary', result }))
      );
    }

    // Wait for all Apify runs to be triggered
    const triggeredRuns = await Promise.all(jobPromises);

    // Prepare job records for batch insertion
    const jobsToInsert = triggeredRuns.map(run => {
      jobResults.push({ type: run.type, runId: run.result.data.id });
      return {
        account_id: accountId,
        apify_run_id: run.result.data.id,
        actor_type: run.type,
        status: "running",
        started_at: now
      };
    });

    // Batch insert job records
    const { error: jobInsertError } = await supabase.from("social_jobs").insert(jobsToInsert);
    if (jobInsertError) throw jobInsertError;

    // Update the account status to 'running'
    await supabase
      .from("creators_social_accounts")
      .update({ status: 'running', last_run: now })
      .eq('id', accountId);

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully triggered data collection for ${platform} account.`,
      data: {
        accountId,
        jobs: jobResults,
      }
    }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (error) {
    console.error("Error in connect-social-account:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

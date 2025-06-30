import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Shared headers for CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define the refresh interval for all platforms (7 days in hours)
const REFRESH_INTERVAL_HOURS = 168;

// Map platforms to their recommended Apify actors
const PLATFORM_ACTORS = {
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
 * @param actorId The ID of the actor to run.
 * @param handle The social media handle.
 * @param apifyToken Your Apify API token.
 * @returns The response from the Apify API.
 */
async function triggerApifyRun(actorId: string, handle: string, apifyToken: string) {
  const encodedActorId = actorId.replace('/', '~');
  const url = `https://api.apify.com/v2/acts/${encodedActorId}/runs?token=${apifyToken}`;
  
  const apifyResponse = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: handle })
  });
  
  if (!apifyResponse.ok) {
    const errorText = await apifyResponse.text();
    throw new Error(`Failed to trigger Apify actor ${actorId}: ${errorText}`);
  }
  
  return await apifyResponse.json();
}

/**
 * Main Edge Function handler.
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const apifyToken = Deno.env.get("APIFY_TOKEN");
    if (!apifyToken) throw new Error("APIFY_TOKEN is not set");

    // Find accounts due for a refresh
    const { data: dueAccounts, error: accountsError } = await supabase
      .from("creators_social_accounts")
      .select("id, platform, handle, actor_id")
      .or(`next_run.is.null,next_run.lte.${new Date().toISOString()}`)
      .eq('status', 'ready') // Only refresh accounts that are in a ready state
      .limit(50); // Process in batches

    if (accountsError) throw accountsError;
    if (!dueAccounts || dueAccounts.length === 0) {
      return new Response(JSON.stringify({ message: "No accounts due for refresh." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = [];
    for (const account of dueAccounts) {
      try {
        const platformConfig = PLATFORM_ACTORS[account.platform];
        if (!platformConfig) {
          console.error(`Unsupported platform found for account ${account.id}: ${account.platform}`);
          continue;
        }

        const isDualActor = typeof platformConfig === 'object';
        const now = new Date();
        const nextRun = new Date(now.getTime() + REFRESH_INTERVAL_HOURS * 60 * 60 * 1000);

        // Update account status to 'running' to prevent re-picking
        await supabase
          .from("creators_social_accounts")
          .update({ status: 'running', last_run: now.toISOString() })
          .eq("id", account.id);

        const jobPromises = [];
        if (isDualActor) {
          jobPromises.push(triggerApifyRun(platformConfig.primary, account.handle, apifyToken).then(result => ({ type: 'primary', result })));
          jobPromises.push(triggerApifyRun(platformConfig.secondary, account.handle, apifyToken).then(result => ({ type: 'secondary', result })));
        } else {
          jobPromises.push(triggerApifyRun(platformConfig, account.handle, apifyToken).then(result => ({ type: 'primary', result })));
        }

        const triggeredRuns = await Promise.all(jobPromises);
        
        const jobsToInsert = triggeredRuns.map(run => ({
          account_id: account.id,
          apify_run_id: run.result.data.id,
          actor_type: run.type,
          status: "running",
          started_at: now.toISOString()
        }));

        await supabase.from("social_jobs").insert(jobsToInsert);

        // Schedule the next run
        await supabase
          .from("creators_social_accounts")
          .update({ next_run: nextRun.toISOString() })
          .eq("id", account.id);

        results.push({ accountId: account.id, status: 'scheduled', jobs: triggeredRuns.map(r => r.result.data.id) });
      } catch (error) {
        console.error(`Failed to schedule refresh for account ${account.id}:`, error.message);
        // Revert status to 'failed' on error
        await supabase
          .from("creators_social_accounts")
          .update({ status: 'failed', error: error.message })
          .eq("id", account.id);
        results.push({ accountId: account.id, status: 'failed', error: error.message });
      }
    }

    return new Response(JSON.stringify({ success: true, message: `Scheduled ${results.length} accounts for refresh.`, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in schedule-social-refreshes:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

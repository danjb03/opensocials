import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../shared/admin-utils.ts";

// Platform-specific refresh intervals (in hours)
const REFRESH_INTERVALS = {
  // Refresh **once every 7 days** (168 h) for all platforms
  instagram: 168,
  tiktok: 168,
  youtube: 168,
  linkedin: 168,
};

// Map platforms to their recommended Apify actors
const PLATFORM_ACTORS = {
  // Use official Apify actors as PRIMARY for better reliability.
  // Keep a well-known community actor as SECONDARY backup to ensure
  // we still collect metrics if the primary actor fails or lacks a field.
  instagram: "apify/instagram-profile-scraper", // Official actor

  tiktok: {
    primary: "apify/tiktok-scraper",            // Official TikTok actor
    secondary: "clockworks/tiktok-profile-scraper" // Backup for profile stats
  },

  youtube: {
    primary: "apify/youtube-channel-scraper",   // Official YouTube actor
    secondary: "streamers/youtube-channel-scraper" // Community backup
  },

  linkedin: {
    primary: "apify/linkedin-profile-scraper",      // Official LinkedIn actor
    secondary: "ahmed-khaled/linkedin-engagement-scraper" // Backup for engagement
  }
};

// Helper function to check if a platform uses dual actors
function usesDualActors(platform: string, actorId: any): boolean {
  try {
    // If actorId is a string, it's a single actor
    if (typeof actorId === 'string') {
      return false;
    }
    
    // If actorId is an object with primary and secondary properties, it's dual actors
    if (typeof actorId === 'object' && actorId !== null) {
      // Try to parse if it's a JSON string
      const parsedActorId = typeof actorId === 'string' 
        ? JSON.parse(actorId) 
        : actorId;
      
      return !!(parsedActorId.primary && parsedActorId.secondary);
    }
    
    // Default to platform-specific check
    return platform === 'tiktok' || platform === 'linkedin';
  } catch (err) {
    console.error('Error checking dual actors:', err);
    // Default to platform-specific check if parsing fails
    return platform === 'tiktok' || platform === 'linkedin';
  }
}

// Helper function to parse actor ID
function parseActorId(actorId: any): any {
  try {
    if (typeof actorId === 'string') {
      try {
        return JSON.parse(actorId);
      } catch {
        return actorId;
      }
    }
    return actorId;
  } catch (err) {
    console.error('Error parsing actor ID:', err);
    return actorId;
  }
}

// Helper to trigger Apify actor run
async function triggerApifyRun(actorId: string, handle: string, platform: string, apifyToken: string) {
  const apifyResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${apifyToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      username: handle,
      // Additional platform-specific parameters
      ...(platform === "instagram" && { scrapeComments: true, scrapeStories: false }),
      ...(platform === "tiktok" && { maxPostCount: 20 }),
      ...(platform === "youtube" && { maxVideos: 30 }),
      ...(platform === "linkedin" && { scrapePostContent: true })
    })
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
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Get Apify token
    const apifyToken = Deno.env.get("APIFY_TOKEN");
    if (!apifyToken) {
      throw new Error("APIFY_TOKEN environment variable not set");
    }
    
    // Get current time
    const now = new Date();
    
    // Find accounts due for refresh
    const { data: dueAccounts, error: accountsError } = await supabase
      .from("creators_social_accounts")
      .select("id, creator_id, platform, handle, actor_id, last_run, next_run")
      .or(`next_run.lt.${now.toISOString()},next_run.is.null`)
      .eq("status", "ready") // Only refresh accounts that are in ready state
      .order("last_run", { ascending: true }) // Refresh oldest first
      .limit(50); // Process in batches to avoid overloading
    
    if (accountsError) {
      throw new Error(`Failed to fetch accounts due for refresh: ${accountsError.message}`);
    }
    
    console.log(`Found ${dueAccounts?.length || 0} accounts due for refresh`);
    
    if (!dueAccounts || dueAccounts.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No accounts due for refresh" 
        }),
        { headers: corsHeaders }
      );
    }
    
    // Process each account
    const results = await Promise.all(
      dueAccounts.map(async (account) => {
        try {
          // Calculate next refresh time based on platform
          const refreshHours = REFRESH_INTERVALS[account.platform] || 168;
          const nextRun = new Date();
          nextRun.setHours(nextRun.getHours() + refreshHours);
          
          // Update account with next_run time and set status to pending
          await supabase
            .from("creators_social_accounts")
            .update({
              next_run: nextRun.toISOString(),
              status: "pending", // Will be updated to "running" once Apify job starts
              updated_at: now.toISOString()
            })
            .eq("id", account.id);
          
          // Determine if platform uses multiple actors
          const parsedActorId = parseActorId(account.actor_id);
          const isDualActor = usesDualActors(account.platform, parsedActorId);
          
          // Prepare actor IDs based on account configuration or default mapping
          let actorIds;
          
          if (isDualActor) {
            // If account has configured actor IDs, use those
            if (typeof parsedActorId === 'object' && parsedActorId.primary && parsedActorId.secondary) {
              actorIds = {
                primary: parsedActorId.primary,
                secondary: parsedActorId.secondary
              };
            } else {
              // Otherwise use default platform mapping
              actorIds = {
                primary: PLATFORM_ACTORS[account.platform].primary,
                secondary: PLATFORM_ACTORS[account.platform].secondary
              };
            }
          } else {
            // Single actor platform
            actorIds = { 
              primary: typeof parsedActorId === 'string' ? parsedActorId : PLATFORM_ACTORS[account.platform]
            };
          }
          
          const jobResults = [];
          
          // Trigger primary actor run
          const primaryResult = await triggerApifyRun(
            actorIds.primary,
            account.handle,
            account.platform,
            apifyToken
          );
          
          // Store primary job information
          const { data: primaryJob, error: primaryJobError } = await supabase
            .from("social_jobs")
            .insert({
              account_id: account.id,
              apify_run_id: primaryResult.data.id,
              actor_type: "primary",
              status: "running",
              started_at: now.toISOString()
            })
            .select("id")
            .single();
          
          if (primaryJobError) {
            console.error(`Failed to create primary job record for account ${account.id}:`, primaryJobError);
          } else {
            jobResults.push({
              type: "primary",
              jobId: primaryJob.id,
              apifyRunId: primaryResult.data.id
            });
          }
          
          // If dual actor, trigger secondary actor run
          if (isDualActor) {
            const secondaryResult = await triggerApifyRun(
              actorIds.secondary, 
              account.handle, 
              account.platform, 
              apifyToken
            );
            
            // Store secondary job information
            const { data: secondaryJob, error: secondaryJobError } = await supabase
              .from("social_jobs")
              .insert({
                account_id: account.id,
                apify_run_id: secondaryResult.data.id,
                actor_type: "secondary",
                status: "running",
                started_at: now.toISOString()
              })
              .select("id")
              .single();
            
            if (secondaryJobError) {
              console.error(`Failed to create secondary job record for account ${account.id}:`, secondaryJobError);
            } else {
              jobResults.push({
                type: "secondary",
                jobId: secondaryJob.id,
                apifyRunId: secondaryResult.data.id
              });
            }
          }
          
          // Update account status
          await supabase
            .from("creators_social_accounts")
            .update({
              status: "running",
              last_run: now.toISOString()
            })
            .eq("id", account.id);
          
          return {
            accountId: account.id,
            platform: account.platform,
            handle: account.handle,
            status: "scheduled",
            jobs: jobResults,
            isDualActor,
            nextRun: nextRun.toISOString()
          };
        } catch (err) {
          console.error(`Error processing account ${account.id}:`, err);
          
          // Update account status to failed
          await supabase
            .from("creators_social_accounts")
            .update({
              status: "failed",
              error: `Failed to schedule refresh: ${err.message}`,
              updated_at: now.toISOString()
            })
            .eq("id", account.id);
          
          return {
            accountId: account.id,
            platform: account.platform,
            handle: account.handle,
            status: "failed",
            error: err.message
          };
        }
      })
    );
    
    // Count successes and failures
    const succeeded = results.filter(r => r.status === "scheduled").length;
    const failed = results.filter(r => r.status === "failed").length;
    
    // Return results
    return new Response(
      JSON.stringify({
        success: true,
        total: results.length,
        succeeded,
        failed,
        results
      }),
      { headers: corsHeaders }
    );
    
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Server error: ${err.message}` 
      }),
      { 
        headers: corsHeaders, 
        status: 500 
      }
    );
  }
});

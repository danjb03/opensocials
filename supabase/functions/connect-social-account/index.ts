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
  instagram: "powerful_bachelor/instagram-profile-scraper-pro", // Professional version

  tiktok: {
    primary: "apify/tiktok-scraper",            // Official TikTok actor
    secondary: "clockworks/tiktok-profile-scraper" // Backup for profile stats
  },

  youtube: {
    primary: "apify/youtube-channel-scraper",   // Official YouTube actor
    secondary: "streamers/youtube-channel-scraper" // Fast variant
  },

  linkedin: {
    primary: "apify/linkedin-profile-scraper",      // Official LinkedIn actor
    secondary: "ahmed-khaled/linkedin-engagement-scraper" // For engagement metrics
  }
};

// Validate input parameters
function validateInput(platform: string, handle: string) {
  const errors = [];
  
  if (!platform) {
    errors.push("Platform is required");
  } else if (!Object.keys(PLATFORM_ACTORS).includes(platform)) {
    errors.push(`Platform must be one of: ${Object.keys(PLATFORM_ACTORS).join(', ')}`);
  }
  
  if (!handle) {
    errors.push("Handle is required");
  } else if (handle.length < 2) {
    errors.push("Handle must be at least 2 characters");
  }
  
  return errors;
}

// Clean handle by removing @ prefix and any trailing spaces
function cleanHandle(handle: string, platform: string): string {
  let cleaned = handle.trim();
  
  // Remove @ prefix if present
  if (cleaned.startsWith('@')) {
    cleaned = cleaned.substring(1);
  }
  
  // Handle URL formats
  if (cleaned.includes('/')) {
    // Extract username from URL
    const urlParts = cleaned.split('/');
    cleaned = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || cleaned;
    
    // Remove query parameters
    if (cleaned.includes('?')) {
      cleaned = cleaned.split('?')[0];
    }
  }
  
  return cleaned;
}

// Helper function to check if a platform uses dual actors
function usesDualActors(platform: string): boolean {
  // Check if the platform's entry in PLATFORM_ACTORS is an object (indicating dual actors)
  return typeof PLATFORM_ACTORS[platform] === 'object';
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
    // Parse request body
    const { platform, handle, creator_id } = await req.json();
    
    // Validate inputs
    const validationErrors = validateInput(platform, handle);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: validationErrors.join(", ") 
        }),
        {
          headers: corsHeaders,
          status: 400
        }
      );
    }
    
    // Clean handle
    const cleanedHandle = cleanHandle(handle, platform);
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Extract auth token
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Authentication failed" 
        }),
        { 
          headers: corsHeaders, 
          status: 401 
        }
      );
    }
    
    // Use provided creator_id or default to authenticated user
    const targetCreatorId = creator_id || user.id;
    
    // Check if user is authorized to connect for this creator
    if (targetCreatorId !== user.id) {
      // Check if user is admin
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("status", "approved");
      
      const isAdmin = userRoles?.some(r => r.role === "admin" || r.role === "super_admin");
      
      if (!isAdmin) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Unauthorized: You can only connect accounts for yourself" 
          }),
          { 
            headers: corsHeaders, 
            status: 403 
          }
        );
      }
    }
    
    // Check if creator exists
    const { data: creatorProfile, error: creatorError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", targetCreatorId)
      .single();
    
    if (creatorError || !creatorProfile) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Creator not found" 
         }),
        { 
          headers: corsHeaders, 
          status: 404 
        }
      );
    }
    
    // Check if account already exists
    const { data: existingAccount, error: accountCheckError } = await supabase
      .from("creators_social_accounts")
      .select("id, status")
      .eq("creator_id", targetCreatorId)
      .eq("platform", platform)
      .maybeSingle();
    
    // Get Apify token
    const apifyToken = Deno.env.get("APIFY_TOKEN");
    if (!apifyToken) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "APIFY_TOKEN environment variable not set" 
        }),
        { 
          headers: corsHeaders, 
          status: 500 
        }
      );
    }
    
    // Determine if platform uses multiple actors
    const usesDualActorsForPlatform = usesDualActors(platform);
    
    // Prepare actor IDs and metadata
    let actorIds: { primary: string; secondary?: string };
    let actorMetadata: string | { primary: string; secondary: string };
    
    if (usesDualActorsForPlatform) {
      actorIds = {
        primary: (PLATFORM_ACTORS[platform] as { primary: string; secondary: string }).primary,
        secondary: (PLATFORM_ACTORS[platform] as { primary: string; secondary: string }).secondary
      };
      actorMetadata = JSON.stringify(actorIds);
    } else {
      actorIds = { primary: PLATFORM_ACTORS[platform] as string };
      actorMetadata = PLATFORM_ACTORS[platform] as string;
    }
    
    let accountId;
    
    if (existingAccount) {
      // Update existing account
      const { data: updatedAccount, error: updateError } = await supabase
        .from("creators_social_accounts")
        .update({
          handle: cleanedHandle,
          actor_id: actorMetadata, // Store actor IDs as string or JSON
          status: "pending",
          updated_at: new Date().toISOString()
        })
        .eq("id", existingAccount.id)
        .select("id")
        .single();
      
      if (updateError) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to update social account: ${updateError.message}` 
          }),
          { 
            headers: corsHeaders, 
            status: 500 
          }
        );
      }
      
      accountId = updatedAccount.id;
    } else {
      // Create new account
      const { data: newAccount, error: createError } = await supabase
        .from("creators_social_accounts")
        .insert({
          creator_id: targetCreatorId,
          platform,
          handle: cleanedHandle,
          actor_id: actorMetadata, // Store actor IDs as string or JSON
          status: "pending",
          next_run: new Date().toISOString()
        })
        .select("id")
        .single();
      
      if (createError) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to create social account: ${createError.message}` 
          }),
          { 
            headers: corsHeaders, 
            status: 500 
          }
        );
      }
      
      accountId = newAccount.id;
    }
    
    try {
      // Trigger Apify runs
      const now = new Date().toISOString();
      const jobResults = [];
      
      // Trigger primary actor
      const primaryResult = await triggerApifyRun(
        actorIds.primary, 
        cleanedHandle, 
        platform, 
        apifyToken
      );
      
      // Store primary job information
      const { data: primaryJob, error: primaryJobError } = await supabase
        .from("social_jobs")
        .insert({
          account_id: accountId,
          apify_run_id: primaryResult.data.id,
          actor_type: "primary",
          status: "running",
          started_at: now
        })
        .select("id")
        .single();
      
      if (primaryJobError) {
        console.error("Failed to create primary job record:", primaryJobError);
      } else {
        jobResults.push({
          type: "primary",
          jobId: primaryJob.id,
          apifyRunId: primaryResult.data.id
        });
      }
      
      // If platform uses dual actors, trigger secondary actor
      if (usesDualActorsForPlatform && actorIds.secondary) {
        const secondaryResult = await triggerApifyRun(
          actorIds.secondary, 
          cleanedHandle, 
          platform, 
          apifyToken
        );
        
        // Store secondary job information
        const { data: secondaryJob, error: secondaryJobError } = await supabase
          .from("social_jobs")
          .insert({
            account_id: accountId,
            apify_run_id: secondaryResult.data.id,
            actor_type: "secondary",
            status: "running",
            started_at: now
          })
          .select("id")
          .single();
        
        if (secondaryJobError) {
          console.error("Failed to create secondary job record:", secondaryJobError);
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
          last_run: now
        })
        .eq("id", accountId);
      
      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: "Social account connected successfully",
          data: {
            accountId,
            platform,
            handle: cleanedHandle,
            jobs: jobResults,
            usesDualActors: usesDualActorsForPlatform
          }
        }),
        { headers: corsHeaders }
      );
      
    } catch (err) {
      // Update account status to failed
      await supabase
        .from("creators_social_accounts")
        .update({
          status: "failed",
          error: err.message
        })
        .eq("id", accountId);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: err.message 
        }),
        { 
          headers: corsHeaders, 
          status: 500 
        }
      );
    }
    
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

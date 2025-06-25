import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, validateSuperAdmin } from "../shared/admin-utils.ts";

// Rate limiting - prevent running more than once per hour
const RATE_LIMIT_SECONDS = 3600; // 1 hour

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
    
    // Extract auth token
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    
    // Validate user has admin or super_admin role
    const validation = await validateSuperAdmin(supabase, token);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: validation.message 
        }),
        { 
          headers: corsHeaders, 
          status: validation.status 
        }
      );
    }
    
    // Parse request parameters
    const { batchSize = 1000, force = false, creator_id, platform } = await req.json().catch(() => ({}));
    
    // Check rate limiting (unless force flag is set)
    if (!force) {
      const { data: lastRefresh } = await supabase
        .from("admin_operations")
        .select("timestamp")
        .eq("operation", "refresh_all_social_accounts")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single()
        .catch(() => ({ data: null }));
      
      if (lastRefresh) {
        const lastRefreshTime = new Date(lastRefresh.timestamp).getTime();
        const currentTime = Date.now();
        const elapsedSeconds = (currentTime - lastRefreshTime) / 1000;
        
        if (elapsedSeconds < RATE_LIMIT_SECONDS) {
          const remainingMinutes = Math.ceil((RATE_LIMIT_SECONDS - elapsedSeconds) / 60);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Rate limit exceeded. Please try again in ${remainingMinutes} minutes.`,
              lastRefresh: lastRefresh.timestamp,
              remainingMinutes
            }),
            { headers: corsHeaders, status: 429 }
          );
        }
      }
    }
    
    // Record this operation
    await supabase
      .from("admin_operations")
      .insert({
        operation: "refresh_all_social_accounts",
        user_id: validation.userId,
        timestamp: new Date().toISOString(),
        metadata: { batchSize, force, creator_id, platform }
      })
      .catch(err => console.error("Failed to record operation:", err));
    
    // Build the query for accounts
    let query = supabase
      .from("creators_social_accounts")
      .select("id, platform, handle, last_run")
      .order("last_run", { ascending: true })
      .limit(batchSize);
    
    // Apply optional filters
    if (creator_id) {
      query = query.eq("creator_id", creator_id);
    }
    if (platform) {
      query = query.eq("platform", platform);
    }

    const { data: accountsToRefresh, error: accountsError } = await query;
    
    if (accountsError) {
      throw new Error(`Failed to fetch accounts: ${accountsError.message}`);
    }
    
    if (!accountsToRefresh || accountsToRefresh.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No accounts to refresh matching criteria",
          count: 0
        }),
        { headers: corsHeaders }
      );
    }
    
    // Update accounts to trigger refresh
    const now = new Date().toISOString();
    const { data: updatedAccounts, error: updateError } = await supabase
      .from("creators_social_accounts")
      .update({
        next_run: now,
        status: "pending", // Set to pending so scheduler picks it up
        updated_at: now
      })
      .in("id", accountsToRefresh.map(account => account.id))
      .select("id");
    
    if (updateError) {
      throw new Error(`Failed to update accounts: ${updateError.message}`);
    }
    
    // Group accounts by platform for statistics
    const platformCounts = accountsToRefresh.reduce((acc, account) => {
      acc[account.platform] = (acc[account.platform] || 0) + 1;
      return acc;
    }, {});
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scheduled refresh for ${accountsToRefresh.length} accounts`,
        count: accountsToRefresh.length,
        platforms: platformCounts,
        batchSize,
        nextRefreshAvailable: new Date(Date.now() + RATE_LIMIT_SECONDS * 1000).toISOString()
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

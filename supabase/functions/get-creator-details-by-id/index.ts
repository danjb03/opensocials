
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, validateSuperAdmin } from "../shared/admin-utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    // Get creator ID from URL parameters
    const url = new URL(req.url);
    const creatorId = url.searchParams.get("creator_id");

    if (!creatorId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing creator_id parameter" 
        }),
        {
          headers: corsHeaders,
          status: 400
        }
      );
    }

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

    // Fetch creator profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, primary_platform, follower_count, engagement_rate, status, created_at, bio, avatar_url")
      .eq("id", creatorId)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to fetch creator profile: ${profileError.message}` 
        }),
        {
          headers: corsHeaders,
          status: 500
        }
      );
    }

    // Fetch deals for this creator
    const { data: deals, error: dealsError } = await supabase
      .from("deals")
      .select("id, title, brand_id, status, value, created_at, updated_at")
      .eq("creator_id", creatorId);

    if (dealsError) {
      console.error("Deals fetch error:", dealsError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to fetch creator deals: ${dealsError.message}` 
        }),
        {
          headers: corsHeaders,
          status: 500
        }
      );
    }

    // Fetch brand names for deals
    const brandIds = deals?.map(deal => deal.brand_id) || [];
    const { data: brands, error: brandsError } = await supabase
      .from("profiles")
      .select("id, company_name")
      .in("id", brandIds.length > 0 ? brandIds : ['00000000-0000-0000-0000-000000000000']); // Dummy UUID if empty

    if (brandsError && brandIds.length > 0) {
      console.error("Brands fetch error:", brandsError);
    }

    // Enrich deals with brand names
    const dealsWithBrands = deals?.map(deal => ({
      ...deal,
      brand_name: brands?.find(b => b.id === deal.brand_id)?.company_name || "Unknown"
    })) || [];

    // Fetch earnings
    const { data: earnings, error: earningsError } = await supabase
      .from("deal_earnings")
      .select("amount")
      .eq("creator_id", creatorId);

    if (earningsError) {
      console.error("Earnings fetch error:", earningsError);
    }

    // Calculate total earnings
    const totalEarnings = earnings?.reduce((sum, row) => sum + parseFloat(row.amount || 0), 0) || 0;

    // Build response with all data
    return new Response(
      JSON.stringify({
        success: true,
        profile,
        deals: dealsWithBrands,
        totalEarnings,
        analytics: {
          totalDeals: deals?.length || 0,
          activeDeals: deals?.filter(d => d.status === 'active').length || 0,
          completedDeals: deals?.filter(d => d.status === 'completed').length || 0
        }
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

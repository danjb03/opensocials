
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, validateSuperAdmin } from "../shared/admin-crm-utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    console.log("Edge function invoked: get-admin-creator-crm");
    
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
      console.error(`Authentication failed: ${validation.message}`);
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

    // Extract request parameters 
    // First parse request body if available
    let requestParams = {};
    const contentType = req.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        requestParams = await req.json();
      } catch (e) {
        console.error("Failed to parse JSON body:", e);
        // If JSON parsing fails, continue with URL params
      }
    }
    
    console.log("Request parameters:", requestParams);

    // Extract pagination parameters and filters from URL or request body
    const page = parseInt(requestParams.page || "1");
    const pageSize = parseInt(requestParams.pageSize || "10");
    const orderBy = requestParams.orderBy || "last_active_at";
    const orderDirection = requestParams.orderDirection === "asc" ? true : false;
    const statusFilter = requestParams.status || null;
    const platformFilter = requestParams.platform || null;
    const searchTerm = requestParams.search || null;
    
    // Calculate pagination values
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build query
    let query = supabase
      .from("admin_crm_creators_view")
      .select("*", { count: "exact" });
    
    // Apply search filter if provided
    if (searchTerm) {
      query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }
    
    // Apply status filter if specified
    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    
    // Apply platform filter if specified
    if (platformFilter && platformFilter !== "all") {
      query = query.eq("primary_platform", platformFilter);
    }
    
    // Apply ordering
    query = query.order(orderBy, { ascending: orderDirection });
    
    // Apply pagination
    query = query.range(from, to);
    
    // Execute query
    const { data, error, count } = await query;

    console.log("Query executed, data count:", data?.length, "error:", error);

    if (error) {
      console.error("Database query error:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to fetch creator data: ${error.message}` 
        }),
        { 
          headers: corsHeaders, 
          status: 500 
        }
      );
    }

    // Return successful response even if no data is found (empty array)
    return new Response(
      JSON.stringify({
        success: true,
        data: data || [],
        pagination: {
          total: count || 0,
          page,
          pageSize,
          pageCount: count ? Math.ceil(count / pageSize) : 0
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

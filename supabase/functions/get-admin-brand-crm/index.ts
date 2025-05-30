
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, validateSuperAdmin } from "../shared/admin-crm-utils.ts";

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

    // Extract pagination parameters and filters from URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10");
    const orderBy = url.searchParams.get("orderBy") || "last_active_at";
    const orderDirection = url.searchParams.get("orderDirection") === "asc" ? true : false;
    const statusFilter = url.searchParams.get("status") || null;
    const searchTerm = url.searchParams.get("search") || null;
    
    // Calculate pagination values
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build query
    let query = supabase
      .from("admin_crm_brands_view")
      .select("*", { count: "exact" });
    
    // Apply search filter if provided
    if (searchTerm) {
      query = query.or(`company_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }
    
    // Apply status filter if specified
    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    
    // Apply ordering
    query = query.order(orderBy, { ascending: orderDirection });
    
    // Apply pagination
    query = query.range(from, to);
    
    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error("Database query error:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to fetch brand data: ${error.message}` 
        }),
        { 
          headers: corsHeaders, 
          status: 500 
        }
      );
    }

    // Return paginated results with metadata
    return new Response(
      JSON.stringify({
        success: true,
        data,
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

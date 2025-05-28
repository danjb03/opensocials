
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function validateAdminAccess(supabase, token: string) {
  const { data: { user } } = await supabase.auth.getUser(token);
  
  if (!user) {
    return { isValid: false, status: 401, message: "Authentication required" };
  }

  // Check if user has admin role in user_roles table
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("status", "approved")
    .in("role", ["admin", "super_admin"])
    .single();

  // Also check profiles table for admin role as fallback
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const hasAdminRole = userRole?.role === "admin" || userRole?.role === "super_admin" || 
                       profile?.role === "admin" || profile?.role === "super_admin";

  if (!hasAdminRole) {
    return { isValid: false, status: 403, message: "Admin access required" };
  }

  return { isValid: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  
  console.log("Processing brand leaderboard request for token:", token ? "present" : "missing");
  
  const validation = await validateAdminAccess(supabase, token);

  if (!validation.isValid) {
    console.log("Access denied:", validation.message);
    return new Response(JSON.stringify({ error: validation.message }), {
      headers: corsHeaders,
      status: validation.status,
    });
  }

  console.log("Access granted, fetching brand deals data");

  // Check if brand_deals table exists, if not use projects table
  let dealData;
  let error;
  
  try {
    const { data, error: brandDealsError } = await supabase
      .from("brand_deals")
      .select("brand_id, budget");
    
    if (brandDealsError && brandDealsError.code === "42P01") {
      // Table doesn't exist, use projects table instead
      console.log("brand_deals table not found, using projects table");
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("brand_id, budget");
      
      dealData = projectData;
      error = projectError;
    } else {
      dealData = data;
      error = brandDealsError;
    }
  } catch (e) {
    console.error("Error fetching deal data:", e);
    return new Response(JSON.stringify({ error: "Failed to fetch deal data" }), {
      headers: corsHeaders,
      status: 500,
    });
  }

  if (error) {
    console.error("Error fetching deal data:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: corsHeaders,
      status: 500,
    });
  }

  const totalByBrand: Record<string, number> = {};

  for (const row of dealData || []) {
    const budget = Number(row.budget || 0);
    if (!totalByBrand[row.brand_id]) {
      totalByBrand[row.brand_id] = 0;
    }
    totalByBrand[row.brand_id] += budget;
  }

  const sortedBrands = Object.entries(totalByBrand)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  const brandIds = sortedBrands.map(([id]) => id);

  const { data: profiles } = await supabase
    .from("brand_profiles")
    .select("id, name, email, industry")
    .in("id", brandIds);

  const leaderboard = sortedBrands.map(([id, total]) => {
    const profile = profiles?.find((p) => p.id === id);
    return {
      id,
      total_budget: total,
      name: profile?.name ?? 'Unknown Brand',
      email: profile?.email ?? 'N/A',
      industry: profile?.industry ?? 'N/A',
    };
  });

  console.log("Successfully fetched brand leaderboard with", leaderboard.length, "brands");

  return new Response(JSON.stringify({ success: true, data: leaderboard }), {
    headers: corsHeaders,
    status: 200,
  });
});

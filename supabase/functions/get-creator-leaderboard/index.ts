
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
  
  console.log("Processing creator leaderboard request for token:", token ? "present" : "missing");
  
  const validation = await validateAdminAccess(supabase, token);

  if (!validation.isValid) {
    console.log("Access denied:", validation.message);
    return new Response(JSON.stringify({ error: validation.message }), {
      headers: corsHeaders,
      status: validation.status,
    });
  }

  console.log("Access granted, fetching earnings data");

  const { data: earningsData, error } = await supabase
    .from("deal_earnings")
    .select("creator_id, amount");

  if (error) {
    console.error("Error fetching earnings data:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: corsHeaders,
      status: 500,
    });
  }

  const totalByCreator: Record<string, number> = {};

  for (const row of earningsData || []) {
    const amount = Number(row.amount || 0);
    if (!totalByCreator[row.creator_id]) {
      totalByCreator[row.creator_id] = 0;
    }
    totalByCreator[row.creator_id] += amount;
  }

  const sortedCreators = Object.entries(totalByCreator)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  const creatorIds = sortedCreators.map(([id]) => id);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, primary_platform")
    .in("id", creatorIds);

  const leaderboard = sortedCreators.map(([id, total]) => {
    const profile = profiles?.find((p) => p.id === id);
    return {
      id,
      total_earnings: total,
      name: `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim(),
      email: profile?.email ?? 'N/A',
      platform: profile?.primary_platform ?? 'N/A',
    };
  });

  console.log("Successfully fetched leaderboard with", leaderboard.length, "creators");

  return new Response(JSON.stringify({ success: true, data: leaderboard }), {
    headers: corsHeaders,
    status: 200,
  });
});

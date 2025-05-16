
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function validateSuperAdmin(supabase, token: string) {
  const { data: { user } } = await supabase.auth.getUser(token);
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (!profile || profile.role !== "super_admin") {
    return { isValid: false, status: 403, message: "Unauthorized" };
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
  const validation = await validateSuperAdmin(supabase, token);

  if (!validation.isValid) {
    return new Response(JSON.stringify({ error: validation.message }), {
      headers: corsHeaders,
      status: validation.status,
    });
  }

  const { data: dealData, error } = await supabase
    .from("brand_deals")
    .select("brand_id, budget");

  if (error) {
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

  return new Response(JSON.stringify({ success: true, data: leaderboard }), {
    headers: corsHeaders,
    status: 200,
  });
});

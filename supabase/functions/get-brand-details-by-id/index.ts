
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

  const url = new URL(req.url);
  const brandId = url.searchParams.get("brand_id");

  if (!brandId) {
    return new Response(JSON.stringify({ error: "Missing brand_id" }), {
      headers: corsHeaders,
      status: 400,
    });
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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, company_name, email, industry, budget_range, created_at")
    .eq("id", brandId)
    .single();

  if (profileError) {
    return new Response(JSON.stringify({ error: profileError.message }), {
      headers: corsHeaders,
      status: 500,
    });
  }

  const { data: deals, error: dealsError } = await supabase
    .from("deals")
    .select("id, title, creator_id, status, stage, value, updated_at")
    .eq("brand_id", brandId)
    .in("status", ["active", "pending"]);

  const { data: creators } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .eq("role", "creator");

  const dealsWithCreators = deals?.map((deal) => {
    const creator = creators?.find((c) => c.id === deal.creator_id);
    return {
      ...deal,
      creator_name: creator ? `${creator.first_name} ${creator.last_name}` : "Unknown",
    };
  }) ?? [];

  const totalSpend = dealsWithCreators.reduce((sum, deal) => sum + Number(deal.value || 0), 0);

  return new Response(
    JSON.stringify({
      success: true,
      profile,
      deals: dealsWithCreators,
      totalSpend,
    }),
    { headers: corsHeaders }
  );
});

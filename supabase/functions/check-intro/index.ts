import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 },
    );
  }

  const { intro_type } = await req.json().catch(() => ({ intro_type: null }));

  if (!intro_type || !["brand", "creator"].includes(intro_type)) {
    return new Response(
      JSON.stringify({ error: "Invalid intro_type" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
    );
  }

  const column = intro_type === "brand" ? "has_seen_intro" : "has_seen_creator_intro";

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(column)
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch profile" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }

  const showIntro = !profile?.[column];

  return new Response(
    JSON.stringify({ showIntro }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
  );
});

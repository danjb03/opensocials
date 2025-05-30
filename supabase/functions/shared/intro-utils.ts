import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export async function handleCheckIntro(req: Request, field: string, useAnon = false): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    useAnon ? Deno.env.get("SUPABASE_ANON_KEY") ?? "" : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    useAnon ? { global: { headers: { Authorization: req.headers.get("Authorization")! } } } : undefined,
  );

  const { data: { user }, error: authErr } = useAnon
    ? await supabase.auth.getUser()
    : await supabase.auth.getUser(req.headers.get("authorization")?.replace("Bearer ", "") || "");

  if (authErr || !user) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(field)
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch profile" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const showIntro = !profile?.[field];
  return new Response(
    JSON.stringify({ showIntro }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

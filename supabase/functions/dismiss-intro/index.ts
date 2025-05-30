import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../shared/admin-utils.ts";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      headers: corsHeaders,
      status: 401,
    });
  }

  const { intro_type } = await req.json().catch(() => ({ intro_type: null }));
  if (!intro_type || !["brand", "creator"].includes(intro_type)) {
    return new Response(JSON.stringify({ error: "Invalid intro_type" }), {
      headers: corsHeaders,
      status: 400,
    });
  }

  const column =
    intro_type === "brand" ? "has_seen_intro" : "has_seen_creator_intro";

  const { error } = await supabase
    .from("profiles")
    .update({ [column]: true })
    .eq("id", user.id);

  if (error) {
    return new Response(JSON.stringify({ error: "Failed to update" }), {
      headers: corsHeaders,
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: corsHeaders,
    status: 200,
  });
});

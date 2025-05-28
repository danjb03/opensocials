
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.json();
    const { type, record } = body;
    
    console.log(`Processing webhook event: ${type}`);
    
    // Only process user.created events
    if (type !== "user.created") {
      return new Response(
        JSON.stringify({ message: `Webhook received but ignoring event ${type}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const user = record;
    console.log(`Processing new user: ${user.id}`);
    console.log(`User metadata:`, user.raw_user_meta_data);
    
    // Extract role from user metadata
    const role = user.raw_user_meta_data?.role ? String(user.raw_user_meta_data.role).toLowerCase() : null;
    
    if (!role) {
      console.error("No role found in user metadata");
      return new Response(
        JSON.stringify({ error: "No role specified in user metadata" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Create user_role entry for role-based access control
    const { error: roleError } = await supabase
      .from("user_roles")
      .upsert({
        user_id: user.id,
        role: role,
        status: "approved" // Set to approved by default for immediate access
      }, { onConflict: 'user_id,role' });
      
    if (roleError) {
      console.error("Error creating user_role:", roleError);
      return new Response(
        JSON.stringify({ error: `Failed to create user role: ${roleError.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    console.log(`Successfully processed user signup for ${user.id} with role ${role}`);
    
    return new Response(
      JSON.stringify({ 
        message: "User signup processed successfully", 
        user_id: user.id,
        role: role
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: `Webhook processing failed: ${error.message}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

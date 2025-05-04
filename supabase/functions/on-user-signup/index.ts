
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
    
    // First, ensure user_role entry exists with approved status for immediate access
    const { error: roleError } = await supabase
      .from("user_roles")
      .upsert({
        user_id: user.id,
        role: role,
        status: "approved" // Set to approved by default for better user experience
      }, { onConflict: 'user_id,role' });
      
    if (roleError) {
      console.error("Error creating user_role:", roleError);
      return new Response(
        JSON.stringify({ error: roleError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
      
    if (fetchError) {
      console.error("Error fetching profile:", fetchError);
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    if (!existingProfile) {
      const firstName = user.raw_user_meta_data?.first_name || "";
      const lastName = user.raw_user_meta_data?.last_name || "";
      
      // Create base profile data
      const profileData = {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        role: role,
        email: user.email || "",
        status: "accepted" // Set to accepted by default for better user experience
      };
      
      // Add brand-specific fields if role is brand
      if (role === "brand") {
        Object.assign(profileData, {
          company_name: user.raw_user_meta_data?.company_name || `${firstName} ${lastName}'s Brand`,
          is_complete: true // Set to true by default to avoid redirect loops
        });
      }
      
      const { error: profileError } = await supabase
        .from("profiles")
        .insert(profileData);
        
      if (profileError) {
        console.error("Error creating profile:", profileError);
        return new Response(
          JSON.stringify({ error: profileError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
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
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

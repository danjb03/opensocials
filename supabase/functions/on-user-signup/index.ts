
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
    
    // Extract role from user metadata
    const role = user.raw_user_meta_data?.role ? String(user.raw_user_meta_data.role).toLowerCase() : null;
    
    if (!role) {
      console.error("No role found in user metadata");
      return new Response(
        JSON.stringify({ error: "No role specified in user metadata" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // First, ensure user_role entry exists with pending status
    const { error: roleError } = await supabase
      .from("user_roles")
      .upsert({
        user_id: user.id,
        role: role,
        status: "pending"
      }, { onConflict: 'user_id,role' });
      
    if (roleError) {
      console.error("Error creating user_role:", roleError);
      return new Response(
        JSON.stringify({ error: roleError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Update profiles or brand_profiles based on role
    if (role === "creator" || role === "admin" || role === "super_admin") {
      // Profile should already be created by the database trigger, but ensure it exists
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
        
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            role: role
          });
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
          return new Response(
            JSON.stringify({ error: profileError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
      }
    } else if (role === "brand") {
      // Brand profile should already be created by the database trigger, but ensure it exists
      const { data: existingBrandProfile, error: fetchError } = await supabase
        .from("brand_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (fetchError) {
        console.error("Error fetching brand profile:", fetchError);
        return new Response(
          JSON.stringify({ error: fetchError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      if (!existingBrandProfile) {
        const firstName = user.raw_user_meta_data?.first_name || "";
        const lastName = user.raw_user_meta_data?.last_name || "";
        const companyName = user.raw_user_meta_data?.company_name || `${firstName} ${lastName}'s Brand`;
        
        const { error: brandProfileError } = await supabase
          .from("brand_profiles")
          .insert({
            user_id: user.id,
            company_name: companyName,
            is_complete: false
          });
          
        if (brandProfileError) {
          console.error("Error creating brand profile:", brandProfileError);
          return new Response(
            JSON.stringify({ error: brandProfileError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
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

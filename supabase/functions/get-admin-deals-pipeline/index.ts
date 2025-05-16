
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

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
    // Create a Supabase client with the auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get all deals with their stages and statuses
    const { data: deals, error } = await supabaseClient
      .from("deals")
      .select(
        "id, title, value, status, updated_at, brand_id, creator_id"
      )
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching deals:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get profiles data for creators and brands
    const { data: profiles, error: profilesError } = await supabaseClient
      .from("profiles")
      .select("id, company_name, first_name, last_name");

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return new Response(
        JSON.stringify({ error: profilesError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Create a map of profiles by ID for quick lookup
    const profilesMap = profiles.reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {});

    // Hardcoded stage data for the MVP - in production this would come from the database
    const stageMap = {
      "briefed": "briefed",
      "content": "content", 
      "review": "review",
      "launched": "launched"
    };

    // Enrich the deals with creator and brand names
    const enrichedDeals = deals.map((deal) => {
      const brandProfile = profilesMap[deal.brand_id];
      const creatorProfile = profilesMap[deal.creator_id];
      
      const brand_name = brandProfile?.company_name || "Unknown Brand";
      const creator_name = creatorProfile 
        ? `${creatorProfile.first_name} ${creatorProfile.last_name}`
        : "Unknown Creator";
      
      // Randomly assign a stage for the MVP - in production this would come from the database
      // Using the deal ID to make it consistent
      const stageKeys = Object.keys(stageMap);
      const stage = stageMap[stageKeys[Math.floor(deal.id.charCodeAt(0) % stageKeys.length)]];
      
      // Calculate if the deal is stuck
      const now = new Date();
      const updatedAt = new Date(deal.updated_at);
      const diffInDays = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));

      const isStuck =
        ['briefed', 'content', 'review'].includes(stage) &&
        deal.status === 'active' &&
        diffInDays >= 5;

      return {
        ...deal,
        brand_name,
        creator_name,
        stage,
        is_stuck: isStuck,
      };
    });

    return new Response(
      JSON.stringify({ data: enrichedDeals }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Unexpected error occurred." }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

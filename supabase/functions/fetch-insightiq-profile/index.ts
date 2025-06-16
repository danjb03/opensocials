
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface FetchProfileRequest {
  creator_id: string;
  platform: string;
  identifier: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

// Static platform mapping to work_platform_id
const PLATFORM_MAPPING = {
  instagram: "9bb8913b-ddd9-430b-a66a-d74d846e6c66",
  tiktok: "de55aeec-0dc8-4119-bf90-16b3d1f0c987",
  youtube: "14d9ddf5-51c6-415e-bde6-f8ed36ad7054",
  twitter: "7645460a-96e0-4192-a3ce-a1fc30641f72",
  twitch: "e4de6c01-5b78-4fc0-a651-24f44134457b",
  facebook: "ad2fec62-2987-40a0-89fb-23485972598c"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
  );

  try {
    // Parse request body
    const { creator_id, platform, identifier }: FetchProfileRequest = await req.json();

    if (!creator_id || !platform || !identifier) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: creator_id, platform, identifier" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get work_platform_id from mapping
    const work_platform_id = PLATFORM_MAPPING[platform as keyof typeof PLATFORM_MAPPING] || null;

    // Handle LinkedIn manually (skip InsightIQ call)
    if (platform === "linkedin") {
      const { error: upsertError } = await supabase
        .from("creator_public_analytics")
        .upsert({
          creator_id,
          platform,
          work_platform_id: null,
          identifier,
          profile_url: identifier.startsWith("http") ? identifier : `https://linkedin.com/in/${identifier}`,
          full_name: null,
          fetched_at: new Date().toISOString(),
        }, { onConflict: 'creator_id,platform' });

      if (upsertError) {
        console.error('LinkedIn upsert error:', upsertError);
        return new Response(JSON.stringify({ error: "Failed to save LinkedIn profile" }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      return new Response(
        JSON.stringify({ success: true, message: "LinkedIn profile saved manually" }),
        { headers: corsHeaders }
      );
    }

    // For other platforms, call InsightIQ API
    if (!work_platform_id) {
      return new Response(
        JSON.stringify({ error: `Unsupported platform: ${platform}` }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Get InsightIQ credentials
    const clientId = Deno.env.get("INSIGHTIQ_CLIENT_ID");
    const secret = Deno.env.get("INSIGHTIQ_SECRET");

    if (!clientId || !secret) {
      console.error("Missing InsightIQ credentials");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Create Basic Auth header
    const credentials = btoa(`${clientId}:${secret}`);

    // Call InsightIQ API
    const insightIQResponse = await fetch("https://api.sandbox.insightiq.ai/v1/social/creators/profiles/analytics", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        work_platform_id,
      }),
    });

    if (!insightIQResponse.ok) {
      const errorText = await insightIQResponse.text();
      console.error('InsightIQ API error:', insightIQResponse.status, errorText);
      
      // Store error in database
      await supabase.from("creator_public_analytics").upsert({
        creator_id,
        platform,
        work_platform_id,
        identifier,
        fetched_at: new Date().toISOString(),
      }, { onConflict: 'creator_id,platform' });

      return new Response(JSON.stringify({ 
        error: `InsightIQ API error: ${insightIQResponse.status}`,
        details: errorText 
      }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const insightIQData = await insightIQResponse.json();
    console.log('InsightIQ response:', JSON.stringify(insightIQData, null, 2));

    // Extract and map data from InsightIQ response
    const analyticsData = {
      creator_id,
      platform,
      work_platform_id,
      identifier,
      fetched_at: new Date().toISOString(),
      profile_url: insightIQData.profile_url || null,
      image_url: insightIQData.image_url || null,
      full_name: insightIQData.full_name || null,
      is_verified: insightIQData.is_verified || false,
      follower_count: insightIQData.follower_count || 0,
      engagement_rate: insightIQData.engagement_rate || 0,
      platform_account_type: insightIQData.platform_account_type || null,
      introduction: insightIQData.introduction || null,
      gender: insightIQData.gender || null,
      age_group: insightIQData.age_group || null,
      language: insightIQData.language || null,
      content_count: insightIQData.content_count || 0,
      average_likes: insightIQData.average_likes || 0,
      average_comments: insightIQData.average_comments || 0,
      average_views: insightIQData.average_views || 0,
      average_reels_views: insightIQData.average_reels_views || 0,
      sponsored_posts_performance: insightIQData.sponsored_posts_performance || 0,
      credibility_score: insightIQData.credibility_score || 0,
      top_contents: insightIQData.top_contents || null,
      recent_contents: insightIQData.recent_contents || null,
      sponsored_contents: insightIQData.sponsored_contents || null,
      top_hashtags: insightIQData.top_hashtags || null,
      top_mentions: insightIQData.top_mentions || null,
      top_interests: insightIQData.top_interests || null,
      brand_affinity: insightIQData.brand_affinity || null,
      audience: insightIQData.audience || null,
      pricing: insightIQData.pricing || null,
    };

    // Upsert data into database
    const { error: upsertError } = await supabase
      .from("creator_public_analytics")
      .upsert(analyticsData, { onConflict: 'creator_id,platform' });

    if (upsertError) {
      console.error('Database upsert error:', upsertError);
      return new Response(JSON.stringify({ error: "Failed to save analytics data" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: analyticsData,
        message: "Profile analytics fetched and saved successfully" 
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("fetch-insightiq-profile error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

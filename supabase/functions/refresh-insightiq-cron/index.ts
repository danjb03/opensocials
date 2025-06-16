
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") || "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
  );

  try {
    console.log('Starting InsightIQ refresh cron job...');

    // Find all analytics older than 14 days
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: staleAnalytics, error: fetchError } = await supabase
      .from("creator_public_analytics")
      .select("creator_id, platform, identifier, fetched_at")
      .lt("fetched_at", fourteenDaysAgo);

    if (fetchError) {
      console.error('Error fetching stale analytics:', fetchError);
      return new Response(JSON.stringify({ error: "Database fetch failed" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    if (!staleAnalytics || staleAnalytics.length === 0) {
      console.log('No stale analytics found');
      return new Response(JSON.stringify({ message: "No stale analytics to refresh" }), {
        headers: corsHeaders,
      });
    }

    console.log(`Found ${staleAnalytics.length} stale analytics to refresh`);

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
    let refreshCount = 0;
    let errorCount = 0;

    for (const analytics of staleAnalytics) {
      try {
        // Skip LinkedIn and other manual platforms
        if (analytics.platform === 'linkedin') {
          console.log(`Skipping LinkedIn profile for creator ${analytics.creator_id}`);
          continue;
        }

        const work_platform_id = PLATFORM_MAPPING[analytics.platform as keyof typeof PLATFORM_MAPPING];
        if (!work_platform_id) {
          console.log(`No mapping found for platform: ${analytics.platform}`);
          continue;
        }

        console.log(`Refreshing ${analytics.platform} data for creator ${analytics.creator_id}`);

        // Call InsightIQ API
        const insightIQResponse = await fetch("https://api.sandbox.insightiq.ai/v1/social/creators/profiles/analytics", {
          method: "POST",
          headers: {
            "Authorization": `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: analytics.identifier,
            work_platform_id,
          }),
        });

        if (!insightIQResponse.ok) {
          console.error(`InsightIQ API error for ${analytics.platform}:`, insightIQResponse.status);
          errorCount++;
          continue;
        }

        const insightIQData = await insightIQResponse.json();
        console.log(`Successfully fetched data for ${analytics.platform} - ${analytics.identifier}`);

        // Extract and map data from InsightIQ response
        const analyticsUpdate = {
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

        // Update data in database
        const { error: updateError } = await supabase
          .from("creator_public_analytics")
          .update(analyticsUpdate)
          .eq("creator_id", analytics.creator_id)
          .eq("platform", analytics.platform);

        if (updateError) {
          console.error(`Database update error for creator ${analytics.creator_id}:`, updateError);
          errorCount++;
        } else {
          refreshCount++;
          console.log(`Successfully updated analytics for creator ${analytics.creator_id} on ${analytics.platform}`);
        }

        // Add small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error refreshing analytics for creator ${analytics.creator_id}:`, error);
        errorCount++;
      }
    }

    const summary = {
      total_found: staleAnalytics.length,
      successfully_refreshed: refreshCount,
      errors: errorCount,
      completed_at: new Date().toISOString()
    };

    console.log('Refresh cron job completed:', summary);

    return new Response(JSON.stringify({
      success: true,
      message: "InsightIQ refresh completed",
      summary
    }), {
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("refresh-insightiq-cron error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});

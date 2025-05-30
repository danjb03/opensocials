
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InsightIQRequest {
  platform: string;
  username: string;
}

interface InsightIQResponse {
  success: boolean;
  data?: {
    followers: number;
    engagement_rate: number;
    avg_likes: number;
    avg_comments: number;
    avg_views: number;
    growth_rate: number;
    verified: boolean;
    profile_picture?: string;
    bio?: string;
  };
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, username }: InsightIQRequest = await req.json();
    
    if (!platform || !username) {
      return new Response(
        JSON.stringify({ success: false, error: 'Platform and username are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const apiKey = Deno.env.get('INSIGHTIQ_API_KEY');
    if (!apiKey) {
      console.error('InsightIQ API key not found');
      return new Response(
        JSON.stringify({ success: false, error: 'API configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call InsightIQ API - adjust endpoint based on their actual API documentation
    const insightIQUrl = `https://api.insightiq.com/v1/creators/${platform}/${username}`;
    
    console.log(`Fetching data for ${username} on ${platform}`);
    
    const response = await fetch(insightIQUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`InsightIQ API error: ${response.status} ${response.statusText}`);
      
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ success: false, error: 'Creator not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch creator data' }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const creatorData = await response.json();
    console.log('Successfully fetched creator data:', creatorData);

    // Transform the data to our expected format
    const transformedData: InsightIQResponse = {
      success: true,
      data: {
        followers: creatorData.follower_count || 0,
        engagement_rate: creatorData.engagement_rate || 0,
        avg_likes: creatorData.avg_likes || 0,
        avg_comments: creatorData.avg_comments || 0,
        avg_views: creatorData.avg_views || 0,
        growth_rate: creatorData.growth_rate || 0,
        verified: creatorData.verified || false,
        profile_picture: creatorData.profile_picture_url,
        bio: creatorData.bio,
      }
    };

    return new Response(
      JSON.stringify(transformedData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-insightiq-data function:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

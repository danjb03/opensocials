
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the authorization token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { headers: corsHeaders, status: 401 }
      );
    }

    // Verify the user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid user token' }),
        { headers: corsHeaders, status: 401 }
      );
    }

    // Parse request body
    const { platform, handle, creator_id } = await req.json();

    if (!platform || !handle) {
      return new Response(
        JSON.stringify({ success: false, error: 'Platform and handle are required' }),
        { headers: corsHeaders, status: 400 }
      );
    }

    console.log(`Connecting ${platform} account for user ${user.id} with handle: ${handle}`);

    // Check if account already exists
    const { data: existingAccount } = await supabase
      .from('creators_social_accounts')
      .select('id')
      .eq('creator_id', user.id)
      .eq('platform', platform)
      .eq('handle', handle.toLowerCase())
      .maybeSingle();

    if (existingAccount) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Account already connected',
          account_id: existingAccount.id 
        }),
        { headers: corsHeaders }
      );
    }

    // Get or create Apify actor configuration for this platform
    const platformActors = {
      instagram: "apify/instagram-profile-scraper",
      tiktok: "apify/tiktok-scraper", 
      youtube: "apify/youtube-channel-scraper",
      linkedin: "apify/linkedin-profile-scraper"
    };

    const actorId = platformActors[platform.toLowerCase()];
    if (!actorId) {
      return new Response(
        JSON.stringify({ success: false, error: `Unsupported platform: ${platform}` }),
        { headers: corsHeaders, status: 400 }
      );
    }

    // Create the social account record
    const { data: newAccount, error: insertError } = await supabase
      .from('creators_social_accounts')
      .insert({
        creator_id: user.id,
        platform: platform.toLowerCase(),
        handle: handle.toLowerCase(),
        actor_id: actorId,
        status: 'ready',
        next_run: new Date().toISOString(), // Schedule immediate run
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save social account' }),
        { headers: corsHeaders, status: 500 }
      );
    }

    console.log('Social account created successfully:', newAccount);

    // Trigger the Apify scraping job immediately
    const apifyToken = Deno.env.get("APIFY_TOKEN");
    if (apifyToken) {
      try {
        console.log(`Triggering Apify actor ${actorId} for ${handle} on ${platform}`);
        
        const apifyResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${apifyToken}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            username: handle,
            // Platform-specific parameters
            ...(platform === "instagram" && { scrapeComments: false, scrapeStories: false }),
            ...(platform === "tiktok" && { maxPostCount: 20 }),
            ...(platform === "youtube" && { maxVideos: 30 }),
            ...(platform === "linkedin" && { scrapePostContent: true })
          })
        });

        if (apifyResponse.ok) {
          const apifyResult = await apifyResponse.json();
          console.log('Apify job started:', apifyResult.data.id);
          
          // Update the account status to running
          await supabase
            .from('creators_social_accounts')
            .update({
              status: 'running',
              last_run: new Date().toISOString()
            })
            .eq('id', newAccount.id);

        } else {
          console.error('Failed to trigger Apify actor:', await apifyResponse.text());
        }
      } catch (apifyError) {
        console.error('Error triggering Apify job:', apifyError);
      }
    } else {
      console.warn('APIFY_TOKEN not configured, skipping job trigger');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `${platform} account connected successfully`,
        account_id: newAccount.id
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in connect-social-account:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { headers: corsHeaders, status: 500 }
    );
  }
});

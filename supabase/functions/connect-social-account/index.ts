
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
    console.log('🚀 connect-social-account function started');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { headers: corsHeaders, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ No authorization header provided');
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization required' }),
        { headers: corsHeaders, status: 401 }
      );
    }

    // Verify the user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('❌ Invalid user token:', userError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid user token' }),
        { headers: corsHeaders, status: 401 }
      );
    }

    console.log('👤 User verified:', user.id);

    // Parse request body with error handling
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid request format' }),
        { headers: corsHeaders, status: 400 }
      );
    }

    const { platform, handle, creator_id } = requestBody;

    if (!platform || !handle) {
      console.error('❌ Missing required fields:', { platform, handle });
      return new Response(
        JSON.stringify({ success: false, error: 'Platform and handle are required' }),
        { headers: corsHeaders, status: 400 }
      );
    }

    console.log(`🔗 Connecting ${platform} account for user ${user.id} with handle: ${handle}`);

    // Check if account already exists
    const { data: existingAccount, error: queryError } = await supabase
      .from('creators_social_accounts')
      .select('id, status')
      .eq('creator_id', user.id)
      .eq('platform', platform)
      .eq('handle', handle.toLowerCase())
      .maybeSingle();

    if (queryError) {
      console.error('❌ Database query error:', queryError);
      return new Response(
        JSON.stringify({ success: false, error: 'Database error occurred' }),
        { headers: corsHeaders, status: 500 }
      );
    }

    if (existingAccount) {
      console.log('✅ Account already exists:', existingAccount);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `${platform.charAt(0).toUpperCase() + platform.slice(1)} account is already connected`,
          account_id: existingAccount.id,
          status: existingAccount.status,
          isExisting: true
        }),
        { headers: corsHeaders, status: 200 }
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
      console.error('❌ Unsupported platform:', platform);
      return new Response(
        JSON.stringify({ success: false, error: `Platform ${platform} is not currently supported` }),
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
        next_run: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('❌ Database insert error:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save social account connection' }),
        { headers: corsHeaders, status: 500 }
      );
    }

    console.log('✅ Social account created successfully:', newAccount);

    // Trigger the Apify scraping job immediately
    const apifyToken = Deno.env.get("APIFY_TOKEN");
    let apifyJobId = null;
    
    if (apifyToken) {
      try {
        console.log(`🤖 Triggering Apify actor ${actorId} for ${handle} on ${platform}`);
        
        const apifyResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${apifyToken}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            username: handle,
            ...(platform === "instagram" && { scrapeComments: false, scrapeStories: false }),
            ...(platform === "tiktok" && { maxPostCount: 20 }),
            ...(platform === "youtube" && { maxVideos: 30 }),
            ...(platform === "linkedin" && { scrapePostContent: true })
          })
        });

        if (apifyResponse.ok) {
          const apifyResult = await apifyResponse.json();
          apifyJobId = apifyResult.data.id;
          console.log('✅ Apify job started:', apifyJobId);
          
          // Update the account status to running
          await supabase
            .from('creators_social_accounts')
            .update({
              status: 'running',
              last_run: new Date().toISOString()
            })
            .eq('id', newAccount.id);

        } else {
          const errorText = await apifyResponse.text();
          console.error('❌ Failed to trigger Apify actor:', errorText);
        }
      } catch (apifyError) {
        console.error('❌ Error triggering Apify job:', apifyError);
      }
    } else {
      console.warn('⚠️ APIFY_TOKEN not configured, analytics collection will be delayed');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `${platform.charAt(0).toUpperCase() + platform.slice(1)} account connected successfully`,
        account_id: newAccount.id,
        status: 'running',
        apify_job_id: apifyJobId,
        isExisting: false,
        note: apifyJobId ? 'Analytics collection started' : 'Analytics collection will begin shortly'
      }),
      { headers: corsHeaders, status: 201 }
    );

  } catch (error) {
    console.error('💥 Unexpected error in connect-social-account:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected server error occurred'
      }),
      { headers: corsHeaders, status: 500 }
    );
  }
});

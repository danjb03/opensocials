
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

    // Parse request body
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

    const { platform, handle } = requestBody;

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
      .select('id, status, last_run')
      .eq('creator_id', user.id)
      .eq('platform', platform.toLowerCase())
      .eq('handle', handle.toLowerCase())
      .maybeSingle();

    if (queryError) {
      console.error('❌ Database query error:', queryError);
      return new Response(
        JSON.stringify({ success: false, error: 'Database error occurred' }),
        { headers: corsHeaders, status: 500 }
      );
    }

    // Platform-specific Apify actor configuration
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

    let accountId;
    let isNewAccount = false;

    if (existingAccount) {
      console.log('✅ Account already exists:', existingAccount);
      accountId = existingAccount.id;
      
      // If account exists but never ran, we'll trigger a new run
      if (!existingAccount.last_run) {
        console.log('🔄 Existing account never ran, will trigger scraping');
      }
    } else {
      // Create new social account record
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
      accountId = newAccount.id;
      isNewAccount = true;
    }

    // Always trigger Apify scraping for new accounts or existing accounts that haven't run
    const apifyToken = Deno.env.get("APIFY_TOKEN");
    let apifyJobId = null;
    let scrapingTriggered = false;
    
    if (apifyToken && (isNewAccount || !existingAccount?.last_run)) {
      try {
        console.log(`🤖 Triggering Apify actor ${actorId} for ${handle} on ${platform}`);
        
        // Platform-specific input configuration
        let apifyInput = { username: handle };
        
        switch (platform.toLowerCase()) {
          case 'instagram':
            apifyInput = { 
              ...apifyInput,
              scrapeComments: false, 
              scrapeStories: false,
              resultsLimit: 50
            };
            break;
          case 'tiktok':
            apifyInput = { 
              ...apifyInput,
              maxPostCount: 20,
              resultsLimit: 20
            };
            break;
          case 'youtube':
            apifyInput = { 
              ...apifyInput,
              maxVideos: 30,
              resultsLimit: 30
            };
            break;
          case 'linkedin':
            apifyInput = { 
              ...apifyInput,
              scrapePostContent: true,
              resultsLimit: 25
            };
            break;
        }
        
        // Fixed Apify API URL format
        const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apifyToken}`;
        console.log('🔗 Apify URL:', apifyUrl);
        
        const apifyResponse = await fetch(apifyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apifyInput)
        });

        if (apifyResponse.ok) {
          const apifyResult = await apifyResponse.json();
          apifyJobId = apifyResult.data.id;
          console.log('✅ Apify job started:', apifyJobId);
          scrapingTriggered = true;
          
          // Update the account status to running and set last_run
          const { error: updateError } = await supabase
            .from('creators_social_accounts')
            .update({
              status: 'running',
              last_run: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', accountId);

          if (updateError) {
            console.error('❌ Failed to update account status:', updateError);
          }

          // Log the job in social_jobs table
          const { error: jobError } = await supabase
            .from('social_jobs')
            .insert({
              account_id: accountId,
              apify_run_id: apifyJobId,
              actor_type: 'primary',
              status: 'running',
              started_at: new Date().toISOString()
            });

          if (jobError) {
            console.error('❌ Failed to log social job:', jobError);
          }

        } else {
          const errorText = await apifyResponse.text();
          console.error('❌ Failed to trigger Apify actor:', errorText);
          
          // Update account with error status
          await supabase
            .from('creators_social_accounts')
            .update({
              status: 'failed',
              error_message: `Apify API error: ${errorText}`,
              updated_at: new Date().toISOString()
            })
            .eq('id', accountId);
        }
      } catch (apifyError) {
        console.error('❌ Error triggering Apify job:', apifyError);
        
        // Update account with error status
        await supabase
          .from('creators_social_accounts')
          .update({
            status: 'failed',
            error_message: `Failed to trigger scraping: ${apifyError.message}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', accountId);
      }
    } else if (!apifyToken) {
      console.warn('⚠️ APIFY_TOKEN not configured, analytics collection will be delayed');
    }

    // Determine response message and status
    const isExisting = !isNewAccount;
    let message, note;
    
    if (isExisting && existingAccount?.last_run) {
      message = `${platform.charAt(0).toUpperCase() + platform.slice(1)} account is already connected`;
      note = 'Your analytics are being updated automatically.';
    } else if (scrapingTriggered) {
      message = `${platform.charAt(0).toUpperCase() + platform.slice(1)} account connected successfully`;
      note = 'Analytics collection started - data will be available shortly.';
    } else {
      message = `${platform.charAt(0).toUpperCase() + platform.slice(1)} account connected`;
      note = 'Analytics collection will begin shortly.';
    }

    return new Response(
      JSON.stringify({
        success: true,
        message,
        account_id: accountId,
        status: scrapingTriggered ? 'running' : 'ready',
        apify_job_id: apifyJobId,
        isExisting,
        note,
        scraping_triggered: scrapingTriggered
      }),
      { headers: corsHeaders, status: isExisting ? 200 : 201 }
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

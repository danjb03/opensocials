
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log('🔧 trigger-social-scraping function started');
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const apifyToken = Deno.env.get("APIFY_TOKEN");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { headers: corsHeaders, status: 500 }
      );
    }

    if (!apifyToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'Apify token not configured' }),
        { headers: corsHeaders, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get accounts that need scraping (status ready but no last_run, or failed accounts)
    const { data: accounts, error: queryError } = await supabase
      .from('creators_social_accounts')
      .select('*')
      .or('and(status.eq.ready,last_run.is.null),status.eq.failed');

    if (queryError) {
      console.error('❌ Database query error:', queryError);
      return new Response(
        JSON.stringify({ success: false, error: 'Database error' }),
        { headers: corsHeaders, status: 500 }
      );
    }

    console.log(`🔍 Found ${accounts?.length || 0} accounts that need scraping`);

    if (!accounts || accounts.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No accounts need scraping',
          triggered: 0
        }),
        { headers: corsHeaders, status: 200 }
      );
    }

    let successCount = 0;
    let errorCount = 0;

    for (const account of accounts) {
      try {
        console.log(`🤖 Triggering scraping for ${account.platform}:${account.handle}`);

        // Platform-specific input configuration
        let apifyInput = { username: account.handle };
        
        switch (account.platform) {
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
        const apifyUrl = `https://api.apify.com/v2/acts/${account.actor_id}/runs?token=${apifyToken}`;
        console.log('🔗 Apify URL:', apifyUrl);

        const apifyResponse = await fetch(apifyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apifyInput)
        });

        if (apifyResponse.ok) {
          const apifyResult = await apifyResponse.json();
          const jobId = apifyResult.data.id;
          
          // Update account status
          await supabase
            .from('creators_social_accounts')
            .update({
              status: 'running',
              last_run: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              error_message: null
            })
            .eq('id', account.id);

          // Log the job
          await supabase
            .from('social_jobs')
            .insert({
              account_id: account.id,
              apify_run_id: jobId,
              actor_type: 'primary',
              status: 'running',
              started_at: new Date().toISOString()
            });

          console.log(`✅ Started job ${jobId} for ${account.platform}:${account.handle}`);
          successCount++;
        } else {
          const errorText = await apifyResponse.text();
          console.error(`❌ Failed to start job for ${account.platform}:${account.handle}:`, errorText);
          
          await supabase
            .from('creators_social_accounts')
            .update({
              status: 'failed',
              error_message: `Apify API error: ${errorText}`,
              updated_at: new Date().toISOString()
            })
            .eq('id', account.id);
          
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${account.platform}:${account.handle}:`, error);
        
        await supabase
          .from('creators_social_accounts')
          .update({
            status: 'failed',
            error_message: `Processing error: ${error.message}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', account.id);
          
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Triggered scraping for ${successCount} accounts`,
        triggered: successCount,
        errors: errorCount,
        total_processed: accounts.length
      }),
      { headers: corsHeaders, status: 200 }
    );

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unexpected error occurred'
      }),
      { headers: corsHeaders, status: 500 }
    );
  }
});

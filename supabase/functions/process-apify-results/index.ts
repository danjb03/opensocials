
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
    console.log('🔄 Processing Apify results...');
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const apifyToken = Deno.env.get("APIFY_TOKEN");
    
    if (!supabaseUrl || !supabaseServiceKey || !apifyToken) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get completed jobs that haven't been processed
    const { data: jobs, error: jobsError } = await supabase
      .from('social_jobs')
      .select(`
        *,
        creators_social_accounts (
          creator_id,
          platform,
          handle
        )
      `)
      .eq('status', 'running');

    if (jobsError) {
      console.error('❌ Error fetching jobs:', jobsError);
      throw jobsError;
    }

    console.log(`📊 Found ${jobs?.length || 0} running jobs to check`);

    let processedCount = 0;
    let errorCount = 0;

    for (const job of jobs || []) {
      try {
        console.log(`🔍 Checking Apify run: ${job.apify_run_id}`);
        
        // Check job status from Apify
        const statusResponse = await fetch(
          `https://api.apify.com/v2/acts/runs/${job.apify_run_id}?token=${apifyToken}`
        );

        if (!statusResponse.ok) {
          console.error(`❌ Failed to get status for run ${job.apify_run_id}`);
          continue;
        }

        const statusData = await statusResponse.json();
        const runStatus = statusData.data.status;

        console.log(`📊 Run ${job.apify_run_id} status: ${runStatus}`);

        if (runStatus === 'SUCCEEDED') {
          // Get the results
          const resultsResponse = await fetch(
            `https://api.apify.com/v2/acts/runs/${job.apify_run_id}/dataset/items?token=${apifyToken}`
          );

          if (resultsResponse.ok) {
            const results = await resultsResponse.json();
            console.log(`✅ Got ${results.length} results for ${job.apify_run_id}`);

            if (results.length > 0) {
              const result = results[0]; // Take first result
              
              // Update creator_public_analytics with the scraped data
              const analyticsData = {
                creator_id: job.creators_social_accounts.creator_id,
                platform: job.creators_social_accounts.platform,
                identifier: job.creators_social_accounts.handle,
                fetched_at: new Date().toISOString(),
                profile_url: result.url || null,
                image_url: result.profilePicUrl || result.avatar || null,
                full_name: result.fullName || result.displayName || null,
                is_verified: result.verified || false,
                follower_count: result.followersCount || result.followers || 0,
                engagement_rate: result.engagementRate || 0,
                platform_account_type: result.accountType || null,
                introduction: result.biography || result.bio || null,
                content_count: result.postsCount || result.posts || 0,
                average_likes: result.avgLikes || 0,
                average_comments: result.avgComments || 0,
                average_views: result.avgViews || 0,
                credibility_score: result.credibilityScore || 0,
              };

              const { error: upsertError } = await supabase
                .from('creator_public_analytics')
                .upsert(analyticsData, { 
                  onConflict: 'creator_id,platform' 
                });

              if (upsertError) {
                console.error('❌ Error upserting analytics:', upsertError);
              } else {
                console.log('✅ Updated analytics for creator:', job.creators_social_accounts.creator_id);
              }

              // Also update the creator_profiles table with key metrics
              const { error: profileError } = await supabase
                .from('creator_profiles')
                .update({
                  follower_count: result.followersCount || result.followers || 0,
                  engagement_rate: result.engagementRate || 0,
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', job.creators_social_accounts.creator_id);

              if (profileError) {
                console.error('❌ Error updating creator profile:', profileError);
              } else {
                console.log('✅ Updated creator profile for:', job.creators_social_accounts.creator_id);
              }
            }

            // Update job status to completed
            await supabase
              .from('social_jobs')
              .update({
                status: 'succeeded',
                completed_at: new Date().toISOString(),
                result_data: results[0] || null
              })
              .eq('id', job.id);

            // Update account status
            await supabase
              .from('creators_social_accounts')
              .update({
                status: 'ready',
                last_run: new Date().toISOString(),
                error_message: null
              })
              .eq('id', job.account_id);

            processedCount++;
          }
        } else if (runStatus === 'FAILED' || runStatus === 'ABORTED' || runStatus === 'TIMED_OUT') {
          // Update job as failed
          await supabase
            .from('social_jobs')
            .update({
              status: 'failed',
              completed_at: new Date().toISOString(),
              error_message: `Apify run ${runStatus.toLowerCase()}`
            })
            .eq('id', job.id);

          // Update account status
          await supabase
            .from('creators_social_accounts')
            .update({
              status: 'failed',
              error_message: `Scraping ${runStatus.toLowerCase()}`
            })
            .eq('id', job.account_id);

          errorCount++;
        }
        // If still running, we leave it as is and check again next time

      } catch (error) {
        console.error(`❌ Error processing job ${job.id}:`, error);
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${processedCount} jobs, ${errorCount} errors`,
        processed: processedCount,
        errors: errorCount
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

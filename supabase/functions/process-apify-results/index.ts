
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
      .eq('status', 'running')
      .limit(10); // Process in batches

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
        const statusUrl = `https://api.apify.com/v2/actor-runs/${job.apify_run_id}?token=${apifyToken}`;
        console.log('📡 Fetching status from:', statusUrl);
        
        const statusResponse = await fetch(statusUrl);
        
        if (!statusResponse.ok) {
          console.error(`❌ Status check failed for run ${job.apify_run_id}:`, statusResponse.status, statusResponse.statusText);
          
          // If it's a 404, the run might not exist anymore - mark as failed
          if (statusResponse.status === 404) {
            await supabase
              .from('social_jobs')
              .update({
                status: 'failed',
                completed_at: new Date().toISOString(),
                error_message: 'Apify run not found (404)'
              })
              .eq('id', job.id);
              
            await supabase
              .from('creators_social_accounts')
              .update({
                status: 'failed',
                error_message: 'Apify run not found'
              })
              .eq('id', job.account_id);
          }
          
          errorCount++;
          continue;
        }

        const statusData = await statusResponse.json();
        const runStatus = statusData.data?.status;

        console.log(`📊 Run ${job.apify_run_id} status: ${runStatus}`);

        if (runStatus === 'SUCCEEDED') {
          // Get the results from the default dataset
          const datasetId = statusData.data?.defaultDatasetId;
          if (!datasetId) {
            console.error('❌ No dataset ID found for completed run');
            errorCount++;
            continue;
          }

          const resultsUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}&format=json&clean=true`;
          console.log('📡 Fetching results from:', resultsUrl);
          
          const resultsResponse = await fetch(resultsUrl);

          if (!resultsResponse.ok) {
            console.error(`❌ Failed to get results for run ${job.apify_run_id}:`, resultsResponse.status);
            errorCount++;
            continue;
          }

          const results = await resultsResponse.json();
          console.log(`✅ Got ${results.length} results for ${job.apify_run_id}`);

          if (results.length > 0) {
            const result = results[0]; // Take first result
            console.log('📋 Processing result with keys:', Object.keys(result));
            
            // Map the Apify result data to our analytics structure
            const analyticsData = {
              creator_id: job.creators_social_accounts.creator_id,
              platform: job.creators_social_accounts.platform,
              identifier: job.creators_social_accounts.handle,
              fetched_at: new Date().toISOString(),
              profile_url: result.url || result.profileUrl || null,
              image_url: result.profilePicUrl || result.avatar || result.profilePic || result.imageUrl || null,
              full_name: result.fullName || result.displayName || result.name || result.title || null,
              is_verified: Boolean(result.verified || result.isVerified || result.isBusinessAccount),
              follower_count: parseInt(result.followersCount || result.followers || result.subscribersCount || result.followingCount || '0') || 0,
              engagement_rate: parseFloat(result.engagementRate || result.avgEngagement || '0') || 0,
              platform_account_type: result.accountType || result.type || result.category || null,
              introduction: result.biography || result.bio || result.description || result.about || null,
              content_count: parseInt(result.postsCount || result.posts || result.videosCount || result.mediaCount || '0') || 0,
              average_likes: parseInt(result.avgLikes || result.averageLikes || result.avgLikesCount || '0') || 0,
              average_comments: parseInt(result.avgComments || result.averageComments || result.avgCommentsCount || '0') || 0,
              average_views: parseInt(result.avgViews || result.averageViews || result.avgViewsCount || '0') || 0,
              credibility_score: parseFloat(result.credibilityScore || result.influenceScore || '0') || 0,
            };

            console.log('💾 Saving analytics data for creator:', job.creators_social_accounts.creator_id);

            // Upsert to creator_public_analytics
            const { error: upsertError } = await supabase
              .from('creator_public_analytics')
              .upsert(analyticsData, { 
                onConflict: 'creator_id,platform' 
              });

            if (upsertError) {
              console.error('❌ Error upserting analytics:', upsertError);
            } else {
              console.log('✅ Updated creator_public_analytics');
            }

            // Now update the creator_profiles table with comprehensive data from Apify
            console.log('🔄 Updating creator_profiles with Apify data...');
            
            const profileUpdateData = {
              // Update with scraped profile data
              avatar_url: analyticsData.image_url,
              bio: analyticsData.introduction,
              username: analyticsData.identifier,
              first_name: analyticsData.full_name ? analyticsData.full_name.split(' ')[0] : null,
              last_name: analyticsData.full_name ? analyticsData.full_name.split(' ').slice(1).join(' ') : null,
              // Update metrics
              follower_count: analyticsData.follower_count,
              engagement_rate: analyticsData.engagement_rate,
              // Set primary platform if not already set
              primary_platform: job.creators_social_accounts.platform,
              // Update other profile fields
              is_profile_complete: true,
              updated_at: new Date().toISOString()
            };

            // Only update fields that have meaningful data
            const cleanedUpdateData = Object.fromEntries(
              Object.entries(profileUpdateData).filter(([_, value]) => 
                value !== null && value !== undefined && value !== ''
              )
            );

            const { error: profileError } = await supabase
              .from('creator_profiles')
              .update(cleanedUpdateData)
              .eq('user_id', job.creators_social_accounts.creator_id);

            if (profileError) {
              console.error('❌ Error updating creator profile:', profileError);
            } else {
              console.log('✅ Updated creator_profiles with Apify data:', cleanedUpdateData);
            }

            // Update social handles in creator profile
            const { data: currentProfile } = await supabase
              .from('creator_profiles')
              .select('social_handles')
              .eq('user_id', job.creators_social_accounts.creator_id)
              .single();

            if (currentProfile) {
              const updatedSocialHandles = {
                ...currentProfile.social_handles,
                [job.creators_social_accounts.platform]: analyticsData.identifier
              };

              await supabase
                .from('creator_profiles')
                .update({ social_handles: updatedSocialHandles })
                .eq('user_id', job.creators_social_accounts.creator_id);

              console.log('✅ Updated social handles');
            }

            // Update job status to completed
            await supabase
              .from('social_jobs')
              .update({
                status: 'succeeded',
                completed_at: new Date().toISOString(),
                result_data: result
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
          } else {
            console.log('⚠️ No results found in dataset');
            
            // Mark as completed but with no data
            await supabase
              .from('social_jobs')
              .update({
                status: 'succeeded',
                completed_at: new Date().toISOString(),
                error_message: 'No data returned from scraper'
              })
              .eq('id', job.id);

            await supabase
              .from('creators_social_accounts')
              .update({
                status: 'failed',
                error_message: 'No data returned from scraper'
              })
              .eq('id', job.account_id);

            errorCount++;
          }
        } else if (runStatus === 'FAILED' || runStatus === 'ABORTED' || runStatus === 'TIMED_OUT') {
          console.log(`❌ Job ${job.apify_run_id} ${runStatus}`);
          
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
        } else {
          console.log(`⏳ Job ${job.apify_run_id} still ${runStatus || 'UNKNOWN'}, keeping as running...`);
        }

      } catch (error) {
        console.error(`❌ Error processing job ${job.id}:`, error);
        
        // Mark job as failed
        await supabase
          .from('social_jobs')
          .update({
            status: 'failed',
            completed_at: new Date().toISOString(),
            error_message: error.message
          })
          .eq('id', job.id);
          
        errorCount++;
      }
    }

    const response = {
      success: true,
      message: `Processed ${processedCount} jobs successfully, ${errorCount} errors`,
      processed: processedCount,
      errors: errorCount
    };

    console.log('✅ Processing complete:', response);

    return new Response(
      JSON.stringify(response),
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

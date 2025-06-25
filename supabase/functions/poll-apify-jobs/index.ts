import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../shared/admin-utils.ts";

// Platform-specific data transformers
const dataTransformers = {
  instagram: (rawData: any) => {
    // The official `apify/instagram-profile-scraper` returns
    // an object with the main profile details nested under `profile`
    // and posts under `latestPosts` (or `posts` for some versions).
    const root    = rawData[0] || {};
    const profile = root.profile || {};           // new location for profile stats
    const posts   = root.latestPosts || root.posts || [];

    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    
    const postsLast30Days = posts.filter((post: any) => 
      new Date(post.timestamp) >= lastMonth
    );
    
    // Calculate averages
    const likes = posts.map((p: any) => p.likesCount || 0);
    const comments = posts.map((p: any) => p.commentsCount || 0);
    const views = posts.filter((p: any) => p.videoViewCount > 0).map((p: any) => p.videoViewCount);
    
    const likesAvg = likes.length ? Math.round(likes.reduce((a: number, b: number) => a + b, 0) / likes.length) : 0;
    const commentsAvg = comments.length ? Math.round(comments.reduce((a: number, b: number) => a + b, 0) / comments.length) : 0;
    const viewsAvg = views.length ? Math.round(views.reduce((a: number, b: number) => a + b, 0) / views.length) : 0;
    
    // Followers count is now under `profile.followersCount`
    const followerCount =
      profile.followersCount ?? profile.followers ?? 0;

    // Calculate engagement rate
    const engagementRate = followerCount > 0
      ? parseFloat(((likesAvg + commentsAvg) / followerCount * 100).toFixed(2))
      : 0;
    
    // Get last post date
    const lastPostDate = posts.length > 0 
      ? new Date(posts[0].timestamp).toISOString().split('T')[0]
      : null;
    
    // Calculate posts per week
    const postsPerWeek = posts.length > 0 
      ? parseFloat((posts.length / (posts.length > 7 ? 4 : 1)).toFixed(1))
      : 0;
    
    // Get audience insights if available
    const audienceInsights = root.audienceInsights || {};
    
    return {
      // Platform presence
      profile_image:
        profile.profilePicUrlHD ||
        profile.profilePicUrl   ||
        null,
      username: profile.username,
      display_name: profile.fullName,
      account_type:
        profile.categoryName ||
        profile.businessCategory ||
        (profile.isBusinessAccount ? 'Business' : 'Personal'),
      is_verified: profile.isVerified || false,
      
      // Audience size
      followers: followerCount,
      
      // Engagement performance
      engagement_rate: engagementRate,
      views_avg: viewsAvg,
      likes_avg: likesAvg,
      comments_avg: commentsAvg,
      peak_reach: Math.max(...views, 0),
      
      // Audience insights
      gender_male: audienceInsights.genderMale || null,
      gender_female: audienceInsights.genderFemale || null,
      gender_other: audienceInsights.genderOther || null,
      age_ranges: audienceInsights.ageRanges || null,
      top_countries: audienceInsights.topCountries || null,
      top_cities: audienceInsights.topCities || null,
      languages: audienceInsights.languages || null,
      active_hours: audienceInsights.activeHours || null,
      
      // Posting frequency & recency
      posts_per_week: postsPerWeek,
      last_post_date: lastPostDate,
      posts_30d: postsLast30Days.length,
      inactivity_days: lastPostDate 
        ? Math.round((new Date().getTime() - new Date(lastPostDate).getTime()) / (1000 * 60 * 60 * 24))
        : null
    };
  },
  
  tiktok: {
    // Primary transformer for profile data
    primary: (rawData: any) => {
      // Two possible shapes:
      //  1) Official apify/tiktok-scraper  -> data.user, data.user.stats
      //  2) Clockworks actors              -> everything flat
      const root = rawData[0] || {};
      const user = root.user || root;            // user-level info
      const stats = user.stats || {};            // follower / following counts
      
      return {
        // Platform presence
        profile_image:
          user.avatarLarger ||
          user.avatarMedium ||
          user.avatarThumb ||
          null,
        username: user.uniqueId,
        display_name: user.nickname,
        account_type: user.isCommerce ? 'Business' : 'Personal',
        is_verified: user.verified || false,
        
        // Audience size
        followers: stats.followerCount ?? root.followerCount ?? 0,
        following: stats.followingCount ?? root.followingCount ?? 0,
        
        // Basic profile data
        bio: user.signature || '',
        website: user.bioLink || null
      };
    },
    
    // Secondary transformer for engagement data
    secondary: (rawData: any) => {
      const data = rawData[0] || {};
      // Official scraper stores videos in `collector`, clockworks in `items`
      const videos = data.collector || data.items || [];
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);
      
      const videosLast30Days = videos.filter((video: any) => 
        new Date(video.createTime) >= lastMonth
      );
      
      // Calculate averages
      const likes = videos.map((v: any) => v.stats?.diggCount || 0);
      const comments = videos.map((v: any) => v.stats?.commentCount || 0);
      const views = videos.map((v: any) => v.stats?.playCount || 0);
      
      const likesAvg = likes.length ? Math.round(likes.reduce((a: number, b: number) => a + b, 0) / likes.length) : 0;
      const commentsAvg = comments.length ? Math.round(comments.reduce((a: number, b: number) => a + b, 0) / comments.length) : 0;
      const viewsAvg = views.length ? Math.round(views.reduce((a: number, b: number) => a + b, 0) / views.length) : 0;
      
      // Get last post date
      const lastPostDate = videos.length > 0 
        ? new Date(videos[0].createTime).toISOString().split('T')[0]
        : null;
      
      // Calculate posts per week
      const postsPerWeek = videos.length > 0 
        ? parseFloat((videos.length / (videos.length > 7 ? 4 : 1)).toFixed(1))
        : 0;
      
      return {
        // Engagement performance
        views_avg: viewsAvg,
        likes_avg: likesAvg,
        comments_avg: commentsAvg,
        peak_reach: Math.max(...views, 0),
        
        // Posting frequency & recency
        posts_per_week: postsPerWeek,
        last_post_date: lastPostDate,
        posts_30d: videosLast30Days.length,
        inactivity_days: lastPostDate 
          ? Math.round((new Date().getTime() - new Date(lastPostDate).getTime()) / (1000 * 60 * 60 * 24))
          : null
      };
    },
    
    // Merge data from primary and secondary transformers
    merge: (primaryData: any, secondaryData: any) => {
      // Calculate engagement rate using followers from primary and engagement from secondary
      const engagementRate = primaryData.followers > 0 
        ? parseFloat(((secondaryData.likes_avg + secondaryData.comments_avg) / primaryData.followers * 100).toFixed(2))
        : 0;
      
      return {
        ...primaryData,
        ...secondaryData,
        engagement_rate: engagementRate
      };
    }
  },
  
  youtube: (rawData: any) => {
    const data = rawData[0] || {}; // YouTube usually returns a single item
    const videos = data.videos || [];
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    
    const videosLast30Days = videos.filter((video: any) => 
      new Date(video.publishedAt) >= lastMonth
    );
    
    // Calculate averages
    const likes = videos.map((v: any) => v.likeCount || 0);
    const comments = videos.map((v: any) => v.commentCount || 0);
    const views = videos.map((v: any) => v.viewCount || 0);
    
    const likesAvg = likes.length ? Math.round(likes.reduce((a: number, b: number) => a + b, 0) / likes.length) : 0;
    const commentsAvg = comments.length ? Math.round(comments.reduce((a: number, b: number) => a + b, 0) / comments.length) : 0;
    const viewsAvg = views.length ? Math.round(views.reduce((a: number, b: number) => a + b, 0) / views.length) : 0;
    
    // Calculate engagement rate
    const engagementRate = data.subscriberCount > 0 
      ? parseFloat(((likesAvg + commentsAvg) / data.subscriberCount * 100).toFixed(2))
      : 0;
    
    // Get last post date
    const lastPostDate = videos.length > 0 
      ? new Date(videos[0].publishedAt).toISOString().split('T')[0]
      : null;
    
    // Calculate posts per week
    const postsPerWeek = videos.length > 0 
      ? parseFloat((videos.length / (videos.length > 7 ? 4 : 1)).toFixed(1))
      : 0;
    
    return {
      // Platform presence
      profile_image: data.thumbnails?.high?.url || data.thumbnails?.default?.url,
      username: data.customUrl?.replace(/^@/, '') || data.title,
      display_name: data.title,
      is_verified: data.verified || false,
      
      // Audience size
      followers: data.subscriberCount || 0,
      
      // Engagement performance
      engagement_rate: engagementRate,
      views_avg: viewsAvg,
      likes_avg: likesAvg,
      comments_avg: commentsAvg,
      peak_reach: Math.max(...views, 0),
      
      // Posting frequency & recency
      posts_per_week: postsPerWeek,
      last_post_date: lastPostDate,
      posts_30d: videosLast30Days.length,
      inactivity_days: lastPostDate 
        ? Math.round((new Date().getTime() - new Date(lastPostDate).getTime()) / (1000 * 60 * 60 * 24))
        : null
    };
  },
  
  linkedin: {
    // Primary transformer for post engagement
    primary: (rawData: any) => {
      const data = rawData[0] || {}; // LinkedIn usually returns a single item
      const posts = data.posts || [];
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);
      
      const postsLast30Days = posts.filter((post: any) => 
        new Date(post.date) >= lastMonth
      );
      
      // Calculate averages
      const likes = posts.map((p: any) => p.likeCount || 0);
      const comments = posts.map((p: any) => p.commentCount || 0);
      
      const likesAvg = likes.length ? Math.round(likes.reduce((a: number, b: number) => a + b, 0) / likes.length) : 0;
      const commentsAvg = comments.length ? Math.round(comments.reduce((a: number, b: number) => a + b, 0) / comments.length) : 0;
      
      // Get last post date
      const lastPostDate = posts.length > 0 
        ? new Date(posts[0].date).toISOString().split('T')[0]
        : null;
      
      // Calculate posts per week
      const postsPerWeek = posts.length > 0 
        ? parseFloat((posts.length / (posts.length > 7 ? 4 : 1)).toFixed(1))
        : 0;
      
      return {
        // Platform presence
        profile_image: data.profilePicture || null,
        username: data.username || data.publicIdentifier,
        display_name: data.fullName || data.title,
        account_type: data.premium ? 'Premium' : 'Standard',
        is_verified: false, // LinkedIn doesn't have verification badges like other platforms
        
        // Basic metrics
        headline: data.headline || '',
        company: data.company || '',
        
        // Engagement performance
        likes_avg: likesAvg,
        comments_avg: commentsAvg,
        
        // Posting frequency & recency
        posts_per_week: postsPerWeek,
        last_post_date: lastPostDate,
        posts_30d: postsLast30Days.length,
        inactivity_days: lastPostDate 
          ? Math.round((new Date().getTime() - new Date(lastPostDate).getTime()) / (1000 * 60 * 60 * 24))
          : null
      };
    },
    
    // Secondary transformer for follower metrics
    secondary: (rawData: any) => {
      const data = rawData[0] || {};
      
      return {
        // Audience size
        followers: data.followers || 0,
        connections: data.connections || 0
      };
    },
    
    // Merge data from primary and secondary transformers
    merge: (primaryData: any, secondaryData: any) => {
      // Calculate engagement rate using followers from secondary and engagement from primary
      const engagementRate = secondaryData.followers > 0 
        ? parseFloat(((primaryData.likes_avg + primaryData.comments_avg) / secondaryData.followers * 100).toFixed(2))
        : 0;
      
      return {
        ...primaryData,
        ...secondaryData,
        engagement_rate: engagementRate
      };
    }
  }
};

// Helper function to determine if a platform uses dual actors
function usesDualActors(platform: string, actorId: any): boolean {
  // If actorId is a JSON string, parse it
  if (typeof actorId === 'string' && (actorId.startsWith('{') || actorId.includes('primary'))) {
    try {
      const parsed = JSON.parse(actorId);
      return parsed && parsed.primary && parsed.secondary;
    } catch (e) {
      return false;
    }
  }
  
  // If actorId is already an object, check for primary and secondary keys
  if (typeof actorId === 'object' && actorId !== null) {
    return actorId.primary && actorId.secondary;
  }
  
  return false;
}

// Helper function to parse actor ID from database
function parseActorId(actorId: any): { primary: string; secondary?: string } {
  if (typeof actorId === 'string') {
    // Try to parse as JSON
    try {
      const parsed = JSON.parse(actorId);
      if (parsed && parsed.primary) {
        return {
          primary: parsed.primary,
          secondary: parsed.secondary
        };
      }
    } catch (e) {
      // Not a JSON string, treat as a single actor ID
      return { primary: actorId };
    }
  } else if (typeof actorId === 'object' && actorId !== null) {
    // Already an object
    return {
      primary: actorId.primary,
      secondary: actorId.secondary
    };
  }
  
  // Default fallback
  return { primary: String(actorId) };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Get Apify token
    const APIFY_TOKEN = Deno.env.get("APIFY_TOKEN");
    if (!APIFY_TOKEN) {
      throw new Error("APIFY_TOKEN environment variable not set");
    }
    
    // Fetch all running jobs
    const { data: runningJobs, error: jobsError } = await supabase
      .from("social_jobs")
      .select(`
        id,
        account_id,
        apify_run_id,
        actor_type,
        social_accounts:creators_social_accounts (
          id,
          creator_id,
          platform,
          handle,
          actor_id
        )
      `)
      .in("status", ["running", "pending"])
      .order("started_at", { ascending: true });
    
    if (jobsError) {
      throw new Error(`Failed to fetch running jobs: ${jobsError.message}`);
    }
    
    if (!runningJobs || runningJobs.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No running jobs to process", 
          processed: 0 
        }),
        { headers: corsHeaders }
      );
    }
    
    // Process each job
    const results = [];
    
    for (const job of runningJobs) {
      try {
        // Check job status with Apify
        const apifyResponse = await fetch(
          `https://api.apify.com/v2/actor-runs/${job.apify_run_id}?token=${APIFY_TOKEN}`
        );
        
        if (!apifyResponse.ok) {
          throw new Error(`Apify API error: ${apifyResponse.statusText}`);
        }
        
        const apifyData = await apifyResponse.json();
        const jobStatus = apifyData.data.status;
        
        // Update job status in database
        await supabase
          .from("social_jobs")
          .update({
            status: jobStatus.toLowerCase(),
            finished_at: jobStatus === "SUCCEEDED" || jobStatus === "FAILED" || jobStatus === "TIMED_OUT" || jobStatus === "ABORTED" 
              ? new Date().toISOString() 
              : null
          })
          .eq("id", job.id);
        
        // If job succeeded, process the results
        if (jobStatus === "SUCCEEDED") {
          // Get the social account
          const account = job.social_accounts;
          
          if (!account) {
            throw new Error(`Social account not found for job ${job.id}`);
          }
          
          // Determine if platform uses dual actors
          const hasDualActors = usesDualActors(account.platform, account.actor_id);
          
          // Check if this is a dual-actor setup and if we need to wait for the other job
          if (hasDualActors) {
            // Mark this job as succeeded
            await supabase
              .from("social_jobs")
              .update({ 
                status: "succeeded"
              })
              .eq("id", job.id);
            
            // Check if the other job for this account is also succeeded
            const { data: otherJob, error: otherJobError } = await supabase
              .from("social_jobs")
              .select("id, status")
              .eq("account_id", account.id)
              .neq("id", job.id)
              .eq("actor_type", job.actor_type === "primary" ? "secondary" : "primary")
              .maybeSingle();
            
            if (otherJobError) {
              console.error(`Error checking other job: ${otherJobError.message}`);
            }
            
            // If other job is not succeeded yet, wait for it
            if (!otherJob || otherJob.status !== "succeeded") {
              results.push({
                jobId: job.id,
                status: "waiting_for_other_job",
                message: `Job succeeded, waiting for ${job.actor_type === "primary" ? "secondary" : "primary"} job to complete`
              });
              continue;
            }
            
            // Both jobs are succeeded, mark them with all_jobs_complete flag
            await supabase
              .from("social_jobs")
              .update({ 
                all_jobs_complete: true 
              })
              .in("id", [job.id, otherJob.id]);
            
            // Get raw data from both jobs
            const { data: primaryJob, error: primaryJobError } = await supabase
              .from("social_jobs")
              .select("raw_response")
              .eq("account_id", account.id)
              .eq("actor_type", "primary")
              .single();
            
            const { data: secondaryJob, error: secondaryJobError } = await supabase
              .from("social_jobs")
              .select("raw_response")
              .eq("account_id", account.id)
              .eq("actor_type", "secondary")
              .single();
            
            if (primaryJobError || secondaryJobError) {
              throw new Error(`Failed to fetch job data: ${primaryJobError?.message || secondaryJobError?.message}`);
            }
            
            if (!primaryJob.raw_response || !secondaryJob.raw_response) {
              // Fetch dataset items from Apify
              const primaryItems = await fetchApifyDataset(job.apify_run_id, APIFY_TOKEN);
              const secondaryItems = await fetchApifyDataset(otherJob.apify_run_id, APIFY_TOKEN);
              
              // Store raw responses
              await supabase
                .from("social_jobs")
                .update({ raw_response: primaryItems })
                .eq("account_id", account.id)
                .eq("actor_type", "primary");
              
              await supabase
                .from("social_jobs")
                .update({ raw_response: secondaryItems })
                .eq("account_id", account.id)
                .eq("actor_type", "secondary");
              
              // Process data using transformers
              const primaryData = dataTransformers[account.platform].primary(primaryItems);
              const secondaryData = dataTransformers[account.platform].secondary(secondaryItems);
              const mergedData = dataTransformers[account.platform].merge(primaryData, secondaryData);
              
              // Add metrics to database
              await processAndStoreMetrics(supabase, account, mergedData);
            } else {
              // Use stored raw responses
              const primaryItems = primaryJob.raw_response;
              const secondaryItems = secondaryJob.raw_response;
              
              // Process data using transformers
              const primaryData = dataTransformers[account.platform].primary(primaryItems);
              const secondaryData = dataTransformers[account.platform].secondary(secondaryItems);
              const mergedData = dataTransformers[account.platform].merge(primaryData, secondaryData);
              
              // Add metrics to database
              await processAndStoreMetrics(supabase, account, mergedData);
            }
          } else {
            // Single actor setup
            // Mark job as complete
            await supabase
              .from("social_jobs")
              .update({ 
                status: "succeeded",
                all_jobs_complete: true
              })
              .eq("id", job.id);
            
            // Check if we already have raw response
            const { data: jobData, error: jobDataError } = await supabase
              .from("social_jobs")
              .select("raw_response")
              .eq("id", job.id)
              .single();
            
            if (jobDataError) {
              throw new Error(`Failed to fetch job data: ${jobDataError.message}`);
            }
            
            let items;
            
            if (!jobData.raw_response) {
              // Fetch dataset items from Apify
              items = await fetchApifyDataset(job.apify_run_id, APIFY_TOKEN);
              
              // Store raw response
              await supabase
                .from("social_jobs")
                .update({ raw_response: items })
                .eq("id", job.id);
            } else {
              items = jobData.raw_response;
            }
            
            // Process data using transformer
            const transformedData = dataTransformers[account.platform](items);
            
            // Add metrics to database
            await processAndStoreMetrics(supabase, account, transformedData);
          }
          
          results.push({
            jobId: job.id,
            status: "processed",
            message: "Job processed successfully"
          });
        } else if (jobStatus === "FAILED" || jobStatus === "TIMED_OUT" || jobStatus === "ABORTED") {
          // Update account status to failed
          await supabase
            .from("creators_social_accounts")
            .update({
              status: "failed",
              error: `Apify job ${jobStatus.toLowerCase()}`
            })
            .eq("id", job.social_accounts.id);
          
          results.push({
            jobId: job.id,
            status: "failed",
            message: `Job ${jobStatus.toLowerCase()}`
          });
        } else {
          // Job still running
          results.push({
            jobId: job.id,
            status: "running",
            message: `Job status: ${jobStatus}`
          });
        }
      } catch (err) {
        console.error(`Error processing job ${job.id}:`, err);
        
        // Update job status to failed
        await supabase
          .from("social_jobs")
          .update({
            status: "failed",
            finished_at: new Date().toISOString(),
            error: err.message
          })
          .eq("id", job.id);
        
        // Update account status to failed
        if (job.social_accounts) {
          await supabase
            .from("creators_social_accounts")
            .update({
              status: "failed",
              error: err.message
            })
            .eq("id", job.social_accounts.id);
        }
        
        results.push({
          jobId: job.id,
          status: "error",
          message: err.message
        });
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${results.length} jobs`,
        processed: results.length,
        results
      }),
      { headers: corsHeaders }
    );
    
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message
      }),
      {
        headers: corsHeaders,
        status: 500
      }
    );
  }
});

// Helper function to fetch dataset items from Apify
async function fetchApifyDataset(runId: string, apifyToken: string) {
  // Get dataset ID from run
  const runResponse = await fetch(
    `https://api.apify.com/v2/actor-runs/${runId}?token=${apifyToken}`
  );
  
  if (!runResponse.ok) {
    throw new Error(`Failed to fetch run data: ${runResponse.statusText}`);
  }
  
  const runData = await runResponse.json();
  const datasetId = runData.data.defaultDatasetId;
  
  if (!datasetId) {
    throw new Error("No dataset found for this run");
  }
  
  // Fetch dataset items
  const datasetResponse = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}`
  );
  
  if (!datasetResponse.ok) {
    throw new Error(`Failed to fetch dataset items: ${datasetResponse.statusText}`);
  }
  
  return await datasetResponse.json();
}

// Helper function to process and store metrics
async function processAndStoreMetrics(supabase: any, account: any, metricsData: any) {
  try {
    // Calculate follower growth metrics
    // Get previous metrics
    const { data: prevMetrics, error: prevMetricsError } = await supabase
      .from("social_metrics")
      .select("followers, snapshot_ts")
      .eq("account_id", account.id)
      .order("snapshot_ts", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (prevMetricsError) {
      console.error(`Error fetching previous metrics: ${prevMetricsError.message}`);
    }
    
    // Get metrics from 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: oldMetrics, error: oldMetricsError } = await supabase
      .from("social_metrics")
      .select("followers, snapshot_ts")
      .eq("account_id", account.id)
      .lt("snapshot_ts", thirtyDaysAgo.toISOString())
      .order("snapshot_ts", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (oldMetricsError) {
      console.error(`Error fetching old metrics: ${oldMetricsError.message}`);
    }
    
    // Calculate growth metrics
    const followers_prev = prevMetrics?.followers || null;
    const followers_30d_ago = oldMetrics?.followers || null;
    
    // Calculate growth rates
    let growth_rate_30d = null;
    if (followers_30d_ago && metricsData.followers) {
      growth_rate_30d = parseFloat(
        ((metricsData.followers - followers_30d_ago) / followers_30d_ago * 100).toFixed(2)
      );
    }
    
    // Insert metrics into database
    const { error: insertError } = await supabase
      .from("social_metrics")
      .insert({
        account_id: account.id,
        snapshot_ts: new Date().toISOString(),
        followers: metricsData.followers,
        followers_prev,
        followers_30d_ago,
        growth_rate_30d,
        ...metricsData
      });
    
    if (insertError) {
      throw new Error(`Failed to insert metrics: ${insertError.message}`);
    }
    
    // Calculate next refresh time (7 days from now)
    const nextRun = new Date();
    nextRun.setDate(nextRun.getDate() + 7);
    
    // Update account status
    await supabase
      .from("creators_social_accounts")
      .update({
        status: "ready",
        last_run: new Date().toISOString(),
        next_run: nextRun.toISOString(),
        error: null
      })
      .eq("id", account.id);
    
    return true;
  } catch (error) {
    console.error("Error processing metrics:", error);
    
    // Update account status to failed
    await supabase
      .from("creators_social_accounts")
      .update({
        status: "failed",
        error: error.message
      })
      .eq("id", account.id);
    
    throw error;
  }
}

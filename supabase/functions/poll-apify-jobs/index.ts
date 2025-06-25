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
    const audienceInsights = data.audienceInsights || {};
    
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
        // Profile data
        profile_image: data.profilePicture,
        username: data.vanityName || data.publicIdentifier,
        display_name: data.fullName || data.title,
        account_type: data.companyPage ? 'Company' : 'Personal',
        
        // Engagement data
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
    
    // Secondary transformer for follower data
    secondary: (rawData: any) => {
      const data = rawData[0] || {};
      
      return {
        // Audience size
        followers: data.followerCount || data.profile?.followerCount || 0,
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
        engagement_rate: engagementRate,
        is_verified: false // LinkedIn doesn't have verification badges
      };
    }
  }
};

// Helper function to check if a platform uses dual actors
function usesDualActors(platform: string, actorId: any): boolean {
  try {
    // If actorId is a string, it's a single actor
    if (typeof actorId === 'string') {
      return false;
    }
    
    // If actorId is an object with primary and secondary properties, it's dual actors
    if (typeof actorId === 'object' && actorId !== null) {
      // Try to parse if it's a JSON string
      const parsedActorId = typeof actorId === 'string' 
        ? JSON.parse(actorId) 
        : actorId;
      
      return !!(parsedActorId.primary && parsedActorId.secondary);
    }
    
    // Default to platform-specific check
    return platform === 'tiktok' || platform === 'linkedin';
  } catch (err) {
    console.error('Error checking dual actors:', err);
    // Default to platform-specific check if parsing fails
    return platform === 'tiktok' || platform === 'linkedin';
  }
}

// Helper function to parse actor ID
function parseActorId(actorId: any): any {
  try {
    if (typeof actorId === 'string') {
      try {
        return JSON.parse(actorId);
      } catch {
        return actorId;
      }
    }
    return actorId;
  } catch (err) {
    console.error('Error parsing actor ID:', err);
    return actorId;
  }
}

// Main function to poll Apify jobs
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
    const apifyToken = Deno.env.get("APIFY_TOKEN");
    if (!apifyToken) {
      throw new Error("APIFY_TOKEN environment variable not set");
    }
    
    // Get running jobs
    const { data: runningJobs, error: jobsError } = await supabase
      .from("social_jobs")
      .select(`
        id,
        account_id,
        apify_run_id,
        actor_type,
        started_at,
        creators_social_accounts!inner(
          id,
          platform,
          handle,
          actor_id,
          status
        )
      `)
      .eq("status", "running")
      .order("started_at", { ascending: true })
      .limit(10); // Process 10 jobs at a time
    
    if (jobsError) {
      throw new Error(`Failed to fetch running jobs: ${jobsError.message}`);
    }
    
    if (!runningJobs || runningJobs.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No running jobs to process" 
        }),
        { headers: corsHeaders }
      );
    }
    
    console.log(`Processing ${runningJobs.length} running jobs`);
    
    // Process each job
    const results = await Promise.all(
      runningJobs.map(async (job) => {
        try {
          // Check Apify run status
          const apifyRunResponse = await fetch(
            `https://api.apify.com/v2/actor-runs/${job.apify_run_id}?token=${apifyToken}`
          );
          
          if (!apifyRunResponse.ok) {
            throw new Error(`Failed to fetch Apify run: ${await apifyRunResponse.text()}`);
          }
          
          const apifyRun = await apifyRunResponse.json();
          const runStatus = apifyRun.data.status;
          
          // Update job status
          await supabase
            .from("social_jobs")
            .update({
              status: runStatus.toLowerCase(),
              finished_at: runStatus !== "RUNNING" ? new Date().toISOString() : null
            })
            .eq("id", job.id);
          
          // If run is not finished, skip processing
          if (runStatus !== "SUCCEEDED") {
            // If run failed or timed out, update social account status
            if (runStatus === "FAILED" || runStatus === "TIMED_OUT" || runStatus === "ABORTED") {
              await supabase
                .from("creators_social_accounts")
                .update({
                  status: "failed",
                  error: `Apify run ${runStatus.toLowerCase()}`
                })
                .eq("id", job.account_id);
            }
            
            return {
              jobId: job.id,
              status: runStatus,
              processed: false
            };
          }
          
          // Get dataset items
          const datasetId = apifyRun.data.defaultDatasetId;
          const datasetResponse = await fetch(
            `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}`
          );
          
          if (!datasetResponse.ok) {
            throw new Error(`Failed to fetch dataset: ${await datasetResponse.text()}`);
          }
          
          const datasetItems = await datasetResponse.json();
          
          // Store raw response
          await supabase
            .from("social_jobs")
            .update({
              raw_response: datasetItems
            })
            .eq("id", job.id);
          
          // Get platform and check if it uses dual actors
          const platform = job.creators_social_accounts.platform;
          const actorId = parseActorId(job.creators_social_accounts.actor_id);
          const isDualActor = usesDualActors(platform, actorId);
          
          // If platform uses dual actors, check if both jobs are complete
          if (isDualActor) {
            // Mark this job as complete
            await supabase
              .from("social_jobs")
              .update({
                status: "succeeded",
                finished_at: new Date().toISOString()
              })
              .eq("id", job.id);
            
            // Check if the other job for this account is also complete
            const { data: otherJob, error: otherJobError } = await supabase
              .from("social_jobs")
              .select("id, status, raw_response, actor_type")
              .eq("account_id", job.account_id)
              .neq("id", job.id)
              .order("started_at", { ascending: false })
              .limit(1)
              .single();
            
            if (otherJobError || !otherJob || otherJob.status !== "succeeded") {
              // Other job is not complete yet, wait for it
              console.log(`Waiting for other job to complete for account ${job.account_id}`);
              return {
                jobId: job.id,
                status: "succeeded",
                processed: false,
                waitingForOtherJob: true
              };
            }
            
            // Both jobs are complete, update all_jobs_complete flag for both
            await supabase
              .from("social_jobs")
              .update({ all_jobs_complete: true })
              .in("id", [job.id, otherJob.id]);
            
            // Determine primary and secondary jobs
            const primaryJob = job.actor_type === "primary" ? job : otherJob;
            const secondaryJob = job.actor_type === "primary" ? otherJob : job;
            
            // Transform data from both jobs
            const primaryTransformer = dataTransformers[platform].primary;
            const secondaryTransformer = dataTransformers[platform].secondary;
            const mergeFunction = dataTransformers[platform].merge;
            
            if (!primaryTransformer || !secondaryTransformer || !mergeFunction) {
              throw new Error(`Missing transformer or merge function for platform: ${platform}`);
            }
            
            const primaryData = primaryTransformer(primaryJob.raw_response);
            const secondaryData = secondaryTransformer(secondaryJob.raw_response);
            
            // Merge data from both jobs
            const transformedData = mergeFunction(primaryData, secondaryData);
            
            // Get previous metrics for growth calculation
            const { data: previousMetrics } = await supabase
              .from("social_metrics")
              .select("followers, snapshot_ts")
              .eq("account_id", job.account_id)
              .order("snapshot_ts", { ascending: false })
              .limit(1);
            
            const previousFollowers = previousMetrics?.length > 0 ? previousMetrics[0].followers : null;
            
            // Get metrics from 30 days ago for growth calculation
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const { data: metricsThirtyDaysAgo } = await supabase
              .from("social_metrics")
              .select("followers")
              .eq("account_id", job.account_id)
              .lt("snapshot_ts", thirtyDaysAgo.toISOString())
              .order("snapshot_ts", { ascending: false })
              .limit(1);
            
            const followersThirtyDaysAgo = metricsThirtyDaysAgo?.length > 0 ? metricsThirtyDaysAgo[0].followers : null;
            
            // Insert metrics
            const { data: newMetrics, error: metricsError } = await supabase
              .from("social_metrics")
              .insert({
                account_id: job.account_id,
                ...transformedData,
                followers_prev: previousFollowers,
                followers_30d_ago: followersThirtyDaysAgo
              })
              .select("id")
              .single();
            
            if (metricsError) {
              throw new Error(`Failed to insert metrics: ${metricsError.message}`);
            }
            
            // Update social account status
            await supabase
              .from("creators_social_accounts")
              .update({
                status: "ready",
                error: null,
                // Refresh every 7 days (168 h) for all platforms
                next_run: new Date(Date.now() + 168 * 60 * 60 * 1000).toISOString()
              })
              .eq("id", job.account_id);
            
            return {
              jobId: job.id,
              status: "succeeded",
              processed: true,
              metricId: newMetrics.id,
              dualActorProcessed: true
            };
          } else {
            // Single actor platform
            // Transform data based on platform
            const transformer = typeof dataTransformers[platform] === 'object' 
              ? dataTransformers[platform].primary 
              : dataTransformers[platform];
              
            if (!transformer) {
              throw new Error(`No transformer found for platform: ${platform}`);
            }
            
            const transformedData = transformer(datasetItems);
            
            // Get previous metrics for growth calculation
            const { data: previousMetrics } = await supabase
              .from("social_metrics")
              .select("followers, snapshot_ts")
              .eq("account_id", job.account_id)
              .order("snapshot_ts", { ascending: false })
              .limit(1);
            
            const previousFollowers = previousMetrics?.length > 0 ? previousMetrics[0].followers : null;
            
            // Get metrics from 30 days ago for growth calculation
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const { data: metricsThirtyDaysAgo } = await supabase
              .from("social_metrics")
              .select("followers")
              .eq("account_id", job.account_id)
              .lt("snapshot_ts", thirtyDaysAgo.toISOString())
              .order("snapshot_ts", { ascending: false })
              .limit(1);
            
            const followersThirtyDaysAgo = metricsThirtyDaysAgo?.length > 0 ? metricsThirtyDaysAgo[0].followers : null;
            
            // Mark job as complete
            await supabase
              .from("social_jobs")
              .update({
                all_jobs_complete: true
              })
              .eq("id", job.id);
            
            // Insert metrics
            const { data: newMetrics, error: metricsError } = await supabase
              .from("social_metrics")
              .insert({
                account_id: job.account_id,
                ...transformedData,
                followers_prev: previousFollowers,
                followers_30d_ago: followersThirtyDaysAgo
              })
              .select("id")
              .single();
            
            if (metricsError) {
              throw new Error(`Failed to insert metrics: ${metricsError.message}`);
            }
            
            // Update social account status
            await supabase
              .from("creators_social_accounts")
              .update({
                status: "ready",
                error: null,
                // Refresh every 7 days (168 h) for all platforms
                next_run: new Date(Date.now() + 168 * 60 * 60 * 1000).toISOString()
              })
              .eq("id", job.account_id);
            
            return {
              jobId: job.id,
              status: "succeeded",
              processed: true,
              metricId: newMetrics.id,
              singleActorProcessed: true
            };
          }
        } catch (err) {
          console.error(`Error processing job ${job.id}:`, err);
          
          // Update job status
          await supabase
            .from("social_jobs")
            .update({
              status: "failed",
              log: err.message,
              finished_at: new Date().toISOString()
            })
            .eq("id", job.id);
          
          // Update social account status
          await supabase
            .from("creators_social_accounts")
            .update({
              status: "failed",
              error: `Error processing job: ${err.message}`
            })
            .eq("id", job.account_id);
          
          return {
            jobId: job.id,
            status: "failed",
            error: err.message,
            processed: false
          };
        }
      })
    );
    
    // Return results
    return new Response(
      JSON.stringify({
        success: true,
        processed: results.filter(r => r.processed).length,
        skipped: results.filter(r => !r.processed && r.status !== "failed").length,
        failed: results.filter(r => r.status === "failed").length,
        results
      }),
      { headers: corsHeaders }
    );
    
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Server error: ${err.message}` 
      }),
      { 
        headers: corsHeaders, 
        status: 500 
      }
    );
  }
});

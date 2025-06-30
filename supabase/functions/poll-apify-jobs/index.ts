import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Shared headers for CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * A robust helper function to extract a value from a potentially nested object
 * by trying a list of possible keys.
 * @param data The raw data object from Apify.
 * @param keys An array of possible keys to try.
 * @param defaultValue The value to return if no key is found.
 * @returns The found value or the default value.
 */
function extractValue(data: any, keys: string[], defaultValue: any = null) {
  if (!data) return defaultValue;
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null) {
      return data[key];
    }
  }
  // Fallback to search nested objects if no top-level key is found
  for (const prop in data) {
    if (typeof data[prop] === 'object' && data[prop] !== null) {
      for (const key of keys) {
        if (data[prop][key] !== undefined && data[prop][key] !== null) {
          return data[prop][key];
        }
      }
    }
  }
  return defaultValue;
}

/**
 * A collection of transformer functions to map raw Apify data from different
 * platforms into our standardized `social_metrics` schema.
 */
const dataTransformers = {
  instagram: (rawData: any) => {
    const followers = extractValue(rawData, ['followersCount', 'followers_count', 'followers']);
    const posts = extractValue(rawData, ['latestPosts', 'posts', 'items'], []);
    const avgLikes = posts.slice(0, 10).reduce((sum, post) => sum + (extractValue(post, ['likesCount', 'likes'], 0)), 0) / (posts.length || 1);
    const avgComments = posts.slice(0, 10).reduce((sum, post) => sum + (extractValue(post, ['commentsCount', 'comments'], 0)), 0) / (posts.length || 1);
    
    return {
      username: extractValue(rawData, ['username', 'handle']),
      profile_url: `https://instagram.com/${extractValue(rawData, ['username', 'handle'])}`,
      profile_picture_url: extractValue(rawData, ['profilePicUrl', 'profile_picture_url']),
      followers_count: followers,
      following_count: extractValue(rawData, ['followsCount', 'following_count']),
      bio: extractValue(rawData, ['biography', 'bio']),
      location: extractValue(rawData, ['location']),
      engagement_rate: followers > 0 ? ((avgLikes + avgComments) / followers) * 100 : 0,
      post_frequency: null, // Needs historical data to calculate
      is_verified: extractValue(rawData, ['verified', 'isVerified'], false),
      account_type: extractValue(rawData, ['isBusinessAccount']) ? 'business' : 'personal',
      platform_data: {
        avg_likes: avgLikes,
        avg_comments: avgComments,
        posts_count: extractValue(rawData, ['postsCount', 'posts_count']),
      }
    };
  },
  tiktok: (primaryData: any, secondaryData: any) => {
    const followers = extractValue(primaryData, ['followerCount', 'followers']);
    const videos = extractValue(secondaryData, ['videos', 'items'], []);
    const avgLikes = videos.slice(0, 10).reduce((sum, video) => sum + (extractValue(video, ['diggCount', 'likes'], 0)), 0) / (videos.length || 1);
    const avgComments = videos.slice(0, 10).reduce((sum, video) => sum + (extractValue(video, ['commentCount', 'comments'], 0)), 0) / (videos.length || 1);
    const avgViews = videos.slice(0, 10).reduce((sum, video) => sum + (extractValue(video, ['playCount', 'views'], 0)), 0) / (videos.length || 1);

    return {
      username: extractValue(primaryData, ['uniqueId', 'username']),
      profile_url: `https://tiktok.com/@${extractValue(primaryData, ['uniqueId', 'username'])}`,
      profile_picture_url: extractValue(primaryData, ['avatarLarger', 'avatarThumb']),
      followers_count: followers,
      following_count: extractValue(primaryData, ['followingCount']),
      bio: extractValue(primaryData, ['signature', 'bio']),
      location: null,
      engagement_rate: followers > 0 ? ((avgLikes + avgComments) / followers) * 100 : 0,
      post_frequency: null,
      is_verified: extractValue(primaryData, ['verified']),
      account_type: extractValue(primaryData, ['isCommerce']) ? 'business' : 'personal',
      platform_data: {
        avg_likes: avgLikes,
        avg_comments: avgComments,
        avg_views: avgViews,
        total_likes: extractValue(primaryData, ['heartCount', 'likes']),
        videos_count: extractValue(primaryData, ['videoCount', 'videos']),
      }
    };
  },
  youtube: (primaryData: any, secondaryData: any) => {
    const subscribers = extractValue(primaryData, ['subscriberCount', 'subscribers']);
    const videos = extractValue(secondaryData, ['videos', 'items'], []);
    const avgLikes = videos.slice(0, 10).reduce((sum, video) => sum + (extractValue(video, ['likeCount', 'likes'], 0)), 0) / (videos.length || 1);
    const avgComments = videos.slice(0, 10).reduce((sum, video) => sum + (extractValue(video, ['commentCount', 'comments'], 0)), 0) / (videos.length || 1);
    const avgViews = videos.slice(0, 10).reduce((sum, video) => sum + (extractValue(video, ['viewCount', 'views'], 0)), 0) / (videos.length || 1);

    return {
      username: extractValue(primaryData, ['title', 'channelTitle']),
      profile_url: `https://youtube.com/channel/${extractValue(primaryData, ['id', 'channelId'])}`,
      profile_picture_url: extractValue(primaryData, ['thumbnails', 'avatarUrl'])?.high?.url,
      followers_count: subscribers,
      following_count: null,
      bio: extractValue(primaryData, ['description']),
      location: extractValue(primaryData, ['country']),
      engagement_rate: avgViews > 0 ? ((avgLikes + avgComments) / avgViews) * 100 : 0,
      post_frequency: null,
      is_verified: extractValue(primaryData, ['verified']),
      account_type: null,
      platform_data: {
        avg_likes: avgLikes,
        avg_comments: avgComments,
        avg_views: avgViews,
        total_views: extractValue(primaryData, ['viewCount', 'views']),
        video_count: extractValue(primaryData, ['videoCount', 'videos']),
      }
    };
  },
  linkedin: (primaryData: any, secondaryData: any) => {
    const followers = extractValue(secondaryData, ['followerCount', 'followers']);
    const posts = extractValue(primaryData, ['posts', 'activity'], []);
    const avgLikes = posts.slice(0, 10).reduce((sum, post) => sum + (extractValue(post, ['likeCount', 'likes'], 0)), 0) / (posts.length || 1);
    const avgComments = posts.slice(0, 10).reduce((sum, post) => sum + (extractValue(post, ['commentCount', 'comments'], 0)), 0) / (posts.length || 1);

    return {
      username: extractValue(primaryData, ['vanityName', 'publicIdentifier']),
      profile_url: `https://linkedin.com/in/${extractValue(primaryData, ['vanityName', 'publicIdentifier'])}`,
      profile_picture_url: extractValue(primaryData, ['profilePicture', 'avatar']),
      followers_count: followers,
      following_count: extractValue(primaryData, ['connectionsCount', 'connections']),
      bio: extractValue(primaryData, ['headline', 'summary']),
      location: extractValue(primaryData, ['locationName', 'location']),
      engagement_rate: followers > 0 ? ((avgLikes + avgComments) / followers) * 100 : 0,
      post_frequency: null,
      is_verified: false,
      account_type: extractValue(primaryData, ['companyPage']) ? 'company' : 'personal',
      platform_data: {
        avg_likes: avgLikes,
        avg_comments: avgComments,
        industry: extractValue(primaryData, ['industryName']),
      }
    };
  },
  twitter: (rawData: any) => {
    const followers = extractValue(rawData, ['followers_count', 'followersCount']);
    const tweets = extractValue(rawData, ['statuses', 'tweets'], []);
    const avgLikes = tweets.slice(0, 10).reduce((sum, tweet) => sum + (extractValue(tweet, ['favorite_count', 'likes'], 0)), 0) / (tweets.length || 1);
    const avgRetweets = tweets.slice(0, 10).reduce((sum, tweet) => sum + (extractValue(tweet, ['retweet_count', 'retweets'], 0)), 0) / (tweets.length || 1);

    return {
      username: extractValue(rawData, ['screen_name', 'username']),
      profile_url: `https://twitter.com/${extractValue(rawData, ['screen_name', 'username'])}`,
      profile_picture_url: extractValue(rawData, ['profile_image_url_https', 'profile_image_url']),
      followers_count: followers,
      following_count: extractValue(rawData, ['friends_count', 'followingCount']),
      bio: extractValue(rawData, ['description', 'bio']),
      location: extractValue(rawData, ['location']),
      engagement_rate: followers > 0 ? ((avgLikes + avgRetweets) / followers) * 100 : 0,
      post_frequency: null,
      is_verified: extractValue(rawData, ['verified']),
      account_type: null,
      platform_data: {
        avg_likes: avgLikes,
        avg_retweets: avgRetweets,
        tweet_count: extractValue(rawData, ['statuses_count', 'tweetCount']),
      }
    };
  },
};

/**
 * Fetches the dataset from a completed Apify run.
 * @param runId The ID of the Apify actor run.
 * @param apifyToken Your Apify API token.
 * @returns The dataset items.
 */
async function fetchApifyDataset(runId: string, apifyToken: string) {
  const runResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${apifyToken}`);
  if (!runResponse.ok) throw new Error(`Failed to fetch run data for ${runId}`);
  
  const runData = await runResponse.json();
  const datasetId = runData.data.defaultDatasetId;
  if (!datasetId) throw new Error(`No dataset found for run ${runId}`);
  
  const datasetResponse = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}`);
  if (!datasetResponse.ok) throw new Error(`Failed to fetch dataset items for ${datasetId}`);
  
  return await datasetResponse.json();
}

/**
 * Processes a completed job, normalizes data, and upserts it into the database.
 * @param supabase The Supabase client instance.
 * @param job The job object to process.
 * @param apifyToken Your Apify API token.
 */
async function processSucceededJob(supabase, job, apifyToken) {
  const account = job.creators_social_accounts;
  const platform = account.platform;
  const isDualActor = typeof PLATFORM_ACTORS[platform] === 'object';

  // Fetch raw data from Apify and store it in the job record
  const rawData = await fetchApifyDataset(job.apify_run_id, apifyToken);
  await supabase.from("social_jobs").update({ raw_response: rawData }).eq("id", job.id);

  let normalizedData;

  if (isDualActor) {
    // For dual-actor platforms, wait for both jobs to succeed
    const otherJobType = job.actor_type === 'primary' ? 'secondary' : 'primary';
    const { data: otherJob, error } = await supabase
      .from("social_jobs")
      .select("status, raw_response")
      .eq("account_id", account.id)
      .eq("actor_type", otherJobType)
      .order("started_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !otherJob || otherJob.status !== 'succeeded') {
      // The other job isn't ready yet, so we'll wait for the next poll.
      return { status: 'waiting', message: `Job ${job.id} succeeded, but waiting for sibling job.` };
    }
    
    // Both jobs are ready, let's merge
    const primaryRaw = job.actor_type === 'primary' ? rawData : otherJob.raw_response;
    const secondaryRaw = job.actor_type === 'secondary' ? rawData : otherJob.raw_response;
    normalizedData = dataTransformers[platform](primaryRaw[0], secondaryRaw[0]);

  } else {
    // Single actor platform
    normalizedData = dataTransformers[platform](rawData[0]);
  }

  // Upsert the normalized metrics
  const { error: upsertError } = await supabase.from("social_metrics").upsert({
    creator_id: account.creator_id,
    platform: platform,
    ...normalizedData,
  }, { onConflict: 'creator_id, platform' });

  if (upsertError) throw upsertError;

  // Mark the social account as 'ready'
  await supabase.from("creators_social_accounts").update({ status: 'ready' }).eq("id", account.id);
  
  return { status: 'processed', metrics: normalizedData };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const apifyToken = Deno.env.get("APIFY_TOKEN");
    if (!apifyToken) throw new Error("APIFY_TOKEN is not set");

    // Fetch all jobs that are not yet fully processed
    const { data: jobs, error: jobsError } = await supabase
      .from("social_jobs")
      .select("*, creators_social_accounts(*)")
      .in("status", ["running", "pending"]);
    
    if (jobsError) throw jobsError;
    if (!jobs || jobs.length === 0) {
      return new Response(JSON.stringify({ message: "No jobs to process." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const results = [];
    for (const job of jobs) {
      try {
        const apifyResponse = await fetch(`https://api.apify.com/v2/actor-runs/${job.apify_run_id}?token=${apifyToken}`);
        if (!apifyResponse.ok) throw new Error(`Apify API error: ${apifyResponse.statusText}`);
        
        const apifyData = await apifyResponse.json();
        const jobStatus = apifyData.data.status;

        await supabase.from("social_jobs").update({ status: jobStatus.toLowerCase() }).eq("id", job.id);

        if (jobStatus === "SUCCEEDED") {
          const result = await processSucceededJob(supabase, job, apifyToken);
          results.push({ jobId: job.id, ...result });
        } else if (["FAILED", "TIMED_OUT", "ABORTED"].includes(jobStatus)) {
          await supabase.from("creators_social_accounts").update({ status: 'failed', error: `Apify job ${jobStatus}` }).eq("id", job.creators_social_accounts.id);
          results.push({ jobId: job.id, status: 'failed', error: `Apify job ${jobStatus}` });
        } else {
          results.push({ jobId: job.id, status: 'running' });
        }
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error.message);
        results.push({ jobId: job.id, status: 'error', error: error.message });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in poll-apify-jobs:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapingRequest {
  user_id: string;
  platform: string;
  username: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id, platform, username }: ScrapingRequest = await req.json()

    if (!user_id || !platform || !username) {
      throw new Error('Missing required parameters: user_id, platform, username')
    }

    console.log(`🚀 Starting scrape for ${platform}:${username} (user: ${user_id})`)

    // Get Apify token from secrets
    const apifyToken = Deno.env.get('APIFY_TOKEN')
    if (!apifyToken) {
      throw new Error('APIFY_TOKEN not configured')
    }

    // Platform-specific actor IDs
    const actorIds = {
      'instagram': 'apify/instagram-profile-scraper',
      'tiktok': 'apify/tiktok-profile-scraper',
      'youtube': 'apify/youtube-scraper',
      'linkedin': 'apify/linkedin-profile-scraper'
    }

    const actorId = actorIds[platform as keyof typeof actorIds]
    if (!actorId) {
      throw new Error(`Unsupported platform: ${platform}`)
    }

    // Start Apify run
    const runResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apifyToken}`
      },
      body: JSON.stringify({
        startUrls: [`https://${platform}.com/${username}`],
        maxRequestRetries: 3,
        requestHandlerTimeoutSecs: 60
      })
    })

    if (!runResponse.ok) {
      throw new Error(`Failed to start Apify run: ${runResponse.statusText}`)
    }

    const runData = await runResponse.json()
    const runId = runData.data.id

    console.log(`⏳ Apify run started: ${runId}`)

    // Wait for completion (with timeout)
    let attempts = 0
    const maxAttempts = 30 // 5 minutes max
    let runStatus = 'RUNNING'

    while (runStatus === 'RUNNING' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
      
      const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, {
        headers: { 'Authorization': `Bearer ${apifyToken}` }
      })

      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        runStatus = statusData.data.status
        console.log(`📊 Run status: ${runStatus}`)
      }

      attempts++
    }

    if (runStatus !== 'SUCCEEDED') {
      throw new Error(`Scraping failed or timed out. Status: ${runStatus}`)
    }

    // Get the results
    const resultsResponse = await fetch(`https://api.apify.com/v2/datasets/${runData.data.defaultDatasetId}/items`, {
      headers: { 'Authorization': `Bearer ${apifyToken}` }
    })

    if (!resultsResponse.ok) {
      throw new Error(`Failed to fetch results: ${resultsResponse.statusText}`)
    }

    const results = await resultsResponse.json()
    
    if (!results || results.length === 0) {
      throw new Error('No data returned from scraper')
    }

    const profileData = results[0]

    // Extract metrics based on platform
    let metrics = {
      followers: 0,
      engagement_rate: 0,
      posts_count: 0,
      avg_likes: 0,
      avg_comments: 0
    }

    if (platform === 'instagram') {
      metrics = {
        followers: profileData.followersCount || 0,
        engagement_rate: profileData.engagementRate || 0,
        posts_count: profileData.postsCount || 0,
        avg_likes: profileData.avgLikes || 0,
        avg_comments: profileData.avgComments || 0
      }
    } else if (platform === 'tiktok') {
      metrics = {
        followers: profileData.followerCount || 0,
        engagement_rate: profileData.engagementRate || 0,
        posts_count: profileData.videoCount || 0,
        avg_likes: profileData.avgLikes || 0,
        avg_comments: profileData.avgComments || 0
      }
    }

    // Upsert metrics to database
    const { error: upsertError } = await supabaseClient
      .from('social_metrics')
      .upsert({
        user_id,
        platform,
        username,
        followers: metrics.followers,
        engagement_rate: metrics.engagement_rate,
        posts_count: metrics.posts_count,
        avg_likes: metrics.avg_likes,
        avg_comments: metrics.avg_comments,
        last_updated: new Date().toISOString(),
        raw_data: profileData
      }, {
        onConflict: 'user_id,platform'
      })

    if (upsertError) {
      throw upsertError
    }

    // Update the social account status
    const { error: updateError } = await supabaseClient
      .from('creators_social_accounts')
      .update({
        status: 'ready',
        last_run: new Date().toISOString(),
        error_message: null
      })
      .eq('creator_id', user_id)
      .eq('platform', platform)

    if (updateError) {
      console.error('Failed to update social account status:', updateError)
    }

    console.log(`✅ Successfully scraped ${platform}:${username}`)

    return new Response(JSON.stringify({
      success: true,
      metrics,
      run_id: runId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Scraping error:', error)
    
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

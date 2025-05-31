import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// AI Content Detection System
// This function can be scheduled to run periodically to detect posted content

interface PlatformAPI {
  platform: string;
  checkUserPosts: (username: string, since: Date) => Promise<PostData[]>;
}

interface PostData {
  post_url: string;
  posted_at: string;
  post_type: 'story' | 'post' | 'reel' | 'video';
  metrics: {
    likes?: number;
    comments?: number;
    views?: number;
    shares?: number;
  };
}

// Mock platform API implementations
// In production, these would integrate with actual social media APIs
class InstagramAPI implements PlatformAPI {
  platform = 'instagram';
  
  async checkUserPosts(username: string, since: Date): Promise<PostData[]> {
    // Mock implementation - in production, integrate with Instagram Basic Display API
    console.log(`Checking Instagram posts for ${username} since ${since.toISOString()}`)
    
    // This would make actual API calls to Instagram
    // return await fetch(`https://graph.instagram.com/me/media?access_token=${token}&since=${since.getTime()}`)
    
    return [] // Return mock data or actual API results
  }
}

class TikTokAPI implements PlatformAPI {
  platform = 'tiktok';
  
  async checkUserPosts(username: string, since: Date): Promise<PostData[]> {
    // Mock implementation - in production, integrate with TikTok API
    console.log(`Checking TikTok posts for ${username} since ${since.toISOString()}`)
    return []
  }
}

class YouTubeAPI implements PlatformAPI {
  platform = 'youtube';
  
  async checkUserPosts(username: string, since: Date): Promise<PostData[]> {
    // Mock implementation - in production, integrate with YouTube Data API
    console.log(`Checking YouTube posts for ${username} since ${since.toISOString()}`)
    return []
  }
}

const platformAPIs: PlatformAPI[] = [
  new InstagramAPI(),
  new TikTokAPI(),
  new YouTubeAPI()
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const mode = url.searchParams.get('mode') || 'scan_all'
    const campaign_id = url.searchParams.get('campaign_id')

    // Get approved uploads that don't have proof yet
    let query = supabase
      .from('uploads')
      .select(`
        id,
        campaign_id,
        creator_id,
        platform,
        approved_at,
        profiles!uploads_creator_id_fkey (
          id,
          full_name
        ),
        creator_profiles!uploads_creator_id_fkey (
          instagram_handle,
          tiktok_handle,
          youtube_handle
        )
      `)
      .eq('status', 'approved')
      .is('proof_log.upload_id', null)

    if (campaign_id) {
      query = query.eq('campaign_id', campaign_id)
    }

    // Only check uploads approved in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    query = query.gte('approved_at', thirtyDaysAgo.toISOString())

    const { data: uploadsToCheck, error } = await query

    if (error) {
      throw new Error('Failed to fetch uploads to check')
    }

    const detectionResults = []

    for (const upload of uploadsToCheck || []) {
      try {
        // Get the appropriate username for the platform
        let username = ''
        switch (upload.platform) {
          case 'instagram':
            username = upload.creator_profiles?.instagram_handle || ''
            break
          case 'tiktok':
            username = upload.creator_profiles?.tiktok_handle || ''
            break
          case 'youtube':
            username = upload.creator_profiles?.youtube_handle || ''
            break
        }

        if (!username) {
          console.log(`No username found for ${upload.platform} for creator ${upload.creator_id}`)
          continue
        }

        // Find the appropriate API
        const platformAPI = platformAPIs.find(api => api.platform === upload.platform)
        if (!platformAPI) {
          console.log(`No API implementation for platform ${upload.platform}`)
          continue
        }

        // Check for posts since approval date
        const sinceDate = new Date(upload.approved_at)
        const posts = await platformAPI.checkUserPosts(username, sinceDate)

        // Analyze posts to see if any match the upload
        for (const post of posts) {
          // In production, you'd use AI/ML to match content
          // For now, we'll use simple heuristics or manual matching
          
          const matchConfidence = await analyzeContentMatch(upload, post)
          
          if (matchConfidence > 0.8) { // 80% confidence threshold
            // Create proof log entry
            const { data: proof, error: proofError } = await supabase
              .from('proof_log')
              .insert({
                upload_id: upload.id,
                campaign_id: upload.campaign_id,
                creator_id: upload.creator_id,
                proof_url: post.post_url,
                platform: upload.platform,
                post_type: post.post_type,
                posted_at: post.posted_at,
                detection_method: 'ai_detected',
                metrics: post.metrics,
                is_live: true
              })
              .select()
              .single()

            if (!proofError) {
              detectionResults.push({
                upload_id: upload.id,
                proof_id: proof.id,
                confidence: matchConfidence,
                post_url: post.post_url,
                detected: true
              })

              console.log(`AI detected post for upload ${upload.id}: ${post.post_url}`)
            }
          }
        }

      } catch (error) {
        console.error(`Error checking upload ${upload.id}:`, error)
        detectionResults.push({
          upload_id: upload.id,
          detected: false,
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        checked_uploads: uploadsToCheck?.length || 0,
        detections: detectionResults.length,
        results: detectionResults
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('AI content detector error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

// AI/ML content matching function
async function analyzeContentMatch(upload: any, post: PostData): Promise<number> {
  // In production, this would use AI/ML to analyze:
  // - Visual similarity (image/video comparison)
  // - Text similarity (captions, descriptions)
  // - Timing correlation
  // - Platform-specific metadata
  
  // For now, return a mock confidence score
  // You would integrate with services like:
  // - Google Vision API for image comparison
  // - AWS Rekognition for video analysis
  // - OpenAI for text similarity
  // - Custom ML models
  
  const timeDiff = Math.abs(
    new Date(post.posted_at).getTime() - new Date(upload.approved_at).getTime()
  )
  
  // Simple heuristic: posts within 7 days of approval are likely matches
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  
  if (timeDiff < sevenDays) {
    return 0.85 // High confidence for recent posts
  } else if (timeDiff < sevenDays * 2) {
    return 0.6 // Medium confidence
  } else {
    return 0.3 // Low confidence
  }
}

// Schedule this function to run periodically:
// - Via cron job: */30 * * * * (every 30 minutes)
// - Via Supabase Edge Function cron
// - Via external scheduler (GitHub Actions, etc.)
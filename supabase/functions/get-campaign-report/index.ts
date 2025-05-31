import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CampaignReport {
  campaign_id: string;
  campaign_name: string;
  campaign_status: string;
  total_creators: number;
  total_uploads: number;
  approved_uploads: number;
  rejected_uploads: number;
  pending_uploads: number;
  live_posts: number;
  total_reach: number;
  total_engagement: number;
  avg_engagement_rate: number;
  creators: Array<{
    creator_id: string;
    creator_name: string;
    uploads_count: number;
    approved_count: number;
    live_posts_count: number;
    total_engagement: number;
    proof_urls: string[];
    last_activity: string;
  }>;
  proof_log: Array<{
    creator_name: string;
    platform: string;
    post_type: string;
    proof_url: string;
    posted_at: string;
    metrics: Record<string, any>;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: user, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user.user) {
      throw new Error('Unauthorized')
    }

    const user_id = user.user.id
    const url = new URL(req.url)
    const campaign_id = url.searchParams.get('campaign_id')
    const creator_id = url.searchParams.get('creator_id') // Optional: filter by specific creator

    if (!campaign_id) {
      throw new Error('campaign_id parameter is required')
    }

    // Validate user has access to this campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('projects_new')
      .select('id, name, status, brand_id')
      .eq('id', campaign_id)
      .single()

    if (campaignError || !campaign) {
      throw new Error('Campaign not found')
    }

    // Check if user is brand owner or admin
    const isBrandOwner = campaign.brand_id === user_id
    let isAdmin = false

    if (!isBrandOwner) {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user_id)
        .eq('role', 'admin')
        .single()

      isAdmin = !!userRole
    }

    if (!isBrandOwner && !isAdmin) {
      throw new Error('Unauthorized - not campaign owner or admin')
    }

    // Get campaign analytics summary
    const { data: analytics } = await supabase
      .from('campaign_analytics')
      .select('*')
      .eq('campaign_id', campaign_id)
      .single()

    // Get uploads summary
    const { data: uploadsStats } = await supabase
      .from('uploads')
      .select('status')
      .eq('campaign_id', campaign_id)

    const uploadCounts = {
      total: uploadsStats?.length || 0,
      approved: uploadsStats?.filter(u => u.status === 'approved').length || 0,
      rejected: uploadsStats?.filter(u => u.status === 'rejected').length || 0,
      pending: uploadsStats?.filter(u => u.status === 'pending_review').length || 0
    }

    // Get creator performance data
    let creatorQuery = supabase
      .from('uploads')
      .select(`
        creator_id,
        status,
        profiles!uploads_creator_id_fkey (
          id,
          full_name
        )
      `)
      .eq('campaign_id', campaign_id)

    if (creator_id) {
      creatorQuery = creatorQuery.eq('creator_id', creator_id)
    }

    const { data: creatorUploads } = await creatorQuery

    // Group by creator
    const creatorMap = new Map()
    creatorUploads?.forEach(upload => {
      const id = upload.creator_id
      if (!creatorMap.has(id)) {
        creatorMap.set(id, {
          creator_id: id,
          creator_name: upload.profiles?.full_name || 'Unknown Creator',
          uploads_count: 0,
          approved_count: 0,
          live_posts_count: 0,
          total_engagement: 0,
          proof_urls: [],
          last_activity: null
        })
      }
      
      const creator = creatorMap.get(id)
      creator.uploads_count++
      if (upload.status === 'approved') {
        creator.approved_count++
      }
    })

    // Get proof log data
    let proofQuery = supabase
      .from('proof_log')
      .select(`
        creator_id,
        platform,
        post_type,
        proof_url,
        posted_at,
        metrics,
        profiles!proof_log_creator_id_fkey (
          full_name
        )
      `)
      .eq('campaign_id', campaign_id)
      .order('posted_at', { ascending: false })

    if (creator_id) {
      proofQuery = proofQuery.eq('creator_id', creator_id)
    }

    const { data: proofLog } = await proofQuery

    // Update creator data with proof info
    proofLog?.forEach(proof => {
      const creator = creatorMap.get(proof.creator_id)
      if (creator) {
        creator.live_posts_count++
        creator.proof_urls.push(proof.proof_url)
        creator.last_activity = proof.posted_at
        
        // Add engagement metrics
        if (proof.metrics) {
          const likes = proof.metrics.likes || 0
          const comments = proof.metrics.comments || 0
          const views = proof.metrics.views || 0
          creator.total_engagement += likes + comments + views
        }
      }
    })

    // Calculate totals
    const totalReach = analytics?.total_reach || 0
    const totalEngagement = Array.from(creatorMap.values())
      .reduce((sum, creator) => sum + creator.total_engagement, 0)

    // Build report
    const report: CampaignReport = {
      campaign_id,
      campaign_name: campaign.name,
      campaign_status: campaign.status,
      total_creators: creatorMap.size,
      total_uploads: uploadCounts.total,
      approved_uploads: uploadCounts.approved,
      rejected_uploads: uploadCounts.rejected,
      pending_uploads: uploadCounts.pending,
      live_posts: proofLog?.length || 0,
      total_reach: totalReach,
      total_engagement: totalEngagement,
      avg_engagement_rate: analytics?.avg_engagement_rate || 0,
      creators: Array.from(creatorMap.values()),
      proof_log: proofLog?.map(proof => ({
        creator_name: proof.profiles?.full_name || 'Unknown Creator',
        platform: proof.platform,
        post_type: proof.post_type,
        proof_url: proof.proof_url,
        posted_at: proof.posted_at,
        metrics: proof.metrics || {}
      })) || []
    }

    return new Response(
      JSON.stringify({
        success: true,
        report
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Get campaign report error:', error)
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
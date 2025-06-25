import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SubmitProofRequest {
  upload_id: string;
  proof_url: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  post_type: 'story' | 'post' | 'reel' | 'video';
  posted_at: string; // ISO timestamp
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    shares?: number;
    engagement_rate?: number;
  };
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

    const creator_id = user.user.id
    const requestData: SubmitProofRequest = await req.json()

    // Validate upload exists and belongs to creator
    const { data: upload, error: uploadError } = await supabase
      .from('uploads')
      .select('id, campaign_id, creator_id, status')
      .eq('id', requestData.upload_id)
      .eq('creator_id', creator_id)
      .single()

    if (uploadError || !upload) {
      throw new Error('Upload not found or access denied')
    }

    // Validate upload is approved
    if (upload.status !== 'approved') {
      throw new Error('Upload must be approved before submitting proof')
    }

    // Check if proof already exists for this upload
    const { data: existingProof } = await supabase
      .from('proof_log')
      .select('id')
      .eq('upload_id', requestData.upload_id)
      .single()

    if (existingProof) {
      throw new Error('Proof already exists for this upload')
    }

    // Validate proof URL format (basic validation)
    if (!requestData.proof_url.startsWith('http')) {
      throw new Error('Invalid proof URL format')
    }

    // Validate posted_at timestamp
    const postedAt = new Date(requestData.posted_at)
    if (isNaN(postedAt.getTime())) {
      throw new Error('Invalid posted_at timestamp')
    }

    // Create proof log entry
    const { data: proof, error: proofError } = await supabase
      .from('proof_log')
      .insert({
        upload_id: requestData.upload_id,
        campaign_id: upload.campaign_id,
        creator_id,
        proof_url: requestData.proof_url,
        platform: requestData.platform,
        post_type: requestData.post_type,
        posted_at: requestData.posted_at,
        detection_method: 'manual',
        metrics: requestData.metrics || {},
        is_live: true
      })
      .select()
      .single()

    if (proofError) {
      throw new Error('Failed to create proof record')
    }

    // Triggers will automatically:
    // 1. Notify brand via notification_queue
    // 2. Update campaign analytics

    return new Response(
      JSON.stringify({
        success: true,
        proof_id: proof.id,
        message: 'Proof submitted successfully. Brand has been notified that your campaign is live!'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Submit proof error:', error)
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
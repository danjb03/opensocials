import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SubmitProofRequest {
  upload_id: string;
  campaign_id: string;
  proof_url: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  post_type: 'story' | 'post' | 'reel' | 'video';
  posted_at: string;
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
    shares?: number;
  };
  notes?: string;
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
      .from('campaign_submissions')
      .select(`
        id,
        campaign_id,
        creator_id,
        status,
        projects_new:campaign_id (
          id,
          brand_id,
          name
        )
      `)
      .eq('id', requestData.upload_id)
      .eq('creator_id', creator_id)
      .single()

    if (uploadError || !upload) {
      throw new Error('Submission not found or you do not have permission to access it')
    }

    // Validate submission is in approved status
    if (upload.status !== 'approved') {
      throw new Error('Only approved submissions can have proof submitted')
    }

    // Create proof record
    const { data: proof, error: proofError } = await supabase
      .from('proof_log')
      .insert({
        upload_id: requestData.upload_id,
        campaign_id: requestData.campaign_id,
        creator_id,
        proof_url: requestData.proof_url,
        platform: requestData.platform,
        post_type: requestData.post_type,
        posted_at: requestData.posted_at,
        metrics: requestData.metrics || {},
        notes: requestData.notes,
        status: 'pending_verification'
      })
      .select()
      .single()

    if (proofError) {
      throw new Error('Failed to create proof record')
    }

    // Update submission status
    const { error: updateError } = await supabase
      .from('campaign_submissions')
      .update({
        status: 'posted',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestData.upload_id)

    if (updateError) {
      throw new Error('Failed to update submission status')
    }

    // Create notification for brand
    if (upload.projects_new?.brand_id) {
      const { error: brandNotificationError } = await supabase
        .from('notification_queue')
        .insert({
          user_id: upload.projects_new.brand_id,
          campaign_id: requestData.campaign_id,
          submission_id: requestData.upload_id,
          notification_type: 'content_posted',
          title: 'Content Posted',
          message: `A creator has posted content for your campaign: ${upload.projects_new.name}. Payment can now be processed.`,
          is_read: false,
          created_at: new Date().toISOString()
        })

      if (brandNotificationError) {
        console.error('Failed to create brand notification:', brandNotificationError)
      }
    }

    // Create notification for admins
    const { data: admins } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')

    if (admins && admins.length > 0) {
      const adminNotifications = admins.map(admin => ({
        user_id: admin.user_id,
        campaign_id: requestData.campaign_id,
        submission_id: requestData.upload_id,
        notification_type: 'payment_ready',
        title: 'Payment Ready',
        message: `Creator has posted content for campaign: ${upload.projects_new?.name}. Payment is ready to be processed.`,
        is_read: false,
        created_at: new Date().toISOString()
      }))

      const { error: adminNotificationError } = await supabase
        .from('notification_queue')
        .insert(adminNotifications)

      if (adminNotificationError) {
        console.error('Failed to create admin notifications:', adminNotificationError)
      }
    }

    // Trigger email notifications via process-notifications function
    await supabase.functions.invoke('process-notifications', {
      body: { check_new: true }
    }).catch(error => {
      console.error('Failed to trigger notification processing:', error)
    })
    
    return new Response(
      JSON.stringify({
        success: true,
        proof_id: proof.id,
        status: 'pending_verification',
        message: 'Proof submitted successfully. Your payment will be processed soon.'
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

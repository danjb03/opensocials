import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReviewContentRequest {
  upload_id: string;
  action: 'approve' | 'reject' | 'request_revision';
  comments?: string;
  feedback_data?: Record<string, any>;
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

    const reviewer_id = user.user.id
    const requestData: ReviewContentRequest = await req.json()

    // Validate upload exists and user is brand owner
    const { data: upload, error: uploadError } = await supabase
      .from('uploads')
      .select(`
        id,
        campaign_id,
        creator_id,
        status,
        projects_new!uploads_campaign_id_fkey (
          id,
          brand_id,
          name
        )
      `)
      .eq('id', requestData.upload_id)
      .single()

    if (uploadError || !upload) {
      throw new Error('Upload not found')
    }

    // Check if user is the brand owner of this campaign
    const isBrandOwner = upload.projects_new?.brand_id === reviewer_id

    if (!isBrandOwner) {
      // Check if user is admin (has admin role)
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', reviewer_id)
        .eq('role', 'admin')
        .single()

      if (!userRole) {
        throw new Error('Unauthorized - not campaign owner or admin')
      }
    }

    // Validate upload is in reviewable state
    if (!['pending_review', 'revision_requested'].includes(upload.status)) {
      throw new Error('Upload is not in a reviewable state')
    }

    // Create review record
    const { data: review, error: reviewError } = await supabase
      .from('upload_reviews')
      .insert({
        upload_id: requestData.upload_id,
        reviewer_id,
        action: requestData.action,
        comments: requestData.comments,
        feedback_data: requestData.feedback_data || {},
        reviewed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (reviewError) {
      throw new Error('Failed to create review record')
    }

    // Triggers will automatically:
    // 1. Update upload status
    // 2. Notify creator via notification_queue

    let message = ''
    switch (requestData.action) {
      case 'approve':
        message = 'Content approved successfully. Creator has been notified to post.'
        break
      case 'reject':
        message = 'Content rejected. Creator has been notified with feedback.'
        break
      case 'request_revision':
        message = 'Revision requested. Creator has been notified with feedback.'
        break
    }

    return new Response(
      JSON.stringify({
        success: true,
        review_id: review.id,
        action: requestData.action,
        message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Review content error:', error)
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
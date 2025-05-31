import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SubmitContentRequest {
  campaign_id: string;
  brief_id: string;
  file_url: string;
  file_name: string;
  file_type?: string;
  file_size?: number;
  thumbnail_url?: string;
  content_type: 'video' | 'image' | 'story' | 'post';
  platform: 'instagram' | 'tiktok' | 'youtube';
  title?: string;
  description?: string;
  tags?: string[];
  deliverable_specs: Array<{
    deliverable_type: string;
    deliverable_spec: Record<string, any>;
    is_primary: boolean;
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

    const creator_id = user.user.id
    const requestData: SubmitContentRequest = await req.json()

    // Validate creator is assigned to this campaign
    const { data: assignment, error: assignmentError } = await supabase
      .from('project_creators')
      .select('id')
      .eq('project_id', requestData.campaign_id)
      .eq('creator_id', creator_id)
      .single()

    if (assignmentError || !assignment) {
      throw new Error('Creator not assigned to this campaign')
    }

    // Validate brief exists and belongs to campaign
    const { data: brief, error: briefError } = await supabase
      .from('campaign_briefs')
      .select('id, campaign_id')
      .eq('id', requestData.brief_id)
      .eq('campaign_id', requestData.campaign_id)
      .single()

    if (briefError || !brief) {
      throw new Error('Invalid brief or campaign')
    }

    // Create upload record
    const { data: upload, error: uploadError } = await supabase
      .from('uploads')
      .insert({
        campaign_id: requestData.campaign_id,
        brief_id: requestData.brief_id,
        creator_id,
        file_url: requestData.file_url,
        file_name: requestData.file_name,
        file_type: requestData.file_type,
        file_size: requestData.file_size,
        thumbnail_url: requestData.thumbnail_url,
        content_type: requestData.content_type,
        platform: requestData.platform,
        title: requestData.title,
        description: requestData.description,
        tags: requestData.tags,
        status: 'pending_review'
      })
      .select()
      .single()

    if (uploadError) {
      throw new Error('Failed to create upload record')
    }

    // Create deliverable associations
    if (requestData.deliverable_specs && requestData.deliverable_specs.length > 0) {
      const deliverables = requestData.deliverable_specs.map(spec => ({
        upload_id: upload.id,
        deliverable_type: spec.deliverable_type,
        deliverable_spec: spec.deliverable_spec,
        is_primary: spec.is_primary
      }))

      const { error: deliverablesError } = await supabase
        .from('upload_deliverables')
        .insert(deliverables)

      if (deliverablesError) {
        console.error('Failed to create deliverable associations:', deliverablesError)
      }
    }

    // Trigger will automatically notify brand via notification_queue
    
    return new Response(
      JSON.stringify({
        success: true,
        upload_id: upload.id,
        status: 'pending_review',
        message: 'Content submitted successfully. Brand will review shortly.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Submit content error:', error)
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
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CampaignData {
  name: string
  objective?: string
  campaign_type: string
  description?: string
  content_requirements: any
  messaging_guidelines?: string
  total_budget: number
  deliverables: any
  start_date?: string
  end_date?: string
  selected_creators: Array<{
    creator_id: string
    individual_budget: number
    custom_requirements?: any
  }>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get brand profile
    const { data: brandProfile, error: brandError } = await supabaseClient
      .from('brand_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (brandError || !brandProfile) {
      return new Response(
        JSON.stringify({ error: 'Brand profile not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const campaignData: CampaignData = await req.json()

    // Validate required fields
    if (!campaignData.name || !campaignData.total_budget || !campaignData.selected_creators?.length) {
      return new Response(
        JSON.stringify({ error: 'Missing required campaign data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create the project
    const projectPayload = {
      brand_id: brandProfile.id,
      name: campaignData.name,
      objective: campaignData.objective,
      campaign_type: campaignData.campaign_type,
      description: campaignData.description,
      content_requirements: campaignData.content_requirements,
      platforms: campaignData.content_requirements?.platforms || [],
      messaging_guidelines: campaignData.messaging_guidelines,
      total_budget: campaignData.total_budget,
      deliverables: campaignData.deliverables,
      start_date: campaignData.start_date,
      end_date: campaignData.end_date,
      status: 'active',
      current_step: 5
    }

    const { data: project, error: projectError } = await supabaseClient
      .from('projects_new')
      .insert(projectPayload)
      .select()
      .single()

    if (projectError) {
      console.error('Project creation error:', projectError)
      return new Response(
        JSON.stringify({ error: 'Failed to create campaign' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create creator deals
    const creatorDeals = campaignData.selected_creators.map(creator => ({
      project_id: project.id,
      creator_id: creator.creator_id,
      gross_value: creator.individual_budget, // Will auto-calculate net_value via trigger
      individual_requirements: creator.custom_requirements || {},
      status: 'invited'
    }))

    const { error: dealsError } = await supabaseClient
      .from('creator_deals')
      .insert(creatorDeals)

    if (dealsError) {
      console.error('Creator deals creation error:', dealsError)
      // Try to clean up the project if deals creation failed
      await supabaseClient
        .from('projects_new')
        .delete()
        .eq('id', project.id)

      return new Response(
        JSON.stringify({ error: 'Failed to create creator deals' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // TODO: Send invitation emails to creators
    // This would call another edge function or email service
    
    // Get creator profiles for notifications
    const { data: creators } = await supabaseClient
      .from('creator_profiles')
      .select('id, user_id, name, email')
      .in('id', campaignData.selected_creators.map(c => c.creator_id))

    // Send notifications (simplified - in production, use proper email service)
    if (creators && creators.length > 0) {
      for (const creator of creators) {
        // Call send-invite-email function for each creator
        try {
          await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-invite-email`, {
            method: 'POST',
            headers: {
              'Authorization': req.headers.get('Authorization')!,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              creator_id: creator.id,
              project_id: project.id,
              campaign_name: campaignData.name,
              brand_name: brandProfile.name || 'Brand'
            })
          })
        } catch (error) {
          console.error('Failed to send invitation email:', error)
          // Don't fail the whole request if email fails
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        project_id: project.id,
        message: 'Campaign created successfully and invitations sent',
        creators_invited: creators?.length || 0
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Campaign creation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
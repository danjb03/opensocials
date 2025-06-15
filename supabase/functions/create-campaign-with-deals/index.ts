
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

    // Create the project with pending review status
    const projectPayload = {
      brand_id: brandProfile.id,
      name: campaignData.name,
      objective: campaignData.objective,
      campaign_type: campaignData.campaign_type,
      description: campaignData.description,
      content_requirements: campaignData.content_requirements,
      platforms: campaignData.content_requirements?.platforms || [],
      messaging_guidelines: campaignData.messaging_guidelines,
      budget: campaignData.total_budget, // Changed from total_budget to budget
      deliverables: campaignData.deliverables,
      start_date: campaignData.start_date,
      end_date: campaignData.end_date,
      status: 'pending_approval', // Set to pending approval
      review_status: 'pending_review', // Set to pending review
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

    // Create initial campaign review record
    const { error: reviewError } = await supabaseClient
      .from('campaign_reviews')
      .insert({
        project_id: project.id,
        ai_analysis: {},
        ai_issues: [],
        ai_recommendations: [],
        human_decision: 'pending'
      })

    if (reviewError) {
      console.error('Campaign review creation error:', reviewError)
      // Don't fail the whole request if review creation fails
    }

    // Create creator deals (these will be invisible to creators until approved)
    const creatorDeals = campaignData.selected_creators.map(creator => ({
      project_id: project.id,
      creator_id: creator.creator_id,
      deal_value: creator.individual_budget, // Use deal_value instead of gross_value
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

    // NOTE: Don't send invitation emails yet - only after admin approval
    // Get creator profiles for future reference
    const { data: creators } = await supabaseClient
      .from('creator_profiles')
      .select('id, user_id, first_name, last_name')
      .in('id', campaignData.selected_creators.map(c => c.creator_id))

    return new Response(
      JSON.stringify({ 
        project_id: project.id,
        message: 'Campaign created and submitted for review',
        creators_to_invite: creators?.length || 0,
        review_status: 'pending_review'
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

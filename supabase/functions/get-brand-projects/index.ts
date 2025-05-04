
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface CampaignRow {
  project_id: string;
  project_name: string;
  project_status: string;
  start_date: string | null;
  end_date: string | null;
  budget: number;
  currency: string;
  deal_id: string | null;
  deal_status: string | null;
  deal_value: number | null;
  creator_name: string | null;
  avatar_url: string | null;
  engagement_rate: string | null;
  primary_platform: string | null;
}

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get access token from Authorization header
    const token = authorization.replace('Bearer ', '')
    
    // Create supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )
    
    // Get user from token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get brand projects (basic data)
    const { data: projects, error: projectsError } = await supabaseClient
      .from('projects')
      .select('id, name, status, start_date, end_date, budget, currency')
      .eq('brand_id', user.id)
      .order('created_at', { ascending: false })
    
    if (projectsError) {
      console.error('Error fetching projects:', projectsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch projects' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get deals related to these projects
    // In a real implementation, you'd have a project_id in the deals table
    // For now, we'll just return the projects with dummy or no creator data
    const campaignData: CampaignRow[] = projects.map(project => ({
      project_id: project.id,
      project_name: project.name,
      project_status: project.status || 'draft',
      start_date: project.start_date,
      end_date: project.end_date,
      budget: project.budget || 0,
      currency: project.currency || 'USD',
      deal_id: null,
      deal_status: null,
      deal_value: null,
      creator_name: null,
      avatar_url: null,
      engagement_rate: null,
      primary_platform: null
    }))

    return new Response(
      JSON.stringify(campaignData),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { logSecurityEvent, extractClientInfo } from '../shared/security-utils.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is a creator using the new security function
    const { data: userRole } = await supabaseClient
      .rpc('get_current_user_role')

    if (!userRole || userRole !== 'creator') {
      return new Response(
        JSON.stringify({ showIntro: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if creator intro has been dismissed
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('creator_intro_dismissed')
      .eq('id', user.id)
      .single()

    const showIntro = !profile?.creator_intro_dismissed

    // Log security event
    const clientInfo = extractClientInfo(req)
    await logSecurityEvent(supabaseClient, {
      user_id: user.id,
      action: 'check_creator_intro',
      resource_type: 'creator_intro',
      ...clientInfo
    })

    return new Response(
      JSON.stringify({ showIntro }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in check-creator-intro:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

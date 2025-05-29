
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { checkRateLimit, logSecurityEvent, extractClientInfo } from '../shared/security-utils.ts'

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

    // Rate limiting - max 5 requests per minute per user
    const clientInfo = extractClientInfo(req)
    const rateLimitPassed = await checkRateLimit(supabaseClient, {
      identifier: user.id,
      action: 'dismiss_creator_intro',
      maxRequests: 5,
      windowMinutes: 1
    })

    if (!rateLimitPassed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update the creator_intro_dismissed flag
    const { error } = await supabaseClient
      .from('profiles')
      .update({ creator_intro_dismissed: true })
      .eq('id', user.id)

    if (error) {
      throw error
    }

    // Log security event
    await logSecurityEvent(supabaseClient, {
      user_id: user.id,
      action: 'dismiss_creator_intro',
      resource_type: 'creator_intro',
      resource_id: user.id,
      ...clientInfo
    })

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in dismiss-creator-intro:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

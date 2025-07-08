
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🔄 Starting scheduled social media refresh...')

    // Get all connected social accounts that need refreshing
    const { data: socialAccounts, error } = await supabaseClient
      .from('creators_social_accounts')
      .select('*')
      .or('last_run.is.null,last_run.lt.' + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      throw error
    }

    console.log(`📊 Found ${socialAccounts?.length || 0} accounts to refresh`)

    const results = []

    for (const account of socialAccounts || []) {
      try {
        // Trigger scraping for each account
        const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/trigger-social-scraping`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
          },
          body: JSON.stringify({
            user_id: account.creator_id,
            platform: account.platform,
            username: account.handle
          })
        })

        if (response.ok) {
          const result = await response.json()
          results.push({
            account_id: account.id,
            success: true,
            metrics: result.metrics
          })
          console.log(`✅ Refreshed ${account.platform}:${account.handle}`)
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

      } catch (error) {
        console.error(`❌ Failed to refresh ${account.platform}:${account.handle}:`, error)
        results.push({
          account_id: account.id,
          success: false,
          error: error.message
        })

        // Update account with error status
        await supabaseClient
          .from('creators_social_accounts')
          .update({
            status: 'failed',
            error_message: error.message
          })
          .eq('id', account.id)
      }

      // Small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    console.log(`🏁 Scheduled refresh completed. Processed: ${results.length}`)

    return new Response(JSON.stringify({
      success: true,
      total_processed: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Scheduled refresh error:', error)
    
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Notification service functions
async function notifyUser(supabase: any, user_id: string, type: string, metadata: Record<string, any>) {
  console.log(`Notifying user ${user_id} of type ${type}:`, metadata)
  
  // This is where you'd integrate with:
  // - Email service (Resend, SendGrid, etc.)
  // - Push notifications (Firebase, Pusher, etc.)
  // - In-app notifications
  // - SMS (Twilio, etc.)
  
  // For now, we'll just log and mark as sent
  // In production, you'd implement actual notification delivery
  
  try {
    // Example: Send email notification
    if (type === 'upload_submitted' || type === 'upload_reviewed' || type === 'campaign_live') {
      await sendEmailNotification(user_id, type, metadata)
    }
    
    // Example: Send push notification
    await sendPushNotification(user_id, type, metadata)
    
    return { success: true }
  } catch (error) {
    console.error('Failed to send notification:', error)
    return { success: false, error: error.message }
  }
}

async function notifyBrand(supabase: any, brand_id: string, type: string, metadata: Record<string, any>) {
  return await notifyUser(supabase, brand_id, type, metadata)
}

async function sendEmailNotification(user_id: string, type: string, metadata: Record<string, any>) {
  // Integration with email service
  // This would call your email service API (Resend, SendGrid, etc.)
  console.log(`EMAIL: Sending ${type} notification to user ${user_id}`)
  
  // Example implementation:
  // const response = await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     from: 'noreply@opensocials.com',
  //     to: user_email,
  //     subject: getEmailSubject(type),
  //     html: getEmailTemplate(type, metadata)
  //   })
  // })
}

async function sendPushNotification(user_id: string, type: string, metadata: Record<string, any>) {
  // Integration with push notification service
  console.log(`PUSH: Sending ${type} notification to user ${user_id}`)
  
  // Example implementation:
  // const response = await fetch('https://fcm.googleapis.com/fcm/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `key=${Deno.env.get('FCM_SERVER_KEY')}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     to: user_device_token,
  //     notification: {
  //       title: getPushTitle(type),
  //       body: getPushMessage(type, metadata)
  //     }
  //   })
  // })
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

    // This function can be called in two ways:
    // 1. Via cron job to process pending notifications
    // 2. Via direct API call to send immediate notification

    const url = new URL(req.url)
    const mode = url.searchParams.get('mode') || 'process_queue'

    if (mode === 'process_queue') {
      // Process pending notifications from queue
      const { data: pendingNotifications, error } = await supabase
        .from('notification_queue')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .order('priority', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(50) // Process in batches

      if (error) {
        throw new Error('Failed to fetch pending notifications')
      }

      const results = []
      
      for (const notification of pendingNotifications || []) {
        try {
          const result = await notifyUser(
            supabase,
            notification.user_id,
            notification.notification_type,
            notification.metadata || {}
          )

          // Update notification status
          await supabase
            .from('notification_queue')
            .update({
              status: result.success ? 'sent' : 'failed',
              sent_at: result.success ? new Date().toISOString() : null
            })
            .eq('id', notification.id)

          results.push({
            id: notification.id,
            success: result.success,
            error: result.error
          })

        } catch (error) {
          console.error(`Failed to process notification ${notification.id}:`, error)
          
          await supabase
            .from('notification_queue')
            .update({ status: 'failed' })
            .eq('id', notification.id)

          results.push({
            id: notification.id,
            success: false,
            error: error.message
          })
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          processed: results.length,
          results
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )

    } else if (mode === 'send_immediate') {
      // Send immediate notification (not queued)
      const { user_id, type, metadata } = await req.json()

      if (!user_id || !type) {
        throw new Error('user_id and type are required')
      }

      const result = await notifyUser(supabase, user_id, type, metadata || {})

      return new Response(
        JSON.stringify({
          success: result.success,
          error: result.error
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: result.success ? 200 : 400 
        }
      )

    } else {
      throw new Error('Invalid mode parameter')
    }

  } catch (error) {
    console.error('Process notifications error:', error)
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

// You would set up a cron job to call this function periodically:
// curl -X POST "https://your-project.supabase.co/functions/v1/process-notifications?mode=process_queue"
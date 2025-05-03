
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle preflight OPTIONS request
function handleOptions(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Allow': 'GET, OPTIONS',
      },
    });
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
      console.error(`OAuth error: ${error} - ${errorDescription}`);
      return new Response(
        JSON.stringify({ 
          error, 
          error_description: errorDescription,
          message: 'OAuth authentication failed'
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return new Response(
        JSON.stringify({ 
          error: 'invalid_request', 
          message: 'Missing required OAuth parameters'
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Parse state parameter (contains userId and platform)
    let stateObj;
    try {
      stateObj = JSON.parse(atob(state));
    } catch (e) {
      return new Response(
        JSON.stringify({ 
          error: 'invalid_state', 
          message: 'Invalid state parameter'
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const { userId, platform, timestamp } = stateObj;

    // Validate state data
    if (!userId || !platform) {
      return new Response(
        JSON.stringify({ 
          error: 'invalid_state', 
          message: 'State parameter missing required data'
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Check if state is expired (30 minutes)
    const now = Date.now();
    if (now - timestamp > 30 * 60 * 1000) {
      return new Response(
        JSON.stringify({ 
          error: 'expired_state', 
          message: 'OAuth flow has expired, please try again'
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Exchange authorization code for access token
    // The actual token exchange would be platform-specific
    // Here we are simulating a successful connection
    
    // In a real implementation, we would:
    // 1. Make HTTP request to the platform's token endpoint
    // 2. Get access_token, refresh_token, etc.
    // 3. Store these in our database
    
    // For now, we'll simulate storing a successful connection
    const { error: insertError } = await supabase
      .from('social_accounts')
      .insert({
        profile_id: userId,
        platform,
        access_token: 'simulated-token',
        account_id: 'simulated-account-id',
      });

    if (insertError) {
      console.error('Error inserting social account:', insertError);
      throw insertError;
    }
    
    // Redirect back to the creator dashboard with success parameter
    const redirectUrl = new URL(`${url.protocol}//${url.host.replace('functions.opensocials.net', 'opensocials.net')}/creator`);
    redirectUrl.searchParams.append('connected', platform);
    
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl.toString(),
      }
    });
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    
    return new Response(
      JSON.stringify({ error: 'server_error', message: 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  }
});

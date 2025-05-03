
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
    if (!code) {
      return new Response(
        JSON.stringify({ 
          error: 'invalid_request', 
          message: 'Missing required OAuth code parameter'
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

    // Parse state parameter if available (contains userId and platform)
    let userId = null;
    let platform = 'instagram'; // Default to Instagram if state is missing
    
    if (state) {
      try {
        const stateObj = JSON.parse(atob(state));
        userId = stateObj.userId;
        platform = stateObj.platform || platform;
      } catch (e) {
        console.warn('Invalid state parameter, falling back to defaults:', e);
      }
    }

    // If no userId is provided via state, attempt to get from env
    if (!userId) {
      userId = Deno.env.get("PROFILE_ID");
      
      if (!userId) {
        return new Response(
          JSON.stringify({ 
            error: 'missing_user_id', 
            message: 'No user ID provided in state or environment'
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
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Different OAuth flows based on platform
    if (platform === 'instagram') {
      const IG_CLIENT_ID = Deno.env.get("INSTAGRAM_CLIENT_ID");
      const IG_CLIENT_SECRET = Deno.env.get("INSTAGRAM_CLIENT_SECRET");
      const REDIRECT_URI = "https://functions.opensocials.net/functions/v1/auth-callback";
      
      if (!IG_CLIENT_ID || !IG_CLIENT_SECRET) {
        throw new Error('Missing Instagram API credentials');
      }

      // Exchange code for access token
      const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${IG_CLIENT_ID}&client_secret=${IG_CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`);
      const tokenData = await tokenRes.json();
      
      if (!tokenData.access_token) {
        console.error('Failed to get Instagram access token:', tokenData);
        return new Response(
          JSON.stringify({ 
            error: 'token_exchange_failed', 
            message: 'Failed to exchange code for access token'
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
      
      // Get user profile information
      const userRes = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${tokenData.access_token}`);
      const userData = await userRes.json();
      
      if (!userData.id) {
        console.error('Failed to get Instagram user data:', userData);
        return new Response(
          JSON.stringify({ 
            error: 'user_data_failed', 
            message: 'Failed to retrieve Instagram user data'
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
      
      // Store the connection in our database
      const { error: insertError } = await supabase
        .from('social_accounts')
        .insert({
          profile_id: userId,
          platform: 'instagram',
          access_token: tokenData.access_token,
          account_id: userData.id,
          metadata: {
            username: userData.username,
            account_type: userData.account_type,
            media_count: userData.media_count,
          }
        });

      if (insertError) {
        console.error('Error inserting social account:', insertError);
        throw insertError;
      }

      // Also update the profile to mark Instagram as connected
      await supabase
        .from('profiles')
        .update({ instagram_connected: true })
        .eq('id', userId);

    } else {
      // For other platforms - can add similar implementation for other social platforms
      console.log(`Handling OAuth for platform: ${platform}`);
      
      // Store a simulated successful connection for other platforms
      const { error: insertError } = await supabase
        .from('social_accounts')
        .insert({
          profile_id: userId,
          platform,
          access_token: 'platform-token',
          account_id: 'platform-account-id',
        });

      if (insertError) {
        console.error('Error inserting social account:', insertError);
        throw insertError;
      }
      
      // Update the profile to mark the platform as connected
      const updateData = {};
      updateData[`${platform}_connected`] = true;
      
      await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
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

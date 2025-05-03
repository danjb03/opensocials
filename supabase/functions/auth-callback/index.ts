
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

    console.log("OAuth callback received with:", { 
      code: code ? "present" : "missing", 
      state: state ? "present" : "missing", 
      error: error || "none",
      errorDescription: errorDescription || "none"
    });

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
        console.log("Parsed state:", { userId, platform });
      } catch (e) {
        console.warn('Invalid state parameter, falling back to defaults:', e);
      }
    }

    // If no userId is provided via state, attempt to get from env
    if (!userId) {
      userId = Deno.env.get("PROFILE_ID");
      console.log("Using PROFILE_ID from environment:", userId);
      
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

    // Initialize Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }

    // Create client with service role key for admin-level access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Different OAuth flows based on platform
    if (platform === 'instagram') {
      const IG_CLIENT_ID = Deno.env.get("INSTAGRAM_CLIENT_ID");
      const IG_CLIENT_SECRET = Deno.env.get("INSTAGRAM_CLIENT_SECRET");
      const REDIRECT_URI = "https://functions.opensocials.net/functions/v1/auth-callback";
      
      if (!IG_CLIENT_ID || !IG_CLIENT_SECRET) {
        console.error("Missing Instagram credentials:", { 
          IG_CLIENT_ID: IG_CLIENT_ID ? "present" : "missing", 
          IG_CLIENT_SECRET: IG_CLIENT_SECRET ? "present" : "missing" 
        });
        throw new Error('Missing Instagram API credentials');
      }

      console.log("Exchanging code for access token with params:", { 
        IG_CLIENT_ID: IG_CLIENT_ID.substring(0, 5) + "...", 
        REDIRECT_URI 
      });

      // Exchange code for access token
      const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${IG_CLIENT_ID}&client_secret=${IG_CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`);
      const tokenData = await tokenRes.json();
      
      console.log("Access Token Response:", JSON.stringify(tokenData));
      
      if (!tokenData.access_token) {
        console.error('Failed to get Instagram access token:', tokenData);
        return new Response(
          JSON.stringify({ 
            error: 'token_exchange_failed', 
            message: 'Failed to exchange code for access token',
            details: tokenData
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
      
      // Get user profile information - CRITICAL: This request should return account_id in the response
      const userRes = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${tokenData.access_token}`);
      const userData = await userRes.json();
      
      console.log("Instagram User Data:", JSON.stringify(userData));
      
      if (!userData.id) {
        console.error('Failed to get Instagram user data or missing id:', userData);
        return new Response(
          JSON.stringify({ 
            error: 'user_data_failed', 
            message: 'Failed to retrieve Instagram user id',
            details: userData
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

      // Explicitly extract account_id from userData to ensure it's not null
      const account_id = userData.id;
      const username = userData.username;
      
      // Validate account_id before database insert
      if (!account_id) {
        console.error('Instagram account_id is missing from API response');
        return new Response(
          JSON.stringify({ 
            error: 'missing_account_id', 
            message: 'Instagram account ID is missing from API response',
            details: userData
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
      
      // Store the connection in our database - CRITICAL: account_id must be provided
      console.log("Inserting social account with data:", {
        profile_id: userId,
        platform: 'instagram',
        account_id: account_id, // Explicit assignment
        username: username,
        metadata: userData
      });

      const { error: insertError, data: insertData } = await supabase
        .from('social_accounts')
        .insert({
          profile_id: userId,
          platform: 'instagram',
          access_token: tokenData.access_token,
          account_id: account_id, // Explicit assignment of account_id
          username: username,
          metadata: {
            username: username,
            account_type: userData.account_type,
            media_count: userData.media_count,
          }
        });

      if (insertError) {
        console.error('Error inserting social account:', insertError);
        throw insertError;
      }

      console.log("Successfully inserted Instagram account:", insertData);
      console.log("Now updating profile to mark Instagram as connected");

      // Also update the profile to mark Instagram as connected
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ instagram_connected: true })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating profile:', updateError);
      } else {
        console.log("Successfully updated profile, Instagram connection marked as true");
      }

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
          account_id: 'platform-account-id', // Always provide a value for account_id
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
    
    console.log("Redirecting to:", redirectUrl.toString());
    
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
      JSON.stringify({ error: 'server_error', message: 'Internal server error', details: error.message }),
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

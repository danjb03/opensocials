
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://pcnrnciwgdrukzciwexi.supabase.co";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseServiceKey) {
      throw new Error('Missing Supabase service role key');
    }

    // Create client with service role key for admin-level access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Different OAuth flows based on platform
    if (platform === 'instagram') {
      const IG_CLIENT_ID = Deno.env.get("INSTAGRAM_CLIENT_ID") || "1022001640046804";
      const IG_CLIENT_SECRET = Deno.env.get("INSTAGRAM_CLIENT_SECRET");
      const REDIRECT_URI = "https://functions.opensocials.net/functions/v1/auth-callback";
      
      if (!IG_CLIENT_SECRET) {
        console.error("Missing Instagram client secret");
        throw new Error('Missing Instagram API credentials');
      }

      console.log("Exchanging code for access token with params:", { 
        IG_CLIENT_ID: IG_CLIENT_ID.substring(0, 5) + "...", 
        REDIRECT_URI 
      });

      // STEP 1: Exchange code for access token
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
      
      // STEP 2: Get user pages - this is the first step per instructions
      console.log("Fetching user's Facebook pages");
      const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${tokenData.access_token}`);
      const pagesData = await pagesRes.json();
      
      console.log("Facebook Pages Response:", JSON.stringify(pagesData));
      
      if (!pagesData.data || pagesData.data.length === 0) {
        console.error('No Facebook pages found or error fetching pages:', pagesData);
        return new Response(
          JSON.stringify({ 
            error: 'no_facebook_pages', 
            message: 'No Facebook pages found. User must have at least one Facebook page connected to Instagram',
            details: pagesData
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
      
      // Use the first page (in a real app, you might let users choose which page)
      const pageId = pagesData.data[0].id;
      const pageName = pagesData.data[0].name;
      
      // STEP 3: Get Instagram Business Account ID from page
      console.log(`Getting Instagram business account for page: ${pageId}`);
      const igBusinessRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${tokenData.access_token}`);
      const igBusinessData = await igBusinessRes.json();
      
      console.log("Instagram Business Account Response:", JSON.stringify(igBusinessData));
      
      if (!igBusinessData.instagram_business_account || !igBusinessData.instagram_business_account.id) {
        console.error('No Instagram business account connected to this page:', igBusinessData);
        return new Response(
          JSON.stringify({ 
            error: 'no_instagram_business_account', 
            message: 'No Instagram business account connected to Facebook page',
            details: igBusinessData
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
      
      // Extract the Instagram business account ID - this is what we need
      const instagramBusinessAccountId = igBusinessData.instagram_business_account.id;
      
      // Now get additional Instagram account details like username
      console.log(`Fetching Instagram account details for ID: ${instagramBusinessAccountId}`);
      const igAccountRes = await fetch(`https://graph.facebook.com/v19.0/${instagramBusinessAccountId}?fields=name,username,profile_picture_url&access_token=${tokenData.access_token}`);
      const igAccountData = await igAccountRes.json();
      
      console.log("Instagram Account Details:", JSON.stringify(igAccountData));
      
      if (!igAccountData.username) {
        console.error('Failed to get Instagram username:', igAccountData);
        // We still have the ID which is critical, so we can proceed
      }
      
      // Get additional Instagram analytics data as requested
      console.log(`Fetching Instagram analytics for ID: ${instagramBusinessAccountId}`);
      const analyticsRes = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${tokenData.access_token}`);
      const analyticsData = await analyticsRes.json();
      
      console.log("Instagram Analytics Data:", JSON.stringify(analyticsData));
      
      // Get media insights for more complete analytics
      const mediaRes = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp,like_count,comments_count&access_token=${tokenData.access_token}`);
      const mediaData = await mediaRes.json();
      
      console.log("Instagram Media Data:", JSON.stringify(mediaData));
      
      // CRITICAL: Use the instagram_business_account.id as account_id for database storage
      const account_id = instagramBusinessAccountId;
      const username = igAccountData.username || `instagram_${instagramBusinessAccountId}`;
      
      // Double validation to ensure we have the business account ID
      if (!account_id) {
        console.error('Instagram business account ID is missing');
        return new Response(
          JSON.stringify({ 
            error: 'missing_business_account_id', 
            message: 'Instagram business account ID was not found',
            details: { igBusinessData, igAccountData }
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
        account_id: account_id, // This is the instagram_business_account.id
        username: username
      });

      const { error: insertError, data: insertData } = await supabase
        .from('social_accounts')
        .insert({
          profile_id: userId,
          platform: 'instagram',
          access_token: tokenData.access_token,
          account_id: account_id, // Instagram business account ID
          username: username,
          metadata: {
            page_id: pageId,
            page_name: pageName,
            username: username,
            profile_picture_url: igAccountData.profile_picture_url,
            business_account_id: instagramBusinessAccountId,
            account_type: analyticsData.account_type,
            media_count: analyticsData.media_count,
            media_insights: mediaData.data || []
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

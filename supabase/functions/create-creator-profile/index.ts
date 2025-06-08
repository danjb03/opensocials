
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify authentication
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication failed', details: authError?.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if user is a super_admin or the user themselves
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      return new Response(
        JSON.stringify({ error: 'Error fetching user profile', details: profileError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const requestData = await req.json().catch(() => ({}));
    
    // Determine target user ID - for super_admin it could be different from auth user
    const targetUserId = profile?.role === 'super_admin' && requestData.target_user_id 
      ? requestData.target_user_id 
      : user.id;

    // Map frontend fields to database schema
    const profileData = {
      user_id: targetUserId,
      display_name: requestData.fullName || requestData.name || null,
      bio: requestData.bio || null,
      primary_platform: Array.isArray(requestData.contentTypes) && requestData.contentTypes.length > 0 
        ? requestData.contentTypes.join(', ') 
        : requestData.platform || null,
      content_type: Array.isArray(requestData.contentTypes) 
        ? requestData.contentTypes.join(', ') 
        : requestData.contentTypes || null,
      follower_count: requestData.followers ? parseInt(requestData.followers) : 
                     requestData.followerCount ? parseInt(requestData.followerCount) : null,
      engagement_rate: requestData.avgViews ? parseFloat(requestData.avgViews) : 
                      requestData.engagementRate ? parseFloat(requestData.engagementRate) : null,
      audience_location: requestData.location || 'Global',
      industries: requestData.industry ? [requestData.industry] : 
                 Array.isArray(requestData.industries) ? requestData.industries : [],
      creator_type: requestData.creatorType || null,
      social_links: {
        instagram: requestData.instagramHandle || null,
        tiktok: requestData.tiktokHandle || null,
        youtube: requestData.youtubeHandle || null
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Creating creator profile with data:', profileData);

    // Create or update the creator profile
    const { data: createdProfile, error: createError } = await supabase
      .from('creator_profiles')
      .upsert(profileData, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (createError) {
      console.error('Create profile error:', createError);
      return new Response(
        JSON.stringify({ error: 'Failed to create creator profile', details: createError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: createdProfile,
        message: 'Creator profile created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

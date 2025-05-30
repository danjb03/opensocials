
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  sanitizeString,
  validateSocialHandle,
} from "../shared/security-utils.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};



// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (userId: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const userRequests = requestCounts.get(userId);

  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userRequests.count >= maxRequests) {
    return false;
  }

  userRequests.count++;
  return true;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Authenticate user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: corsHeaders
      });
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Validate and sanitize input data
    const errors: string[] = [];
    const sanitizedData: any = {};

    // Required fields
    if (body.firstName) {
      sanitizedData.first_name = sanitizeString(body.firstName, 50);
      if (!sanitizedData.first_name) errors.push('First name is required');
    }

    if (body.lastName) {
      sanitizedData.last_name = sanitizeString(body.lastName, 50);
      if (!sanitizedData.last_name) errors.push('Last name is required');
    }

    // Optional fields with validation
    if (body.bio) {
      sanitizedData.bio = sanitizeString(body.bio, 500);
    }

    if (body.primaryPlatform) {
      const validPlatforms = ['instagram', 'tiktok', 'youtube', 'linkedin', 'twitter'];
      if (validPlatforms.includes(body.primaryPlatform)) {
        sanitizedData.primary_platform = body.primaryPlatform;
      } else {
        errors.push('Invalid platform');
      }
    }

    if (body.contentType) {
      sanitizedData.content_type = sanitizeString(body.contentType, 100);
    }

    if (body.audienceType) {
      sanitizedData.audience_type = sanitizeString(body.audienceType, 100);
    }

    if (body.creatorType) {
      sanitizedData.creator_type = sanitizeString(body.creatorType, 100);
    }

    // Validate social handles
    if (body.instagramHandle && !validateSocialHandle(body.instagramHandle)) {
      errors.push('Invalid Instagram handle');
    }

    if (body.tiktokHandle && !validateSocialHandle(body.tiktokHandle)) {
      errors.push('Invalid TikTok handle');
    }

    if (body.youtubeHandle && !validateSocialHandle(body.youtubeHandle)) {
      errors.push('Invalid YouTube handle');
    }

    // Validate arrays
    if (body.industries && Array.isArray(body.industries)) {
      sanitizedData.industries = body.industries
        .filter(industry => typeof industry === 'string')
        .map(industry => sanitizeString(industry, 50))
        .slice(0, 10); // Limit to 10 industries
    }

    // Validate audience location
    if (body.audienceLocation && typeof body.audienceLocation === 'object') {
      const audienceLocation: any = {};
      
      if (body.audienceLocation.primary) {
        audienceLocation.primary = sanitizeString(body.audienceLocation.primary, 100);
      }
      
      if (Array.isArray(body.audienceLocation.secondary)) {
        audienceLocation.secondary = body.audienceLocation.secondary
          .filter(loc => typeof loc === 'string')
          .map(loc => sanitizeString(loc, 100))
          .slice(0, 5);
      }

      if (Array.isArray(body.audienceLocation.countries)) {
        audienceLocation.countries = body.audienceLocation.countries
          .filter(country => country && typeof country.name === 'string' && typeof country.percentage === 'number')
          .map(country => ({
            name: sanitizeString(country.name, 100),
            percentage: Math.max(0, Math.min(100, country.percentage))
          }))
          .slice(0, 10);
      }

      sanitizedData.audience_location = audienceLocation;
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ error: 'Validation failed', details: errors }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Update profile
    sanitizedData.updated_at = new Date().toISOString();
    sanitizedData.is_profile_complete = body.isProfileComplete || false;

    const { error: updateError } = await supabase
      .from('profiles')
      .update(sanitizedData)
      .eq('id', user.id);

    if (updateError) {
      console.error('Database update error:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update profile' }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // Log security event
    await supabase
      .from('security_audit_log')
      .insert({
        user_id: user.id,
        action: 'profile_update',
        resource_type: 'creator_profile',
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      })
      .catch(err => console.error('Audit log error:', err));

    return new Response(JSON.stringify({ success: true }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders
    });
  }
});

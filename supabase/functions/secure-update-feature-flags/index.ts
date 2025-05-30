
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  sanitizeString,
  checkRateLimit,
  logSecurityEvent,
  extractClientInfo,
} from '../shared/security-utils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Extract client info for security logging
    const { ip_address, user_agent } = extractClientInfo(req);

    // Authenticate user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      await logSecurityEvent(supabase, {
        action: 'unauthorized_feature_flag_access',
        resource_type: 'feature_flags',
        ip_address,
        user_agent
      });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      await logSecurityEvent(supabase, {
        action: 'invalid_token_feature_flag_access',
        resource_type: 'feature_flags',
        ip_address,
        user_agent
      });
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    // Check if user is admin or super_admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile || !['admin', 'super_admin'].includes(profile.role)) {
      await logSecurityEvent(supabase, {
        user_id: user.id,
        action: 'unauthorized_feature_flag_modification',
        resource_type: 'feature_flags',
        ip_address,
        user_agent
      });
      return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
        status: 403,
        headers: corsHeaders
      });
    }

    // Rate limiting
    const rateLimitPassed = await checkRateLimit(supabase, {
      identifier: user.id,
      action: 'feature_flag_update',
      maxRequests: 20,
      windowMinutes: 10
    });

    if (!rateLimitPassed) {
      await logSecurityEvent(supabase, {
        user_id: user.id,
        action: 'rate_limit_exceeded',
        resource_type: 'feature_flags',
        ip_address,
        user_agent
      });
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

    const { key, value, description } = body;

    // Validate inputs
    if (!key || typeof key !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid key' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (typeof value !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Value must be boolean' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Sanitize inputs
    const sanitizedKey = sanitizeString(key, 100);
    const sanitizedDescription = description ? sanitizeString(description, 500) : null;

    if (!sanitizedKey) {
      return new Response(JSON.stringify({ error: 'Invalid key after sanitization' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Update feature flag
    const { error: updateError } = await supabase
      .from('r4_flags')
      .upsert({
        key: sanitizedKey,
        value: value,
        description: sanitizedDescription,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (updateError) {
      console.error('Feature flag update error:', updateError);
      await logSecurityEvent(supabase, {
        user_id: user.id,
        action: 'feature_flag_update_failed',
        resource_type: 'feature_flags',
        resource_id: sanitizedKey,
        ip_address,
        user_agent
      });
      return new Response(JSON.stringify({ error: 'Failed to update feature flag' }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // Log successful update
    await logSecurityEvent(supabase, {
      user_id: user.id,
      action: 'feature_flag_updated',
      resource_type: 'feature_flags',
      resource_id: sanitizedKey,
      ip_address,
      user_agent
    });

    return new Response(JSON.stringify({ 
      success: true,
      key: sanitizedKey,
      value: value
    }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Feature flag update error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: corsHeaders
    });
  }
});

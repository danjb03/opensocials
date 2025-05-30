import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { logSecurityEvent } from '../shared/security-utils.ts';

interface SocialProfile {
  id: string;
  platform: string;
  username: string;
  creator_id: string;
}

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data: profiles, error } = await supabase
    .from('social_profiles')
    .select('id, platform, username, creator_id')
    .eq('status', 'connected');

  if (error) {
    console.error('Failed to fetch social profiles:', error);
    await logSecurityEvent(supabase, {
      action: 'refresh_insightiq_fetch_error',
      resource_type: 'cron_job',
      resource_id: 'refresh-insightiq'
    });
    return new Response(JSON.stringify({ success: false, error: 'fetch_failed' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }

  const results: any[] = [];

  for (const profile of profiles || []) {
    try {
      const apiUrl = `https://api.insightiq.com/v1/creators/${profile.platform}/${profile.username}`;

      const resp = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('INSIGHTIQ_API_KEY')}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Supabase-Edge-Function/1.0'
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!resp.ok) {
        throw new Error(`${resp.status} ${await resp.text()}`);
      }

      const data = await resp.json();
      const follower_count = data.follower_count ?? data.followers ?? 0;
      const engagement_rate = data.engagement_rate ?? 0;

      const { error: upErr } = await supabase
        .from('social_profiles')
        .update({
          follower_count,
          engagement_rate,
          last_synced: new Date().toISOString(),
          status: 'connected',
          error_message: null
        })
        .eq('id', profile.id);

      if (upErr) {
        throw upErr;
      }

      results.push({ id: profile.id, status: 'success' });
    } catch (err) {
      console.error(`Failed to refresh ${profile.id}:`, err);
      await supabase
        .from('social_profiles')
        .update({ status: 'error', error_message: (err as Error).message })
        .eq('id', profile.id);

      results.push({ id: profile.id, status: 'error', error: (err as Error).message });
    }
  }

  await logSecurityEvent(supabase, {
    action: 'refresh_insightiq_run',
    resource_type: 'cron_job',
    resource_id: `processed_${results.length}`
  });

  return new Response(
    JSON.stringify({ success: true, processed: results.length, results }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});


import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const requestBody = await req.json();
    console.log('Received request body:', requestBody);

    const { user_id, platform, account_id, workplatform_id } = requestBody;

    if (!user_id || !platform || !account_id || !workplatform_id) {
      console.error('Missing required fields:', { user_id, platform, account_id, workplatform_id });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, platform, account_id, workplatform_id' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Storing connected account:', { user_id, platform, account_id, workplatform_id });

    const { data, error } = await supabase.from("connected_accounts").upsert([
      {
        user_id,
        platform,
        account_id,
        workplatform_id,
        connected_at: new Date().toISOString()
      },
    ], {
      onConflict: 'user_id,platform'
    });

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: `Database error: ${error.message}` }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Successfully stored connected account:', data);

    return new Response(
      JSON.stringify({ success: true, data }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: `Unexpected error: ${error.message}` }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

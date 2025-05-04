// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { decode } from "https://deno.land/x/djwt@v2.7/mod.ts";

const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_URL = "https://pcnrnciwgdrukzciwexi.supabase.co";
const IG_CLIENT_SECRET = Deno.env.get("INSTAGRAM_APP_SECRET")!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function parseSignedRequest(signedRequest: string) {
  const [encodedSig, payload] = signedRequest.split(".");
  const data = JSON.parse(atob(payload));
  return data.user_id;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const body = await req.formData();
    const signedRequest = body.get("signed_request")?.toString();

    if (!signedRequest) {
      return new Response(
        JSON.stringify({ error: "Missing signed_request" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const userId = parseSignedRequest(signedRequest);
    console.log(`Meta deauthorization received for user_id: ${userId}`);

    // Delete the social account from the database
    const deleteRes = await fetch(`${SUPABASE_URL}/rest/v1/social_accounts?account_id=eq.${userId}`, {
      method: "DELETE",
      headers: {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      }
    });

    if (!deleteRes.ok) {
      const err = await deleteRes.text();
      console.error(`Error deleting social account: ${err}`);
      
      // Log the deauthorization attempt even if deletion failed
      await fetch(`${SUPABASE_URL}/rest/v1/deauth_logs`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          platform: "meta",
          account_id: userId,
          status: "failed",
          error_message: err
        })
      });
      
      // Still return 200 to Meta so they don't keep retrying
      return new Response(
        JSON.stringify({ status: "acknowledged", message: "Logged but failed to delete account" }), 
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Log successful deauthorization
    await fetch(`${SUPABASE_URL}/rest/v1/deauth_logs`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        platform: "meta",
        account_id: userId,
        status: "success"
      })
    });

    return new Response(
      JSON.stringify({ status: "success", message: "Deauthorized successfully" }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    console.error(`Meta deauth error: ${err.message}`);
    
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

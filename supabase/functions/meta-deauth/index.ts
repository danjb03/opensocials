// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { decode } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { corsHeaders, deleteSocialAccount, logDeauth, SUPABASE_SERVICE_ROLE_KEY } from "../shared/meta-utils.ts";

const IG_CLIENT_SECRET = Deno.env.get("INSTAGRAM_APP_SECRET")!;

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
    const deleteRes = await deleteSocialAccount(userId);

    if (!deleteRes.ok) {
      const err = await deleteRes.text();
      console.error(`Error deleting social account: ${err}`);
      
      // Log the deauthorization attempt even if deletion failed
      await logDeauth("meta", userId, "failed", err);
      
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
    await logDeauth("meta", userId, "success");

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

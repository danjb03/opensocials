// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { deleteSocialAccount } from "../shared/meta-delete-helper.ts";

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

    const { success, error } = await deleteSocialAccount(userId, "account_id");

    if (!success) {
      console.error(`Error deleting social account: ${error}`);
      // Still return 200 to Meta so they don't keep retrying
      return new Response(
        JSON.stringify({ status: "acknowledged", message: "Logged but failed to delete account" }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

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


import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { deleteSocialAccount } from "../shared/meta-delete-helper.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { id, field = 'account_id' } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Missing id parameter" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Manual deletion request for ${field}: ${id}`);

    const { success, error } = await deleteSocialAccount(id, field);

    if (!success) {
      return new Response(
        JSON.stringify({ error: `Failed to delete account: ${error}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Account deleted successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    console.error(`Meta delete error: ${err.message}`);
    
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

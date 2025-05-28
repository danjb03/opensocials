
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

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
    const { user_id, user_name } = await req.json();
    
    if (!user_id) {
      console.error('Missing user_id');
      return new Response(
        JSON.stringify({ error: 'user_id is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Use the Basic auth token from the documentation
    const basicAuth = 'MDJlMTNlNjItNGNiMC00MDZmLWJhNTMtMTUwMGM3NDMzNDBlOjk5OWIzMzJkLTVlOTYtNDFiOS05Y2JlLWQ0OWZlNDkxN2ZmOA==';
    
    console.log('Creating/ensuring Phyllo user exists for:', user_id);
    
    // Step 1: Create or ensure user exists in Phyllo
    const createUserResponse = await fetch('https://api.staging.getphyllo.com/v1/users', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: user_name || 'User',
        external_id: user_id
      })
    });

    let phylloUserId;
    
    if (createUserResponse.ok) {
      const userData = await createUserResponse.json();
      phylloUserId = userData.id;
      console.log('Phyllo user created/found:', phylloUserId);
    } else {
      const errorText = await createUserResponse.text();
      console.log('User creation response:', createUserResponse.status, errorText);
      
      // If user already exists, we can still proceed to token generation
      if (createUserResponse.status === 409 || createUserResponse.status === 400) {
        // User might already exist, use the external_id as reference
        phylloUserId = user_id;
        console.log('User likely exists, proceeding with token generation');
      } else {
        throw new Error(`Failed to create user: ${errorText}`);
      }
    }

    console.log('Generating SDK token for user:', phylloUserId);
    
    // Step 2: Generate SDK token
    const tokenResponse = await fetch('https://api.staging.getphyllo.com/v1/sdk-tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: phylloUserId,
        products: [
          "IDENTITY",
          "IDENTITY.AUDIENCE", 
          "ENGAGEMENT",
          "ENGAGEMENT.AUDIENCE",
          "INCOME",
          "ACTIVITY"
        ]
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token generation failed:', tokenResponse.status, errorText);
      throw new Error(`Failed to generate token: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('Successfully generated Phyllo token');

    return new Response(
      JSON.stringify({ 
        success: true, 
        token: tokenData.token,
        user_id: phylloUserId
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generatePhylloToken:', error);
    return new Response(
      JSON.stringify({ 
        error: `Failed to generate Phyllo token: ${error.message}` 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

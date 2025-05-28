
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
      console.log('Phyllo user created successfully:', phylloUserId);
    } else {
      const errorText = await createUserResponse.text();
      console.log('User creation response:', createUserResponse.status, errorText);
      
      // If user already exists, we need to look up the existing user
      if (createUserResponse.status === 409 || createUserResponse.status === 400) {
        console.log('User already exists, looking up existing user by external_id:', user_id);
        
        // Look up the existing user by external_id
        const getUserResponse = await fetch(`https://api.staging.getphyllo.com/v1/users?external_id=${user_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (getUserResponse.ok) {
          const getUserData = await getUserResponse.json();
          console.log('User lookup response:', JSON.stringify(getUserData, null, 2));
          
          // Extract the Phyllo user ID from the response
          if (getUserData.data && getUserData.data.length > 0) {
            phylloUserId = getUserData.data[0].id;
            console.log('Found existing Phyllo user ID:', phylloUserId);
          } else {
            console.error('No user found in lookup response');
            throw new Error('User exists but could not be found in lookup');
          }
        } else {
          const lookupErrorText = await getUserResponse.text();
          console.error('Failed to lookup existing user:', getUserResponse.status, lookupErrorText);
          throw new Error(`Failed to lookup existing user: ${lookupErrorText}`);
        }
      } else {
        throw new Error(`Failed to create user: ${errorText}`);
      }
    }

    if (!phylloUserId) {
      throw new Error('Could not determine Phyllo user ID');
    }

    console.log('Generating SDK token for Phyllo user ID:', phylloUserId);
    
    // Step 2: Generate SDK token using the correct Phyllo user ID
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
    console.log('Raw token response from Phyllo:', JSON.stringify(tokenData, null, 2));

    // Extract the token - check multiple possible property names
    const token = tokenData.token || tokenData.sdk_token || tokenData.access_token || tokenData.data?.token;
    
    if (!token) {
      console.error('No token found in response. Available properties:', Object.keys(tokenData));
      throw new Error(`No token found in Phyllo response. Response structure: ${JSON.stringify(tokenData)}`);
    }

    console.log('Successfully extracted Phyllo token');

    return new Response(
      JSON.stringify({ 
        success: true, 
        token: token,
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

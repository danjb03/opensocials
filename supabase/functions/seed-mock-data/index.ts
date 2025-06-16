
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Mock brand profiles
    const mockBrands = [
      {
        user_id: '11111111-1111-1111-1111-111111111111',
        company_name: 'Tech Innovators Inc',
        logo_url: null,
        website_url: 'https://techinnovators.com',
        industry: 'Technology',
        budget_range: '$10,000 - $50,000',
        brand_bio: 'Leading technology company focused on AI and machine learning solutions.',
        brand_goal: 'Increase brand awareness among tech professionals',
        campaign_focus: ['Tech Reviews', 'Product Demos']
      },
      {
        user_id: '22222222-2222-2222-2222-222222222222',
        company_name: 'Fashion Forward',
        logo_url: null,
        website_url: 'https://fashionforward.com',
        industry: 'Fashion & Beauty',
        budget_range: '$5,000 - $25,000',
        brand_bio: 'Sustainable fashion brand creating trendy, eco-friendly clothing.',
        brand_goal: 'Promote sustainable fashion choices',
        campaign_focus: ['Fashion Hauls', 'Styling Tips']
      }
    ];

    // Mock creator profiles
    const mockCreators = [
      {
        user_id: '33333333-3333-3333-3333-333333333333',
        name: 'Sarah Tech',
        email: 'sarah@example.com'
      },
      {
        user_id: '44444444-4444-4444-4444-444444444444',
        name: 'Mike Fashion',
        email: 'mike@example.com'
      }
    ];

    // Insert mock data
    const { error: brandError } = await supabaseClient
      .from('brand_profiles')
      .upsert(mockBrands);

    if (brandError) {
      console.error('Error inserting brand profiles:', brandError);
      throw brandError;
    }

    const { error: creatorError } = await supabaseClient
      .from('creator_profiles')
      .upsert(mockCreators);

    if (creatorError) {
      console.error('Error inserting creator profiles:', creatorError);
      throw creatorError;
    }

    return new Response(
      JSON.stringify({ 
        message: 'Mock data seeded successfully',
        brands: mockBrands.length,
        creators: mockCreators.length
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error seeding mock data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});


// Follow this setup guide to integrate the Deno SDK: https://deno.com/blog/supabase-functions-announce
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.37.0";

// Define types
type Creator = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  follower_count: string;
  engagement_rate: string;
  primary_platform: string;
};

type Brand = {
  id: string;
  email: string;
  company_name: string;
  industry: string;
  budget_range: string;
};

type Deal = {
  id: string;
  brand_id: string;
  creator_id: string;
  title: string;
  description: string;
  value: number;
  status: string;
  created_at: string;
};

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

// Random data generators
const generateRandomPlatform = () => {
  const platforms = ["instagram", "tiktok", "youtube", "twitter", "linkedin"];
  return platforms[Math.floor(Math.random() * platforms.length)];
};

const generateRandomFollowerCount = () => {
  const counts = ["1K-10K", "10K-50K", "50K-100K", "100K-500K", "500K-1M", "1M+"];
  return counts[Math.floor(Math.random() * counts.length)];
};

const generateRandomEngagementRate = () => {
  const rates = ["1-2%", "2-3%", "3-5%", "5-7%", "7-10%", "10%+"];
  return rates[Math.floor(Math.random() * rates.length)];
};

const generateRandomBudgetRange = () => {
  const budgets = ["$1K-$5K", "$5K-$10K", "$10K-$25K", "$25K-$50K", "$50K+"];
  return budgets[Math.floor(Math.random() * budgets.length)];
};

const generateRandomIndustry = () => {
  const industries = ["Fashion", "Beauty", "Tech", "Food & Beverage", "Health & Fitness", "Travel", "Gaming", "Finance"];
  return industries[Math.floor(Math.random() * industries.length)];
};

const generateRandomDealStatus = () => {
  const statuses = ["pending", "accepted", "rejected", "completed"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const generateRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomDate = (startDate: Date, endDate: Date) => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime).toISOString();
};

const generateRandomTitle = (creatorName: string, brandName: string) => {
  const campaignTypes = [
    "Product Review",
    "Brand Promotion",
    "Sponsored Content",
    "Product Launch",
    "Brand Awareness"
  ];
  const randomType = campaignTypes[Math.floor(Math.random() * campaignTypes.length)];
  return `${randomType}: ${creatorName} x ${brandName}`;
};

const generateRandomDescription = (title: string) => {
  const descriptions = [
    `Collaboration for ${title} featuring product highlights and audience engagement.`,
    `Partnership to showcase brand values through creator's authentic voice.`,
    `Content creation emphasizing product benefits for targeted demographic.`,
    `Promotional campaign leveraging creator's audience for brand exposure.`,
    `Strategic content series to boost brand visibility and credibility.`
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Validate method
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables for Supabase client");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create mock creators
    const creators: Creator[] = [];
    for (let i = 1; i <= 10; i++) {
      const id = crypto.randomUUID();
      const firstName = `Creator${i}`;
      const lastName = `Test`;
      const email = `creator${i}_${Date.now()}@mockdata.com`;
      
      // Create auth user for creator
      const { error: authError } = await supabase.auth.admin.createUser({
        email,
        password: "password123",
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          role: "creator"
        }
      });

      if (authError) {
        console.error(`Error creating creator auth user ${i}:`, authError);
        continue;
      }

      // Create profile for creator
      const creator: Creator = {
        id,
        email,
        first_name: firstName,
        last_name: lastName,
        follower_count: generateRandomFollowerCount(),
        engagement_rate: generateRandomEngagementRate(),
        primary_platform: generateRandomPlatform()
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id,
          email,
          first_name: firstName,
          last_name: lastName,
          follower_count: creator.follower_count,
          engagement_rate: creator.engagement_rate,
          primary_platform: creator.primary_platform,
          role: "creator",
          status: "approved"
        });

      if (profileError) {
        console.error(`Error creating creator profile ${i}:`, profileError);
        continue;
      }

      // Add user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: id,
          role: "creator",
          status: "approved"
        });

      if (roleError) {
        console.error(`Error creating creator role ${i}:`, roleError);
      }

      creators.push(creator);
    }

    // Create mock brands
    const brands: Brand[] = [];
    for (let i = 1; i <= 5; i++) {
      const id = crypto.randomUUID();
      const companyName = `Brand${i} Inc.`;
      const email = `brand${i}_${Date.now()}@mockdata.com`;

      // Create auth user for brand
      const { error: authError } = await supabase.auth.admin.createUser({
        email,
        password: "password123",
        email_confirm: true,
        user_metadata: {
          company_name: companyName,
          role: "brand"
        }
      });

      if (authError) {
        console.error(`Error creating brand auth user ${i}:`, authError);
        continue;
      }

      // Create profile for brand
      const brand: Brand = {
        id,
        email,
        company_name: companyName,
        industry: generateRandomIndustry(),
        budget_range: generateRandomBudgetRange()
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id,
          email,
          company_name: companyName,
          industry: brand.industry,
          budget_range: brand.budget_range,
          role: "brand",
          status: "approved"
        });

      if (profileError) {
        console.error(`Error creating brand profile ${i}:`, profileError);
        continue;
      }

      // Add user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: id,
          role: "brand",
          status: "approved"
        });

      if (roleError) {
        console.error(`Error creating brand role ${i}:`, roleError);
      }

      brands.push(brand);
    }

    // Create mock deals between creators and brands
    const deals: Deal[] = [];
    for (let i = 1; i <= 20; i++) {
      // Get random creator and brand
      const creator = creators[Math.floor(Math.random() * creators.length)];
      const brand = brands[Math.floor(Math.random() * brands.length)];

      if (!creator || !brand) continue;

      const dealTitle = generateRandomTitle(`${creator.first_name} ${creator.last_name}`, brand.company_name);
      
      const deal: Deal = {
        id: crypto.randomUUID(),
        brand_id: brand.id,
        creator_id: creator.id,
        title: dealTitle,
        description: generateRandomDescription(dealTitle),
        value: generateRandomValue(1000, 20000),
        status: generateRandomDealStatus(),
        created_at: generateRandomDate(new Date(2023, 0, 1), new Date())
      };

      const { error } = await supabase
        .from("deals")
        .insert({
          brand_id: deal.brand_id,
          creator_id: deal.creator_id,
          title: deal.title,
          description: deal.description,
          value: deal.value,
          status: deal.status,
          created_at: deal.created_at
        });

      if (error) {
        console.error(`Error creating deal ${i}:`, error);
        continue;
      }

      deals.push(deal);
    }

    // Return success response with counts
    return new Response(
      JSON.stringify({
        success: true,
        created: {
          creators: creators.length,
          brands: brands.length,
          deals: deals.length
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    console.error("Error in seed-mock-data function:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "An unknown error occurred"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

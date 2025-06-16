
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { time_frame, selected_year, selected_month } = await req.json();

    let dateFormat = '';
    let groupBy = '';
    let whereClause = '';

    // Set up date filters
    const startDate = new Date(selected_year, selected_month - 1, 1);
    const endDate = new Date(selected_year, selected_month, 1);

    if (time_frame === 'monthly') {
      // Group by month for the past 12 months
      dateFormat = "to_char(earned_at, 'Mon YYYY')";
      groupBy = "date_trunc('month', earned_at)";
      const pastYear = new Date(selected_year - 1, selected_month - 1, 1);
      whereClause = `earned_at >= '${pastYear.toISOString()}' AND earned_at < '${endDate.toISOString()}'`;
    } else if (time_frame === 'weekly') {
      // Group by week for the selected month
      dateFormat = "'Week ' || extract(week from earned_at)::text";
      groupBy = "date_trunc('week', earned_at)";
      whereClause = `earned_at >= '${startDate.toISOString()}' AND earned_at < '${endDate.toISOString()}'`;
    } else {
      // Group by day for the selected month
      dateFormat = "to_char(earned_at, 'Mon DD')";
      groupBy = "date_trunc('day', earned_at)";
      whereClause = `earned_at >= '${startDate.toISOString()}' AND earned_at < '${endDate.toISOString()}'`;
    }

    const query = `
      SELECT 
        ${dateFormat} as period,
        SUM(amount) as revenue,
        SUM(amount * 0.25) as profit,
        COUNT(*) as transactions,
        ${groupBy} as date_group
      FROM deal_earnings 
      WHERE ${whereClause}
      GROUP BY ${groupBy}, ${dateFormat}
      ORDER BY date_group ASC
    `;

    const { data, error } = await supabase.rpc('execute_sql', { query });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify(data || []),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});


import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CampaignData {
  name: string;
  description: string;
  campaign_type: string;
  budget: number;
  content_requirements: any;
  brand: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { campaignId, campaignData }: { campaignId: string; campaignData: CampaignData } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get R4 rules for validation
    const { data: rules } = await supabase
      .from('r4_rules')
      .select('*')
      .eq('enabled', true);

    // Prepare prompt for AI analysis
    const analysisPrompt = `
You are an AI campaign compliance reviewer. Analyze this marketing campaign proposal and check for any issues or violations.

Campaign Details:
- Name: ${campaignData.name}
- Type: ${campaignData.campaign_type}
- Budget: $${campaignData.budget}
- Description: ${campaignData.description || 'No description provided'}
- Brand: ${campaignData.brand?.company_name || 'Unknown'} (Industry: ${campaignData.brand?.industry || 'Unknown'})
- Content Requirements: ${JSON.stringify(campaignData.content_requirements)}

Active Platform Rules:
${rules?.map(rule => `- ${rule.rule_name}: ${rule.rule_description}`).join('\n') || 'No active rules'}

Please analyze this campaign for:
1. Compliance with platform rules
2. Budget appropriateness
3. Content requirements clarity
4. Brand safety considerations
5. Legal/regulatory compliance
6. Target audience appropriateness

Provide your response in this exact JSON format:
{
  "decision": "approved|rejected|flagged|needs_review",
  "confidence_score": 0.85,
  "issues": [
    {"type": "compliance", "severity": "high|medium|low", "description": "Issue description"}
  ],
  "recommendations": [
    {"type": "improvement", "description": "Recommendation description"}
  ],
  "summary": "Brief summary of the analysis"
}
`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional campaign compliance reviewer. Always respond with valid JSON in the exact format requested.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices[0].message.content;

    let analysisResult;
    try {
      analysisResult = JSON.parse(aiContent);
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      analysisResult = {
        decision: 'needs_review',
        confidence_score: 0.5,
        issues: [{ type: 'system', severity: 'medium', description: 'AI analysis format error' }],
        recommendations: [{ type: 'system', description: 'Manual review required due to AI parsing error' }],
        summary: 'AI analysis completed but required manual review due to formatting issues'
      };
    }

    // Store the review in the database
    const { data: review, error: reviewError } = await supabase
      .from('campaign_reviews')
      .insert({
        project_id: campaignId,
        ai_analysis: analysisResult,
        ai_score: analysisResult.confidence_score,
        ai_issues: analysisResult.issues || [],
        ai_recommendations: analysisResult.recommendations || [],
        ai_decision: analysisResult.decision,
        human_decision: 'pending',
      })
      .select()
      .single();

    if (reviewError) {
      throw reviewError;
    }

    // Update project status
    await supabase
      .from('projects_new')
      .update({ review_status: 'under_review' })
      .eq('id', campaignId);

    // Log any rule violations found
    if (analysisResult.issues?.length > 0) {
      const violations = analysisResult.issues.map((issue: any) => ({
        campaign_review_id: review.id,
        rule_name: `AI_${issue.type}`,
        violation_type: issue.type,
        severity: issue.severity,
        description: issue.description,
      }));

      await supabase
        .from('campaign_rule_violations')
        .insert(violations);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      reviewId: review.id,
      analysis: analysisResult 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-campaign-review function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'AI campaign review failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

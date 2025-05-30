import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: rules, error } = await supabase
    .from('r4_rules')
    .select('*')
    .eq('enabled', true)
    .order('priority', { ascending: true })

  if (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch rules', detail: error }), { status: 500 })
  }

  const results = []

  for (const rule of rules ?? []) {
    try {
      // Insert custom logic eval here later
      const dummyTargetId = crypto.randomUUID()

      await supabase.from('r4_enforcement_logs').insert({
        rule_id: rule.id,
        target_type: 'test',
        target_id: dummyTargetId,
        context: { eval: 'pass-through' },
        action_taken: rule.rule_action
      })

      results.push({ rule_id: rule.id, status: 'executed', target_id: dummyTargetId })
    } catch (err) {
      results.push({ rule_id: rule.id, status: 'failed', error: (err as Error).message })
    }
  }

  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { 'Content-Type': 'application/json' }
  })
})

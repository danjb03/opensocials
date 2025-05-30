-- Enable RLS and create policies for r4 tables

-- r4_rules table
alter table if exists public.r4_rules enable row level security;

create policy if not exists "Allow read for admins or service role" on public.r4_rules
  for select
  using (auth.role() = 'service_role' or public.is_admin_user());

create policy if not exists "Allow write for admins or service role" on public.r4_rules
  for all
  using (auth.role() = 'service_role' or public.is_admin_user())
  with check (auth.role() = 'service_role' or public.is_admin_user());

-- r4_enforcement_logs table
alter table if exists public.r4_enforcement_logs enable row level security;

create policy if not exists "Allow insert for service role" on public.r4_enforcement_logs
  for insert
  with check (auth.role() = 'service_role');

create policy if not exists "Allow admin or service role read" on public.r4_enforcement_logs
  for select
  using (auth.role() = 'service_role' or public.is_admin_user());


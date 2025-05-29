-- Create connected_accounts table
create table if not exists public.connected_accounts (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.profiles(id) on delete cascade,
  platform text not null,
  external_user_id text,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  connected_at timestamptz default now()
);

create index if not exists connected_accounts_platform_idx on public.connected_accounts(platform);
create index if not exists connected_accounts_creator_platform_idx on public.connected_accounts(creator_id, platform);

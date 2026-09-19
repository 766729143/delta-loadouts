-- 三角洲行动改枪码收藏 —— 数据库初始化
-- 在 Supabase Dashboard → SQL Editor 中执行本文件全部内容

create table if not exists public.loadouts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  code        text not null,
  weapon      text not null,
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists loadouts_user_created_idx
  on public.loadouts (user_id, created_at desc);

alter table public.loadouts enable row level security;

drop policy if exists "own rows - select" on public.loadouts;
drop policy if exists "own rows - insert" on public.loadouts;
drop policy if exists "own rows - update" on public.loadouts;
drop policy if exists "own rows - delete" on public.loadouts;

create policy "own rows - select" on public.loadouts
  for select using (auth.uid() = user_id);

create policy "own rows - insert" on public.loadouts
  for insert with check (auth.uid() = user_id);

create policy "own rows - update" on public.loadouts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own rows - delete" on public.loadouts
  for delete using (auth.uid() = user_id);

-- updated_at 自动维护
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists loadouts_touch_updated_at on public.loadouts;
create trigger loadouts_touch_updated_at
  before update on public.loadouts
  for each row execute function public.touch_updated_at();

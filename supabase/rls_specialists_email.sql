-- Specialists can only access their own profile row, based on email match.
-- Assumes:
-- - Supabase Auth is enabled
-- - RLS is enabled on public.specialists
-- - The specialists.email column stores the authenticated user's email (lowercased recommended)

alter table public.specialists enable row level security;

-- Read own row
drop policy if exists "specialists_select_own_email" on public.specialists;
create policy "specialists_select_own_email"
on public.specialists
for select
to authenticated
using (lower(email) = lower((auth.jwt() ->> 'email')));

-- Create own row (first-time profile creation)
drop policy if exists "specialists_insert_own_email" on public.specialists;
create policy "specialists_insert_own_email"
on public.specialists
for insert
to authenticated
with check (lower(email) = lower((auth.jwt() ->> 'email')));

-- Update own row
drop policy if exists "specialists_update_own_email" on public.specialists;
create policy "specialists_update_own_email"
on public.specialists
for update
to authenticated
using (lower(email) = lower((auth.jwt() ->> 'email')))
with check (lower(email) = lower((auth.jwt() ->> 'email')));

-- (Optional) Delete own row — generally not needed for "edit my profile" flows
-- drop policy if exists "specialists_delete_own_email" on public.specialists;
-- create policy "specialists_delete_own_email"
-- on public.specialists
-- for delete
-- to authenticated
-- using (lower(email) = lower((auth.jwt() ->> 'email')));



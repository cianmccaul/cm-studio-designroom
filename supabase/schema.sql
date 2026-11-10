-- CM Studio DesignRoom: the database (Supabase project "CM Studio DesignRoom", eu-west-1).
--
-- The public site can only SEND a brief and upload mood-board images.
-- Only the signed-in admin can read, update or delete briefs.
--
-- Already applied to the live project. To set up a fresh project, run this
-- in Supabase → SQL Editor, then add the admin login under
-- Authentication → Users and turn off public sign-ups.

-- Briefs sent from the showroom
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_name text not null check (char_length(client_name) between 1 and 200),
  client_email text not null check (char_length(client_email) between 3 and 320),
  selections jsonb not null default '{}'::jsonb,
  questionnaire jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new', 'inprogress', 'quoted', 'complete')),
  priority text not null default 'normal' check (priority in ('normal', 'urgent', 'vip')),
  notes text not null default ''
);
create index submissions_created_at_idx on public.submissions (created_at desc);

-- Who counts as the admin
create or replace function public.is_designroom_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'email', '') in ('cian.mccaul@outlook.com');
$$;

-- Anyone may send a brief (as a new, normal-priority brief with no notes);
-- only the admin may read or change briefs
alter table public.submissions enable row level security;

create policy "Anyone can submit a brief"
  on public.submissions for insert
  to anon, authenticated
  with check (status = 'new' and priority = 'normal' and notes = '');

create policy "Admin reads briefs"
  on public.submissions for select
  to authenticated
  using ((select public.is_designroom_admin()));

create policy "Admin updates briefs"
  on public.submissions for update
  to authenticated
  using ((select public.is_designroom_admin()))
  with check ((select public.is_designroom_admin()));

create policy "Admin deletes briefs"
  on public.submissions for delete
  to authenticated
  using ((select public.is_designroom_admin()));

-- Mood boards: images up to 5 MB; each viewable by its own link, the bucket can't be listed
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('moodboards', 'moodboards', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

create policy "Anyone can upload a mood board image"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'moodboards');

create policy "Admin manages mood board images"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'moodboards' and (select public.is_designroom_admin()))
  with check (bucket_id = 'moodboards' and (select public.is_designroom_admin()));

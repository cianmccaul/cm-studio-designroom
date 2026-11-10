-- DesignRoom: who can do what in the database.
--
-- The public site can only SEND a brief (and upload mood-board images).
-- Only the signed-in admin can read, update or delete briefs.
--
-- Run this once in Supabase → SQL Editor. It's safe to run again.
-- Before running it, create the admin login in Authentication → Users
-- (Add user → email + password), and turn off public sign-ups under
-- Authentication → Sign In / Providers → "Allow new users to sign up".

-- 1. Who counts as the admin. Change the email if you sign in with another one.
create or replace function public.is_designroom_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') in ('cian.mccaul@outlook.com');
$$;

-- 2. Briefs: anyone may submit one; only the admin may see or change them.
alter table public.submissions enable row level security;

do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'submissions' loop
    execute format('drop policy %I on public.submissions', p.policyname);
  end loop;
end $$;

create policy "Anyone can submit a brief"
  on public.submissions for insert
  to anon, authenticated
  with check (
    coalesce(status, 'new') = 'new'
    and coalesce(priority, 'normal') = 'normal'
    and coalesce(notes, '') = ''
  );

create policy "Admin reads briefs"
  on public.submissions for select
  to authenticated
  using (public.is_designroom_admin());

create policy "Admin updates briefs"
  on public.submissions for update
  to authenticated
  using (public.is_designroom_admin())
  with check (public.is_designroom_admin());

create policy "Admin deletes briefs"
  on public.submissions for delete
  to authenticated
  using (public.is_designroom_admin());

-- 3. Mood boards: images only, up to 5 MB. Anyone may upload; nobody can list
--    the bucket. Each image stays viewable by its own link (the link goes in
--    the email and the admin page), and file names are random.
update storage.buckets
   set public = true,
       file_size_limit = 5242880,
       allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
 where id = 'moodboards';

do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
     where schemaname = 'storage' and tablename = 'objects'
       and (coalesce(qual, '') || coalesce(with_check, '')) like '%moodboards%'
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;

create policy "Anyone can upload a mood board image"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'moodboards');

create policy "Admin manages mood board images"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'moodboards' and public.is_designroom_admin())
  with check (bucket_id = 'moodboards' and public.is_designroom_admin());

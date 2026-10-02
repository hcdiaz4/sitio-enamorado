insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'galeria-pareja',
  'galeria-pareja',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Gallery members can view couple photos" on storage.objects;
drop policy if exists "Anyone can view gallery photos" on storage.objects;
create policy "Anyone can view gallery photos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'galeria-pareja');

drop policy if exists "Gallery members can upload couple photos" on storage.objects;
create policy "Gallery members can upload couple photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'galeria-pareja');

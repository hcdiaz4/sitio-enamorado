create table if not exists public.notas_compartidas (
  id uuid primary key default gen_random_uuid(),
  autor text not null default 'Anónimo'
    check (char_length(btrim(autor)) between 1 and 40),
  contenido text not null
    check (char_length(btrim(contenido)) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.notas_compartidas enable row level security;

create table if not exists public.notas_autores_permitidos (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.notas_autores_permitidos enable row level security;

drop policy if exists "Authors can view their own permission" on public.notas_autores_permitidos;
create policy "Authors can view their own permission"
on public.notas_autores_permitidos for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Anyone can read shared notes" on public.notas_compartidas;
create policy "Anyone can read shared notes"
on public.notas_compartidas for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can publish shared notes" on public.notas_compartidas;
drop policy if exists "Only invited authors can publish shared notes" on public.notas_compartidas;
create policy "Only invited authors can publish shared notes"
on public.notas_compartidas for insert
to authenticated
with check (
  char_length(btrim(autor)) between 1 and 40
  and char_length(btrim(contenido)) between 1 and 500
  and exists (
    select 1
    from public.notas_autores_permitidos
    where user_id = auth.uid()
  )
);

revoke all on public.notas_compartidas from public, anon, authenticated;
grant select on public.notas_compartidas to anon, authenticated;
grant insert (autor, contenido) on public.notas_compartidas to authenticated;

revoke all on public.notas_autores_permitidos from public, anon, authenticated;
grant select on public.notas_autores_permitidos to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.notas_compartidas;
exception
  when duplicate_object then null;
end
$$;

-- After inviting both accounts in Authentication → Users, replace these two
-- addresses and run this insert to allow exactly those accounts to publish:
--
-- insert into public.notas_autores_permitidos (user_id)
-- select id
-- from auth.users
-- where lower(email) in (lower('TU_CORREO'), lower('CORREO_DE_ELLA'))
-- on conflict (user_id) do nothing;

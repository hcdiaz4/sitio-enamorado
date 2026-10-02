create table if not exists public.notas_compartidas (
  id uuid primary key default gen_random_uuid(),
  autor text not null default 'Anónimo'
    check (char_length(btrim(autor)) between 1 and 40),
  contenido text not null
    check (char_length(btrim(contenido)) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.notas_compartidas enable row level security;

drop policy if exists "Anyone can read shared notes" on public.notas_compartidas;
create policy "Anyone can read shared notes"
on public.notas_compartidas for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can publish shared notes" on public.notas_compartidas;
create policy "Anyone can publish shared notes"
on public.notas_compartidas for insert
to anon, authenticated
with check (
  char_length(btrim(autor)) between 1 and 40
  and char_length(btrim(contenido)) between 1 and 500
);

revoke all on public.notas_compartidas from anon, authenticated;
grant select on public.notas_compartidas to anon, authenticated;
grant insert (autor, contenido) on public.notas_compartidas to anon, authenticated;

do $$
begin
  alter publication supabase_realtime add table public.notas_compartidas;
exception
  when duplicate_object then null;
end
$$;

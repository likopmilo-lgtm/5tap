-- Phase 2: self-service digital card profiles.
-- Run once in the Supabase SQL editor before enabling profile activation.

begin;

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.card_profiles (
  id uuid primary key default gen_random_uuid(),
  activation_code_hash text unique not null,
  public_slug text unique not null check (public_slug ~ '^[a-z0-9][a-z0-9-]{2,63}$'),
  display_name text not null default '',
  job_title text not null default '',
  company text not null default '',
  bio text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  website text not null default '',
  address text not null default '',
  instagram text not null default '',
  linkedin text not null default '',
  facebook text not null default '',
  custom_label text not null default '',
  custom_url text not null default '',
  destination_mode text not null default 'profile' check (destination_mode in ('profile','whatsapp','instagram','custom')),
  is_active boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.card_profiles add column if not exists published_at timestamptz;

alter table public.card_profiles enable row level security;
revoke all on public.card_profiles from anon, authenticated;

create or replace function public.get_card_profile(p_activation_code text)
returns jsonb
language sql stable security definer set search_path = ''
as $$
  select to_jsonb(p) - 'activation_code_hash'
  from public.card_profiles p
  where p.activation_code_hash = encode(extensions.digest(upper(trim(p_activation_code)), 'sha256'), 'hex')
    and p.is_active;
$$;

create or replace function public.update_card_profile(p_activation_code text, p_profile jsonb)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  updated public.card_profiles;
  requested_mode text := coalesce(p_profile->>'destinationMode','profile');
  requested_name text := trim(coalesce(p_profile->>'displayName',''));
begin
  if length(requested_name) < 2 or length(requested_name) > 100 then
    raise exception 'Nom invalide';
  end if;
  if requested_mode not in ('profile','whatsapp','instagram','custom') then
    raise exception 'Destination invalide';
  end if;

  update public.card_profiles p set
    display_name = left(requested_name,100),
    job_title = left(trim(coalesce(p_profile->>'jobTitle','')),120),
    company = left(trim(coalesce(p_profile->>'company','')),120),
    bio = left(trim(coalesce(p_profile->>'bio','')),500),
    phone = left(trim(coalesce(p_profile->>'phone','')),30),
    whatsapp = left(trim(coalesce(p_profile->>'whatsapp','')),30),
    email = left(trim(coalesce(p_profile->>'email','')),180),
    website = left(trim(coalesce(p_profile->>'website','')),500),
    address = left(trim(coalesce(p_profile->>'address','')),300),
    instagram = left(trim(coalesce(p_profile->>'instagram','')),200),
    linkedin = left(trim(coalesce(p_profile->>'linkedin','')),500),
    facebook = left(trim(coalesce(p_profile->>'facebook','')),500),
    custom_label = left(trim(coalesce(p_profile->>'customLabel','')),80),
    custom_url = left(trim(coalesce(p_profile->>'customUrl','')),500),
    destination_mode = requested_mode,
    published_at = coalesce(p.published_at, now()),
    updated_at = now()
  where p.activation_code_hash = encode(extensions.digest(upper(trim(p_activation_code)), 'sha256'), 'hex')
    and p.is_active
  returning p.* into updated;

  if updated.id is null then return null; end if;
  return to_jsonb(updated) - 'activation_code_hash';
end;
$$;

create or replace function public.get_public_card_profile(p_slug text)
returns jsonb
language sql stable security definer set search_path = ''
as $$
  select to_jsonb(p) - 'activation_code_hash' - 'created_at' - 'updated_at'
  from public.card_profiles p
  where p.public_slug = lower(trim(p_slug))
    and p.is_active
    and p.published_at is not null
    and length(trim(p.display_name)) >= 2;
$$;

revoke all on function public.get_card_profile(text) from public;
revoke all on function public.update_card_profile(text,jsonb) from public;
revoke all on function public.get_public_card_profile(text) from public;
grant execute on function public.get_card_profile(text) to anon, authenticated;
grant execute on function public.update_card_profile(text,jsonb) to anon, authenticated;
grant execute on function public.get_public_card_profile(text) to anon, authenticated;

-- Admin example (replace both values before running):
-- insert into public.card_profiles(activation_code_hash,public_slug)
-- values (encode(extensions.digest('5TAP-ABCD-1234','sha256'),'hex'),'prenom-nom');

commit;

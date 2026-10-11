-- Profile photos, flexible social links, maps and reliable profile edits.
begin;

alter table public.card_profiles add column if not exists avatar_data_url text not null default '';
alter table public.card_profiles add column if not exists map_url text not null default '';
alter table public.card_profiles add column if not exists social_links jsonb not null default '[]'::jsonb;

create or replace function public.update_card_profile(p_activation_code text, p_profile jsonb)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  updated public.card_profiles;
  requested_mode text := coalesce(p_profile->>'destinationMode','profile');
  requested_name text := trim(coalesce(p_profile->>'displayName',''));
  requested_avatar text := trim(coalesce(p_profile->>'avatarDataUrl',''));
  requested_socials jsonb := coalesce(p_profile->'socialLinks','[]'::jsonb);
begin
  if length(requested_name) < 2 or length(requested_name) > 100 then raise exception 'Nom invalide'; end if;
  if requested_mode not in ('profile','whatsapp','instagram','custom') then raise exception 'Destination invalide'; end if;
  if length(requested_avatar) > 360000 or (requested_avatar <> '' and requested_avatar !~ '^data:image/(webp|jpeg|png);base64,') then raise exception 'Photo invalide'; end if;
  if jsonb_typeof(requested_socials) <> 'array' or jsonb_array_length(requested_socials) > 12 then raise exception 'Réseaux sociaux invalides'; end if;

  update public.card_profiles p set
    display_name=left(requested_name,100), job_title=left(trim(coalesce(p_profile->>'jobTitle','')),120),
    company=left(trim(coalesce(p_profile->>'company','')),120), bio=left(trim(coalesce(p_profile->>'bio','')),500),
    phone=left(trim(coalesce(p_profile->>'phone','')),30), whatsapp=left(trim(coalesce(p_profile->>'whatsapp','')),30),
    email=left(trim(coalesce(p_profile->>'email','')),180), website=left(trim(coalesce(p_profile->>'website','')),500),
    address=left(trim(coalesce(p_profile->>'address','')),300), map_url=left(trim(coalesce(p_profile->>'mapUrl','')),500),
    instagram=left(trim(coalesce(p_profile->>'instagram','')),200), linkedin=left(trim(coalesce(p_profile->>'linkedin','')),500),
    facebook=left(trim(coalesce(p_profile->>'facebook','')),500), custom_label=left(trim(coalesce(p_profile->>'customLabel','')),80),
    custom_url=left(trim(coalesce(p_profile->>'customUrl','')),500), avatar_data_url=requested_avatar,
    social_links=requested_socials, destination_mode=requested_mode,
    published_at=coalesce(p.published_at,now()), updated_at=now()
  where p.activation_code_hash=encode(extensions.digest(upper(trim(p_activation_code)),'sha256'),'hex') and p.is_active
  returning p.* into updated;

  if updated.id is null then return null; end if;
  return to_jsonb(updated)-'activation_code_hash';
end;
$$;

create or replace function public.get_public_card_profile(p_slug text)
returns jsonb
language sql stable security definer set search_path = ''
as $$
  select to_jsonb(p)-'activation_code_hash'-'created_at'-'updated_at'
  from public.card_profiles p
  where p.public_slug=lower(trim(p_slug)) and p.is_active and p.published_at is not null and length(trim(p.display_name))>=2;
$$;

revoke all on function public.update_card_profile(text,jsonb) from public;
revoke all on function public.get_public_card_profile(text) from public;
grant execute on function public.update_card_profile(text,jsonb) to anon,authenticated;
grant execute on function public.get_public_card_profile(text) to anon,authenticated;

commit;

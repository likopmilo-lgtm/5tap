-- Additive media support. Published pages receive metadata; images are fetched separately.
begin;

alter table public.card_profiles add column if not exists cover_data_url text not null default '';
alter table public.card_profiles add column if not exists cover_media_id text not null default '';
alter table public.card_profiles add column if not exists cover_height integer not null default 180;
alter table public.card_profiles add column if not exists cover_zoom integer not null default 100;
alter table public.card_profiles add column if not exists cover_position_x integer not null default 50;
alter table public.card_profiles add column if not exists cover_position_y integer not null default 50;
alter table public.card_profiles add column if not exists portfolio_images jsonb not null default '[]'::jsonb;

-- Keep the existing identity/photo/social save behavior and add media atomically.
do $$
begin
 if to_regprocedure('public.update_card_profile_core(text,jsonb)') is null then
  alter function public.update_card_profile(text,jsonb) rename to update_card_profile_core;
 end if;
end $$;

create or replace function public.update_card_profile(p_activation_code text,p_profile jsonb)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
 saved jsonb;
 result public.card_profiles;
 requested_cover text;
 requested_cover_id text;
 requested_portfolio jsonb;
 item jsonb;
begin
 saved:=public.update_card_profile_core(p_activation_code,p_profile);
 if saved is null then return null; end if;

 if p_profile ? 'coverDataUrl' then
  requested_cover:=coalesce(p_profile->>'coverDataUrl','');
  requested_cover_id:=coalesce(p_profile->>'coverId','');
  if length(requested_cover)>360000 or (requested_cover<>'' and requested_cover !~ '^data:image/(webp|jpeg|png);base64,[A-Za-z0-9+/]+={0,2}$') then raise exception 'Image de couverture invalide'; end if;
  if requested_cover<>'' and requested_cover_id !~* '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' then raise exception 'Reference de couverture invalide'; end if;
  update public.card_profiles set
   cover_data_url=requested_cover,cover_media_id=case when requested_cover='' then '' else requested_cover_id end,
   cover_height=greatest(120,least(320,coalesce(p_profile->>'coverHeight','180')::integer)),
   cover_zoom=greatest(100,least(200,coalesce(p_profile->>'coverZoom','100')::integer)),
   cover_position_x=greatest(0,least(100,coalesce(p_profile->>'coverPositionX','50')::integer)),
   cover_position_y=greatest(0,least(100,coalesce(p_profile->>'coverPositionY','50')::integer))
  where id=(saved->>'id')::uuid;
 end if;

 if p_profile ? 'portfolioImages' then
  requested_portfolio:=coalesce(p_profile->'portfolioImages','[]'::jsonb);
  if jsonb_typeof(requested_portfolio)<>'array' or jsonb_array_length(requested_portfolio)>6 then raise exception 'Portfolio limite a 6 photos'; end if;
  for item in select value from jsonb_array_elements(requested_portfolio) loop
   if jsonb_typeof(item)<>'object' or coalesce(item->>'id','') !~* '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' then raise exception 'Reference de photo invalide'; end if;
   if length(coalesce(item->>'dataUrl',''))>220000 or coalesce(item->>'dataUrl','') !~ '^data:image/(webp|jpeg|png);base64,[A-Za-z0-9+/]+={0,2}$' then raise exception 'Photo du portfolio invalide'; end if;
   if length(coalesce(item->>'caption',''))>120 then raise exception 'Legende trop longue'; end if;
  end loop;
  if (select count(distinct value->>'id') from jsonb_array_elements(requested_portfolio))<>jsonb_array_length(requested_portfolio) then raise exception 'References de photos dupliquees'; end if;
  update public.card_profiles set portfolio_images=requested_portfolio where id=(saved->>'id')::uuid;
 end if;

 select * into result from public.card_profiles where id=(saved->>'id')::uuid;
 return to_jsonb(result)-'activation_code_hash';
end;
$$;

create or replace function public.get_public_card_profile(p_slug text)
returns jsonb
language sql stable security definer set search_path = ''
as $$
 select (to_jsonb(p)-'activation_code_hash'-'created_at'-'updated_at'-'cover_data_url'-'portfolio_images')
  || jsonb_build_object('portfolio_images',coalesce((select jsonb_agg(item-'dataUrl' order by position) from jsonb_array_elements(p.portfolio_images) with ordinality as photos(item,position)),'[]'::jsonb))
 from public.card_profiles p
 where p.public_slug=lower(trim(p_slug)) and p.is_active and p.published_at is not null and length(trim(p.display_name))>=2;
$$;

create or replace function public.get_public_card_media(p_slug text,p_media_id text)
returns text
language sql stable security definer set search_path = ''
as $$
 select case when p.cover_media_id=p_media_id then nullif(p.cover_data_url,'')
  else (select photo->>'dataUrl' from jsonb_array_elements(p.portfolio_images) photo where photo->>'id'=p_media_id limit 1) end
 from public.card_profiles p
 where p.public_slug=lower(trim(p_slug)) and p.is_active and p.published_at is not null and length(trim(p.display_name))>=2;
$$;

revoke all on function public.update_card_profile_core(text,jsonb) from public,anon,authenticated;
revoke all on function public.update_card_profile(text,jsonb) from public;
revoke all on function public.get_public_card_profile(text) from public;
revoke all on function public.get_public_card_media(text,text) from public;
grant execute on function public.update_card_profile(text,jsonb) to anon,authenticated;
grant execute on function public.get_public_card_profile(text) to anon,authenticated;
grant execute on function public.get_public_card_media(text,text) to anon,authenticated;

commit;

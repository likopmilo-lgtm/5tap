-- Keep the original photo and persist the owner's full-image/crop choice.
begin;
alter table public.card_profiles add column if not exists cover_fit text not null default 'cover' check (cover_fit in ('cover','contain'));

do $$
begin
 if to_regprocedure('public.update_card_profile_without_cover_fit(text,jsonb)') is null then
  alter function public.update_card_profile(text,jsonb) rename to update_card_profile_without_cover_fit;
 end if;
end $$;

create or replace function public.update_card_profile(p_activation_code text,p_profile jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare saved jsonb; mode text;
begin
 if p_profile ? 'coverFit' and coalesce(p_profile->>'coverFit','') not in ('cover','contain') then
  raise exception 'Mode de couverture invalide';
 end if;
 saved:=public.update_card_profile_without_cover_fit(p_activation_code,p_profile-'coverFit');
 if saved is null then return null; end if;
 if p_profile ? 'coverFit' then
  update public.card_profiles set cover_fit=p_profile->>'coverFit' where id=(saved->>'id')::uuid;
 end if;
 select cover_fit into mode from public.card_profiles where id=(saved->>'id')::uuid;
 return saved||jsonb_build_object('cover_fit',mode);
end;
$$;

-- The owner/public read functions already return the new column via to_jsonb.
-- Preserve activation checks and all existing identity, media and CV behavior.
revoke all on function public.update_card_profile_without_cover_fit(text,jsonb) from public,anon,authenticated;
revoke all on function public.update_card_profile(text,jsonb) from public;
grant execute on function public.update_card_profile(text,jsonb) to anon,authenticated;
notify pgrst, 'reload schema';
commit;
select 'Full-photo cover option installed; existing photos and crops preserved.' as result;

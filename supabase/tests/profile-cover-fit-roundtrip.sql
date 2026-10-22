-- Synthetic profile only; everything is rolled back.
begin;
do $$
declare
 slug text:='qa-cover-fit-'||gen_random_uuid()::text;
 code text:='5TAP-TEST-FIT1';
 media_id text:=gen_random_uuid()::text;
 png text:='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l4sAAAAASUVORK5CYII=';
 saved jsonb; owner_profile jsonb; published jsonb;
begin
 insert into public.card_profiles(activation_code_hash,public_slug) values(encode(extensions.digest(code,'sha256'),'hex'),slug);
 saved:=public.update_card_profile(code,jsonb_build_object('displayName','QA full cover','coverDataUrl',png,'coverId',media_id,'coverHeight',320,'coverZoom',150,'coverPositionX',20,'coverPositionY',80,'coverFit','contain'));
 if saved->>'cover_fit'<>'contain' then raise exception 'Full photo not saved'; end if;
 owner_profile:=public.get_card_profile(code);published:=public.get_public_card_profile(slug);
 if owner_profile->>'cover_fit'<>'contain' or published->>'cover_fit'<>'contain' then raise exception 'Full photo choice not reloaded'; end if;
 if owner_profile->>'cover_data_url' is distinct from png or public.get_public_card_media(slug,media_id) is distinct from png then raise exception 'Original photo changed'; end if;
 if (published->>'cover_zoom')::integer<>150 or (published->>'cover_position_y')::integer<>80 then raise exception 'Crop settings lost'; end if;
 saved:=public.update_card_profile(code,jsonb_build_object('displayName','QA updated'));
 if saved->>'cover_fit'<>'contain' or saved->>'cover_media_id'<>media_id then raise exception 'Legacy save lost cover'; end if;
 saved:=public.update_card_profile(code,jsonb_build_object('displayName','QA updated','coverFit','cover'));
 if saved->>'cover_fit'<>'cover' then raise exception 'Fill mode not saved'; end if;
 begin
  perform public.update_card_profile(code,jsonb_build_object('displayName','Should not save','coverFit','invalid'));
  raise exception 'Invalid mode accepted';
 exception when others then
  if sqlerrm='Invalid mode accepted' then raise; end if;
 end;
 if public.get_card_profile(code)->>'display_name'<>'QA updated' then raise exception 'Invalid mode changed profile'; end if;
 if public.update_card_profile('5TAP-WRNG-CODE',jsonb_build_object('displayName','QA','coverFit','contain')) is not null then raise exception 'Invalid activation accepted'; end if;
 if has_function_privilege('anon','public.update_card_profile_without_cover_fit(text,jsonb)','EXECUTE') then raise exception 'Private implementation exposed'; end if;
end $$;
rollback;
select 'Full photo, crop, reload, original media, compatibility and activation checks passed; test data rolled back.' as result;

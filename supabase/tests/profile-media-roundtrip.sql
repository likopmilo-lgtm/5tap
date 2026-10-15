-- Tests a synthetic profile in a transaction. No profile/test data is retained.
begin;
do $$
declare
 test_slug text:='qa-media-'||gen_random_uuid()::text;
 test_code text:='5TAP-TEST-2026';
 image_id text:=gen_random_uuid()::text;
 cover_id text:=gen_random_uuid()::text;
 png text:='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l4sAAAAASUVORK5CYII=';
 saved jsonb;
 published jsonb;
 owner_profile jsonb;
begin
 insert into public.card_profiles(activation_code_hash,public_slug)
 values(encode(extensions.digest(test_code,'sha256'),'hex'),test_slug);
 if public.get_public_card_media(test_slug,image_id) is not null then raise exception 'Unpublished media exposed'; end if;

 saved:=public.update_card_profile(test_code,jsonb_build_object(
  'displayName','QA portfolio','destinationMode','profile',
  'coverDataUrl',png,'coverId',cover_id,'coverHeight',240,'coverZoom',130,'coverPositionX',25,'coverPositionY',75,
  'portfolioImages',jsonb_build_array(jsonb_build_object('id',image_id,'dataUrl',png,'caption','Projet test','width',1,'height',1))
 ));
 if saved->>'cover_media_id'<>cover_id or (saved->>'cover_height')::integer<>240 then raise exception 'Cover not saved'; end if;
 if public.get_public_card_media(test_slug,image_id) is distinct from png then raise exception 'Portfolio image not available'; end if;
 if public.get_public_card_media(test_slug,cover_id) is distinct from png then raise exception 'Cover image not available'; end if;
 published:=public.get_public_card_profile(test_slug);
 if published ? 'cover_data_url' or (published->'portfolio_images'->0) ? 'dataUrl' then raise exception 'Public response contains full images'; end if;
 if published->'portfolio_images'->0->>'caption'<>'Projet test' then raise exception 'Caption missing'; end if;
 owner_profile:=public.get_card_profile(test_code);
 if owner_profile->'portfolio_images'->0->>'dataUrl' is distinct from png then raise exception 'Owner cannot reload photo'; end if;

 -- Existing clients which omit media must leave it intact.
 saved:=public.update_card_profile(test_code,jsonb_build_object('displayName','QA updated','destinationMode','profile'));
 if saved->>'cover_media_id'<>cover_id or jsonb_array_length(saved->'portfolio_images')<>1 then raise exception 'Legacy save lost media'; end if;

 if public.update_card_profile('5TAP-WRNG-CODE',jsonb_build_object('displayName','QA')) is not null then raise exception 'Invalid code accepted'; end if;
 if has_function_privilege('anon','public.update_card_profile_core(text,jsonb)','EXECUTE') then raise exception 'Core save should not be directly callable'; end if;

 saved:=public.update_card_profile(test_code,jsonb_build_object('displayName','QA updated','portfolioImages','[]'::jsonb,'coverDataUrl',''));
 if public.get_public_card_media(test_slug,image_id) is not null or public.get_public_card_media(test_slug,cover_id) is not null then raise exception 'Removed media still accessible'; end if;
end $$;
rollback;
select 'Portfolio, cover, reload, compatibility and access checks passed; test data rolled back.' as result;

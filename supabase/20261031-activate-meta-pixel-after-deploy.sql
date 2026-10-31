-- APPLY ONLY AFTER the new consent-aware layout is deployed and checked.
-- The previous production layout loads the configured Pixel immediately.
-- The new layout loads it after the visitor's consent and excludes digital profiles.
begin;
do $$ begin
 if not exists(select 1 from public.site_settings
               where key='metaPixelIdPrepared' and jsonb_typeof(value)='string'
                 and (value #>> '{}') ~ '^[0-9]{5,25}$') then
  raise exception 'No valid prepared Meta Pixel ID';
 end if;
end $$;
insert into public.site_settings(key,value)
select 'metaPixelId',value from public.site_settings where key='metaPixelIdPrepared'
on conflict(key) do update set value=excluded.value,updated_at=now();
commit;

-- This stores the newly created Pixel without enabling the production tracking code.
-- Activate only after deploying the consent-aware marketing-tracking component.
insert into public.site_settings(key,value)
values('metaPixelIdPrepared',to_jsonb('1504170415105961'::text))
on conflict(key) do update set value=excluded.value,updated_at=now();

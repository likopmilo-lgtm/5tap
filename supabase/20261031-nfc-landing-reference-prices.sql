-- Previous prices confirmed by the owner. Current sale prices remain in products.
-- Only the new landing page reads this setting. Set a value to null to hide an old price.
insert into public.site_settings(key,value)
values('nfcLandingReferencePrices','{"carte-visite-personnalisee":329,"carte-visite":229}'::jsonb)
on conflict(key) do update set value=excluded.value;

-- Replaces “delivery included” with the customer-facing “free delivery” wording.
-- This updates editable Supabase SEO and FAQ content that was seeded before this change.
begin;

insert into public.site_settings(key,value) values
  ('defaultDescription','"Cartes de visite digitales NFC dès 179 DH et supports Google Review dès 149 DH. Livraison gratuite partout au Maroc."')
on conflict(key) do update set value=excluded.value,updated_at=now();

insert into public.content_pages(slug,title,description,seo) values
  ('home','5Tap — Cartes de visite digitales NFC et Google Review','Cartes de visite digitales NFC dès 179 DH et supports Google Review dès 149 DH. Livraison gratuite partout au Maroc.','{"canonicalPath":"/"}'),
  ('shop','Boutique NFC — Cartes de visite et Google Review','Comparez les cartes de visite digitales NFC et les supports Google Review 5Tap de 149 à 399 DH. Livraison gratuite partout au Maroc.','{"canonicalPath":"/boutique"}')
on conflict(slug) do update set title=excluded.title,description=excluded.description,seo=excluded.seo,updated_at=now();

update public.faqs
set answer = replace(answer, 'La livraison est incluse partout au Maroc.', 'La livraison est gratuite partout au Maroc.')
where answer like '%La livraison est incluse partout au Maroc%';

commit;
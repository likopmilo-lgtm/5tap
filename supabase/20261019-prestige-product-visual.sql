-- Seul le visuel Prestige change. Prix, autres produits et commandes inchangés.
-- Publier le WebP sur Cloudflare avant cette migration.
begin;
update public.products p
set images=jsonb_build_array('{"url":"/images/stand-prestige-insta-v2.webp","alt":"Exemple de stand NFC Google Review personnalisé LUX PHONE en acrylique transparent avec pied doré","width":1536,"height":1024,"title":"Pack Prestige — exemple de stand personnalisé","caption":"Exemple de personnalisation. Votre visuel est validé avant préparation. Le pack comprend aussi une carte Google Review.","metadata":{"source":"5Tap insta — adaptation catalogue avec imagegen","type":"product"}}'::jsonb)
           || case when jsonb_typeof(p.images)='array' then p.images - 0 else '[]'::jsonb end,
    seo=coalesce(p.seo,'{}'::jsonb)||jsonb_build_object('ogImage','/images/stand-prestige-insta-v2.webp'),
    updated_at=now()
where p.id='prestige';
commit;
select id,price,images->0->>'url' as image,images->0->>'alt' as description,seo->>'ogImage' as partage
from public.products order by sort_order;

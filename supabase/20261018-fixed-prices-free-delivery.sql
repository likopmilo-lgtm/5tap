-- Prix fixes approuvés le 18 octobre 2026 ; livraison comprise.
-- Préserve les visuels, les descriptions, les commandes et les profils existants.
begin;
update public.products p
set price=v.price,
    metadata=coalesce(p.metadata,'{}'::jsonb)-'compareAtPrice',
    seo=coalesce(p.seo,'{}'::jsonb)||jsonb_build_object('title',p.name||' — '||v.price::text||' DH'),
    updated_at=now()
from (values ('carte-visite',179),('carte-visite-personnalisee',249),('carte-google',149),('essentiel',249),('pro',299),('prestige',399)) as v(id,price)
where p.id=v.id;

insert into public.site_settings(key,value) values
('tangierShipping','0'::jsonb),
('moroccoShipping','0'::jsonb),
('promotionHeadline','""'::jsonb),
('defaultDescription','"Cartes de visite digitales NFC dès 179 DH et Google Review dès 149 DH. Livraison gratuite partout au Maroc. Découvrez les cartes et packs 5Tap."'::jsonb)
on conflict(key) do update set value=excluded.value,updated_at=now();

insert into public.content_pages(slug,title,description,seo) values
('home','5Tap — Cartes de visite digitales et avis Google','Cartes de visite digitales NFC dès 179 DH et Google Review dès 149 DH. Livraison gratuite partout au Maroc. Découvrez les cartes et packs 5Tap.','{"canonicalPath":"/"}'::jsonb),
('shop','Boutique NFC — Cartes et packs 5Tap','Cartes de visite NFC dès 179 DH, cartes Google Review dès 149 DH et packs dès 249 DH. Livraison gratuite partout au Maroc.','{"canonicalPath":"/boutique"}'::jsonb),
('faq','FAQ 5Tap','Réponses sur les cartes NFC, les avis Google, la personnalisation, le paiement et la livraison gratuite au Maroc.','{"canonicalPath":"/faq"}'::jsonb)
on conflict(slug) do update set title=excluded.title,description=excluded.description,seo=coalesce(public.content_pages.seo,'{}'::jsonb)||excluded.seo,updated_at=now();

update public.faqs set answer='Les cartes de visite digitales commencent à 179 DH et la gamme Google Review à 149 DH. La livraison est gratuite partout au Maroc. Les produits standard sont payés à la livraison. Une avance est demandée avant la préparation des produits personnalisés ; son montant et son moyen de paiement sont confirmés avec vous.'
where question='Quels sont les prix et les conditions de paiement ?';
update public.faqs set answer='La livraison est gratuite partout au Maroc. Un produit standard est livré sous 2 jours maximum. Pour un produit personnalisé, comptez 1 à 2 jours de préparation après validation du visuel et réception de l’avance, puis 2 jours maximum pour la livraison.'
where question='Quels sont les délais de préparation et de livraison ?';
commit;
select id,price,metadata->>'compareAtPrice' as ancien_prix from public.products where id in ('carte-visite','carte-visite-personnalisee','carte-google','essentiel','pro','prestige') order by sort_order;

-- Apply only after the local October 2026 catalogue is approved.
-- Keeps Supabase as the editable product source while aligning commercial facts.

begin;

insert into public.products
  (id,slug,name,label,description,price,category,items,is_custom,is_featured,is_active,sort_order,images,seo)
values
  ('carte-visite','carte-visite','Carte de visite digitale standard','Logo 5Tap','Une carte NFC noire et or avec le logo 5Tap qui ouvre vos coordonnées, votre profil ou le lien de votre choix.',179,'visite','["1 carte NFC avec logo 5Tap","Destination configurée selon votre choix","QR code en alternative"]',false,true,true,10,'[{"url":"/images/carte-visite-studio.webp","alt":"Carte de visite NFC noire et or 5Tap avec aperçu du profil digital sur téléphone","width":1536,"height":1024}]','{"title":"Carte de visite digitale standard — 179 DH","description":"Carte NFC avec logo 5Tap, configurée vers vos coordonnées ou le lien de votre choix.","canonicalPath":"/produit/carte-visite","ogImage":"/images/carte-visite-studio.webp"}'),
  ('carte-visite-personnalisee','carte-visite-personnalisee','Carte de visite digitale personnalisée','Votre logo','Votre carte NFC aux couleurs de votre activité, personnalisée avec votre logo et configurée vers la destination choisie.',249,'visite','["1 carte NFC avec votre logo","Visuel validé avant préparation","Destination configurée selon votre choix"]',true,true,true,20,'[{"url":"/images/carte-visite-personnalisee.webp","alt":"Carte de visite NFC personnalisable noire et or avec emplacement Votre logo","width":1536,"height":1024}]','{"title":"Carte de visite digitale personnalisée — 249 DH","description":"Carte NFC personnalisée avec votre logo et configurée vers la destination choisie.","canonicalPath":"/produit/carte-visite-personnalisee","ogImage":"/images/carte-visite-personnalisee.webp"}'),
  ('carte-google','carte-google','Carte Google Review simple','Le geste essentiel','Ouvrez directement votre fiche Google pour permettre à vos clients de partager leur expérience en quelques secondes.',149,'google','["1 carte NFC Google Review","Lien Google configuré","QR code en alternative"]',false,false,true,30,'[{"url":"/images/carte-google-studio.webp","alt":"Carte NFC Google Review 5Tap noire avec logo Google et cinq étoiles","width":1536,"height":1024}]','{"title":"Carte Google Review simple — 149 DH","description":"Carte NFC 5Tap configurée vers votre fiche Google.","canonicalPath":"/produit/carte-google","ogImage":"/images/carte-google-studio.webp"}'),
  ('essentiel','essentiel','Pack Essentiel','Pour bien démarrer','Le duo idéal pour votre comptoir : un stand visible et une carte Google Review toujours à portée de main.',249,'packs','["1 stand standard","1 carte NFC Google Review","Configuration incluse"]',false,true,true,40,'[{"url":"/images/pack-essentiel-studio.webp","alt":"Pack Essentiel 5Tap avec un stand et une carte NFC Google Review","width":1536,"height":1024}]','{"title":"Pack Essentiel 5Tap — 249 DH","description":"Un stand standard et une carte NFC Google Review.","canonicalPath":"/produit/essentiel","ogImage":"/images/pack-essentiel-studio.webp"}'),
  ('pro','pro','Pack Pro','Notre recommandation','Un stand à l’accueil et deux cartes en salle pour multiplier les occasions de recueillir un avis Google.',299,'packs','["1 stand standard","2 cartes NFC Google Review","Configuration incluse"]',false,true,true,50,'[{"url":"/images/pack-pro-studio.webp","alt":"Pack Pro 5Tap avec un stand et deux cartes NFC Google Review","width":1536,"height":1024}]','{"title":"Pack Pro 5Tap — 299 DH","description":"Un stand standard et deux cartes NFC Google Review.","canonicalPath":"/produit/pro","ogImage":"/images/pack-pro-studio.webp"}'),
  ('prestige','prestige','Pack Prestige','À votre image','Un stand en plexiglas personnalisé avec votre logo pour présenter votre marque avec élégance.',399,'packs','["1 stand plexiglas personnalisé","1 carte NFC Google Review","Visuel validé avant préparation"]',true,true,true,60,'[{"url":"/images/stand-prestige-studio.webp","alt":"Stand plexiglas personnalisable du Pack Prestige 5Tap","width":1536,"height":1024}]','{"title":"Pack Prestige personnalisé — 399 DH","description":"Stand plexiglas personnalisé et carte NFC Google Review.","canonicalPath":"/produit/prestige","ogImage":"/images/stand-prestige-studio.webp"}')
on conflict (id) do update set
  slug=excluded.slug,name=excluded.name,label=excluded.label,description=excluded.description,
  price=excluded.price,category=excluded.category,items=excluded.items,is_custom=excluded.is_custom,
  is_featured=excluded.is_featured,is_active=excluded.is_active,sort_order=excluded.sort_order,
  images=excluded.images,seo=excluded.seo,updated_at=now();

insert into public.site_settings(key,value) values
  ('defaultTitle','"5Tap — Cartes de visite digitales NFC et Google Review"'),
  ('defaultDescription','"Cartes de visite digitales NFC dès 179 DH et supports Google Review dès 149 DH. Livraison incluse partout au Maroc."'),
  ('tangierShipping','0'),
  ('moroccoShipping','0')
on conflict(key) do update set value=excluded.value,updated_at=now();

insert into public.content_pages(slug,title,description,seo) values
  ('home','5Tap — Cartes de visite digitales NFC et Google Review','Cartes de visite digitales NFC dès 179 DH et supports Google Review dès 149 DH. Livraison incluse partout au Maroc.','{"canonicalPath":"/"}'),
  ('shop','Boutique NFC — Cartes de visite et Google Review','Comparez les cartes de visite digitales NFC et les supports Google Review 5Tap de 149 à 399 DH. Livraison incluse partout au Maroc.','{"canonicalPath":"/boutique"}'),
  ('faq','FAQ 5Tap','Réponses sur les cartes NFC, la personnalisation, le paiement et la livraison au Maroc.','{"canonicalPath":"/faq"}'),
  ('contact','Contact 5Tap','Contactez 5Tap sur WhatsApp pour une carte NFC, un support Google Review ou une démonstration.','{"canonicalPath":"/contact"}')
on conflict(slug) do update set title=excluded.title,description=excluded.description,seo=excluded.seo,updated_at=now();

delete from public.faqs;
insert into public.faqs(question,answer,sort_order) values
  ('Quelle différence entre une carte de visite et une carte Google Review ?','La carte de visite digitale partage vos coordonnées ou ouvre la destination de votre choix. La carte Google Review ouvre directement la fiche Google d’un commerce pour permettre au client de laisser un avis.',10),
  ('Quelle différence entre la carte standard et la carte personnalisée ?','La carte standard porte le logo 5Tap sur son support physique et ouvre vos coordonnées ou votre lien. La carte personnalisée porte votre propre logo ; son visuel doit être validé avec vous avant sa préparation.',20),
  ('Comment fonctionne le NFC et à quoi sert le QR code ?','Approchez un téléphone compatible pour ouvrir le lien enregistré dans la puce NFC. Le support ne nécessite ni batterie ni recharge. Le QR code permet d’ouvrir la même destination avec l’appareil photo lorsque le NFC n’est pas disponible.',30),
  ('Avec quels téléphones les produits sont-ils compatibles ?','Ils fonctionnent avec les iPhone et smartphones Android récents compatibles NFC. La zone de lecture varie selon le modèle. Le QR code reste disponible comme alternative.',40),
  ('Faut-il installer une application ?','Non. Aucune application 5Tap n’est nécessaire pour ouvrir une carte ou un stand. Une connexion Internet est nécessaire pour afficher la destination.',50),
  ('Quels sont les prix et les conditions de paiement ?','Les cartes de visite digitales commencent à 179 DH et la gamme Google Review à 149 DH. Les produits standard sont payés à la livraison. Une avance est demandée avant la préparation des produits personnalisés ; son montant et son moyen de paiement sont confirmés avec vous.',60),
  ('Quels sont les délais de préparation et de livraison ?','La livraison est incluse partout au Maroc. Un produit standard est livré sous 2 jours maximum. Pour un produit personnalisé, comptez 1 à 2 jours de préparation après validation du visuel et réception de l’avance, puis 2 jours maximum pour la livraison.',70),
  ('Comment transmettre mon logo pour un produit personnalisé ?','Après votre commande, notre équipe vous contacte sur WhatsApp pour recevoir votre logo et vos informations. Nous vous envoyons un visuel à valider avant de commencer la préparation.',80),
  ('Puis-je choisir la destination de ma carte de visite ?','Oui. La carte peut ouvrir un profil regroupant vos coordonnées et vos liens, WhatsApp directement, Instagram directement ou un autre lien de votre choix.',90),
  ('Puis-je modifier moi-même mes coordonnées plus tard ?','L’espace client permettant de modifier soi-même ses coordonnées est prévu pour une deuxième phase et n’est pas encore disponible. Contactez 5Tap pour connaître les possibilités de mise à jour actuellement proposées.',100),
  ('Le dashboard à 79 DH/mois est-il obligatoire ?','Non. L’abonnement n’est pas obligatoire pour utiliser votre support. Le dashboard est une option séparée à 79 DH/mois pour les stands. Ses fonctionnalités seront publiées une fois leur périmètre final défini.',110);

commit;

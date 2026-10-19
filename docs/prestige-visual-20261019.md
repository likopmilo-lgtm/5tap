# Nouveau visuel Pack Prestige

Seul le Pack Prestige change. Les cinq autres produits, la photo d’accueil, les prix et la livraison restent inchangés.

Mode : outil imagegen intégré. Source : le design LUX PHONE du chat « 5tap insta ». Le produit est repris sur fond crème, sans les titres et boutons du post Instagram. La légende précise qu’il s’agit d’un exemple de personnalisation et que le pack comprend aussi une carte Google Review.

Fichier : public/images/stand-prestige-insta-v2.webp, 1536 × 1024, qualité 85.

La migration supabase/20261019-prestige-product-visual.sql renseigne l’image, ses dimensions, son titre, sa légende, son texte alternatif et l’image de partage. Publier le fichier avant d’appliquer la migration. Les éventuelles images secondaires sont conservées. Les URL choisies ultérieurement dans Supabase restent prioritaires sur les anciens visuels connus.

## Prompt final


Références :
- 5tap insta: outputs/5tap-stands-3d-comptoir-v2-2026-10-17/post-01-lux-phone-lumiere-naturelle.jpg

Prompt final :

Use case: product-mockup. Edit target image 1: isolate the LUX PHONE personalized Google Review stand from the Instagram post and create a clean ecommerce product photograph on a warm cream #F5F3EE seamless surface. Preserve this exact portrait clear acrylic stand, transparent edges, slim gold colored foot and printed black insert with fine gold curves, white/gold LUX PHONE logo, Arabic thank-you copy, multicolor Google logo, five gold stars, QR at lower left and white phone/NFC icon panel at lower right. Subtle three-quarter angle, entirely visible centered and not cut off, fills 74% image height with generous safe space. Natural soft daylight with restrained reflections, realistic ordinary clear acrylic, no dramatic glow. 1536x1024 landscape composition. Exactly one stand, no extra cards/phones/stands/props. Remove all outside-product ad headlines, top 5Tap logo, bio CTA, web address, shop background and dark marble. Do not invent extra copy or badges. This is a customization example rather than a verified testimonial.

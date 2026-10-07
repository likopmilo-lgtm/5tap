-- Run once in the Supabase SQL editor for the 5Tap project.
BEGIN;
UPDATE public.products SET price = CASE id
  WHEN 'carte-google' THEN 149
  WHEN 'essentiel' THEN 249
  WHEN 'pro' THEN 299
  WHEN 'prestige' THEN 399
  WHEN 'carte-visite' THEN 149
END
WHERE id IN ('carte-google','essentiel','pro','prestige','carte-visite');
UPDATE public.site_settings SET value = '0'::jsonb
WHERE key IN ('tangierShipping','moroccoShipping');
UPDATE public.site_settings
SET value = to_jsonb('Cartes de visite digitales NFC personnalisées et supports avis Google dès 149 DH. Livraison gratuite partout au Maroc et paiement à la livraison.'::text)
WHERE key = 'defaultDescription';
COMMIT;
SELECT id, price FROM public.products ORDER BY sort_order;
SELECT key, value FROM public.site_settings WHERE key IN ('tangierShipping','moroccoShipping');

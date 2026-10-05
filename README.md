# 5Tap

Site e-commerce NFC pour 5Tap, marque basée à Tanger.

Le site vend des cartes de visite digitales NFC et des supports NFC pour avis Google. Le catalogue, les images, les métadonnées SEO, les paramètres marketing, les commandes et les événements sont prévus pour être administrés depuis Supabase.

## Stack

- Vinext / Next App Router
- React
- Cloudflare Workers compatible
- Supabase REST API
- Paiement à la livraison
- Checkout sans compte client

## Variables d'environnement

Créez ces variables dans Cloudflare :

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
```

Sans ces variables, le site garde un fallback local pour les tests, mais la production doit utiliser Supabase.

Après l’enregistrement d’une commande, le checkout ouvre WhatsApp avec le récapitulatif prérempli. Le client appuie sur « Envoyer » pour le transmettre à 5Tap. Le numéro destinataire se modifie dans la valeur `whatsappUrl` de la table `site_settings`.

## Supabase

1. Créez un projet Supabase.
2. Ouvrez SQL Editor.
3. Exécutez `supabase/schema.sql`.
4. Modifiez ensuite les données depuis les tables Supabase.

Tables principales :

- `products`
- `faqs`
- `content_pages`
- `site_settings`
- `orders`
- `site_events`

Le guide complet est dans `SUPABASE-ADMIN-5TAP.md`.

## Déploiement Cloudflare

Dans Cloudflare, connectez ce dépôt GitHub puis utilisez :

```bash
npm ci
npm run build
```

Le projet est conçu pour produire une sortie Cloudflare Worker via Vinext.

## Développement local

```bash
npm ci
npm run dev
```

Le site tourne par défaut sur `http://localhost:5173`.

## SEO

Le site inclut :

- metadata dynamiques par page et par produit ;
- sitemap dynamique ;
- robots.txt ;
- canonical URLs ;
- Open Graph / Twitter pour les produits ;
- JSON-LD `Product` sur les pages produit.

Les titres, descriptions, images et autres réglages SEO peuvent être changés depuis Supabase.

# Administration Supabase pour 5Tap

Le site est maintenant préparé pour utiliser Supabase comme source principale des données.

## Variables à configurer

Dans l’environnement du site, ajoutez :

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Le fichier SQL à exécuter dans Supabase est ici :

[supabase-5tap-schema.sql](./supabase-5tap-schema.sql)

## Tables à modifier dans Supabase

- `products` : nom, prix, description, contenu du pack, statut actif, ordre, personnalisation.
- `products.images` : galerie produit en JSON avec `url`, `alt`, `width`, `height`, `title`, `metadata`.
- `products.seo` : titre, description, canonical et image Open Graph par produit.
- `content_pages` : SEO des pages accueil, boutique, FAQ, contact.
- `site_settings` : WhatsApp, Instagram, frais de livraison, Meta Pixel, Google Analytics, Google Tag Manager.
- `faqs` : questions/réponses visibles sur le site.
- `orders` : commandes reçues depuis le checkout.
- `site_events` : événements comme page vue et début de checkout.

## Exemple d’image produit

Dans `products.images`, utilisez ce format :

```json
[
  {
    "url": "https://votre-image-supabase-storage-ou-cdn.webp",
    "alt": "Pack Prestige 5Tap personnalisé sur comptoir",
    "width": 1200,
    "height": 800,
    "title": "Pack Prestige",
    "caption": "Photo du produit livré",
    "metadata": {
      "photographer": "5Tap",
      "location": "Tanger",
      "usage": "product-gallery"
    }
  }
]
```

## Tracking marketing

Dans `site_settings`, changez simplement ces valeurs :

- `metaPixelId`
- `googleAnalyticsId`
- `googleTagManagerId`

Laissez une chaîne vide si vous ne voulez pas activer un outil.

## SEO

Le site lit les métadonnées depuis Supabase quand les variables sont configurées. Les pages produit rendent aussi un schéma JSON-LD `Product` avec prix, image, description et disponibilité.

Pour un meilleur référencement, gardez chaque produit avec :

- un `slug` court et stable ;
- une description unique ;
- une image avec `alt`, largeur et hauteur ;
- un `seo.title` et `seo.description` propres.

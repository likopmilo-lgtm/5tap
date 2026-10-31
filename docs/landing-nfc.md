# Landing NFC 5Tap — offre personnalisée et Pixel

## État au 31 octobre 2026

La route `/offre/carte-nfc?lang=fr` est destinée à la campagne vidéo NFC.
Déploiement Cloudflare autorisé le 31 octobre 2026 ; la campagne Meta est préparée
avec un budget total de 15 USD sur 3 jours et un départ à 20 h, heure du Maroc.
La mise en page reprend la logique
produit/galerie + commande de la référence fournie par le client
(https://www.getpopcard.com/commande-popcard-pro-standard), avec les visuels,
textes et couleurs 5Tap. Aucun avis client, stock limité ou compte à rebours inventé.

Le client a précisé et approuvé :
- Carte personnalisée avec logo client : **249 DH**, ancien prix **329 DH**.
- Carte standard avec logo 5Tap : **179 DH**, ancien prix **229 DH**.
- Personnalisée présélectionnée et affichée en premier.
- Deux choix directement visibles au-dessus du formulaire, sans menu à ouvrir.
- Mention **Livraison incluse partout au Maroc**. Frais réels : 0 DH.

Les prix courants restent lus dans `products`. Les anciens prix sont configurés
par `site_settings.nfcLandingReferencePrices`, avec valeurs de secours provenant
uniquement des prix précédents fournis par le client. `null` désactive un ancien
prix. Une référence inférieure ou égale au prix courant n'est jamais affichée.
Le réglage ne change pas les prix de vente du catalogue ni les autres pages.

## Parcours de commande

Galerie du produit ou exemple de profil ; informations et commande à droite sur
ordinateur, image puis offre sur mobile. Trois champs : nom/prénom, numéro
WhatsApp et ville. Quantité modifiable entre 1 et 50. Changer de version conserve
les coordonnées et la quantité, et actualise l'image, le prix, le total, les
conditions de paiement et les informations de personnalisation.

La personnalisée nécessite une avance avant préparation ; montant et moyen
restent à confirmer avec le client, sans valeur inventée. Le logo est reçu sur
WhatsApp, puis le visuel doit être validé. Préparation 1 à 2 jours après validation
et avance, puis livraison sous 2 jours maximum. La standard se paie à la livraison
et est livrée sous 2 jours maximum.

Le formulaire utilise `/api/orders`. Le serveur recalcule les prix et frais et
compare `expectedTotal` au montant affiché. S'il a changé, réponse 409 et nouvelle
validation explicite avant création d'une demande.

Après réponse 201, le site affiche référence, quantité, total et prochaines étapes.
Aucune redirection WhatsApp imposée. Le support contacte le client pour confirmer
les informations. Le statut reste `awaiting_whatsapp_confirmation` et la source
`website`, compatibles avec la RLS existante. Les notes précisent la version et
les conditions d'avance ou de paiement à la livraison.

Le suivi humain des demandes dans Supabase reste nécessaire. Un événement Lead
ne garantit pas une vente payée/livrée. La gestion complète de l'idempotence en
cas de coupure après une écriture Supabase n'a pas été ajoutée dans cette tâche.

## Pixel créé, activation préparée

Le portefeuille **5tap existait déjà** : ID **2143881049540781**. Aucun nouveau
portefeuille, aucun nouveau compte publicitaire et aucun transfert irréversible
du compte personnel **171553924860372** n'ont été effectués.

Après autorisation explicite du client d'accepter les Conditions des outils
professionnels Meta, la source a été créée :
- Nom : **5Tap — Site web**.
- Pixel / Dataset ID : **1504170415105961**.
- Fiche : https://eventsmanager.facebook.com/events_manager2/list/dataset/1504170415105961/overview?business_id=2143881049540781
- La connexion automatique de tous les datasets à Conversions API n'a pas été activée.

Déjà appliqués dans Supabase, sans modifier la RLS ni activer de suivi :
1. `20261031-nfc-landing-reference-prices.sql`.
2. `20261031-prepare-meta-pixel.sql`.

Valeurs vérifiées dans `site_settings` lors de la préparation, avant déploiement :
- `nfcLandingReferencePrices` : personnalisée 329 ; standard 229.
- `metaPixelIdPrepared` : `1504170415105961`.
- `metaPixelId` : vide, donc Pixel pas encore actif sur le site de production.

**Après déploiement et contrôle du nouveau layout**, appliquer
`20261031-activate-meta-pixel-after-deploy.sql`. Ne pas l'appliquer avant :
l'ancien layout charge immédiatement le Pixel configuré, tandis que le nouveau
charge les outils publicitaires uniquement après accord et exclut les profils.
Puis vérifier réellement PageView, ViewContent, InitiateCheckout et Lead dans
Test events. Le rattachement éventuel du dataset au compte publicitaire doit
également être vérifié avant une campagne optimisée ; aucun rattachement ni
changement de budget n'a été effectué ici.

## Mesure et confidentialité

Les réglages actifs sont `metaPixelId`, `googleAnalyticsId`,
`googleTagManagerId`. Les identifiants sont validés avant utilisation. Ne pas
installer deux fois le même Pixel directement et via GTM.

Le visiteur peut accepter ou refuser les outils de mesure, puis modifier son
choix via Préférences de confidentialité. Refuser n'empêche pas la commande.
Les pages `/mon-profil`, `/p/*`, `/go/*` et les API sont exclues.

Événements : PageView, ViewContent, AddToCart (panier existant), InitiateCheckout,
Lead après succès de l'enregistrement, Contact pour un clic d'assistance sur la
landing. Pas de Purchase pour une simple demande contre remboursement ou avance.
Les paramètres manuels n'incluent ni nom, téléphone, ville, code privé, photo ou
CV. Le SDK tiers peut transmettre des données techniques après consentement.

La page Confidentialité décrit les deux parcours et les outils facultatifs dans
les quatre langues. Le futur renvoi des ventes confirmées via Conversions API
nécessitera une règle commerciale explicite et un secret conservé côté serveur.

Référence officielle consultée : https://www.facebookblueprint.com/student/activity/248027

## Vérification

Tests : `commerce-tracking.test.mjs`, `order-pricing.test.mjs`,
`pricing.test.mjs`, `nfc-landing-offer.test.mjs`. Contrôle TypeScript et build.

La QA navigateur utilise `outputs/landing-browser-qa.mjs`, ignoré par Git :
le véritable gestionnaire de commandes écrit en mémoire locale. Aucune commande
de test dans Supabase. Simuler une erreur conserve les champs et permet de
réessayer. Deux personnalisées = 498 DH ; deux standards = 358 DH ; livraison 0.
La confirmation s'affiche sans ouvrir WhatsApp.

Les aperçus et preuves sont dans `outputs/landing-qa/v2/`. Vérifications de largeur,
images, prix et textes pour FR, darija AR (RTL), EN et ES. Les tests navigateur ne
remplacent pas une vérification sur appareil iPhone physique ni la réception
effective des événements dans Meta après déploiement.

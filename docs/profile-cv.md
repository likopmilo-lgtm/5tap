# CV ou document sur les profils digitaux

Dans `/mon-profil`, après ouverture avec le code privé de la carte, la section « CV ou document » accepte un PDF, DOC ou DOCX de 5 Mo maximum. Le document est facultatif. Le titulaire choisit le texte du bouton, remplace le fichier ou le retire, puis enregistre les modifications. Le document apparaît uniquement sur les profils publiés et actifs.

Les PDF peuvent être consultés ou téléchargés ; les fichiers Word sont proposés en téléchargement. Le bouton est également visible dans l’aperçu de l’éditeur. Une modification du nom ou d’une autre information conserve le fichier existant sans le renvoyer. L’omission du champ par les anciens clients conserve également le document.

## Données et accès

La migration `supabase/20261020-profile-cv-document.sql` ajoute `card_profiles.cv_document` : identifiant UUID, nom du fichier, type MIME, taille, libellé et données encodées. Le stockage suit le mécanisme Supabase des médias déjà présent. Le fichier est demandé séparément via `/api/profile-document/{slug}/{id}` ; ses données ne sont intégrées ni aux pages publiques ni aux réponses de chargement de l’éditeur. Les fonctions internes précédentes restent privées. Le code d’activation et les données des autres profils ne sont jamais renvoyés avec le document.

Les anciennes fonctions de sauvegarde sont conservées derrière les nouveaux points d’entrée, afin de préserver les photos, le portfolio et l’identité. Les données existantes ne sont pas réécrites par la migration. Les tables restent protégées par les droits et RLS existants.

L’API et Supabase vérifient le format, la taille et la signature du fichier. Le serveur fixe le type MIME et un nom de téléchargement encodé, bloque l’interprétation en HTML et utilise une réponse non mise en cache. La suppression ou le remplacement invalide immédiatement l’ancien lien. Les fichiers Word sont toujours servis en pièce jointe. Ces contrôles ne constituent pas un antivirus.

Les visiteurs peuvent récupérer un document uniquement lorsque le profil est actif et publié. La mise hors ligne d’une carte retire aussi l’accès à son document. La page Confidentialité précise le caractère public de ce que le titulaire choisit de publier et la possibilité de le retirer.

## Vérifications

- `tests/profile-document.test.mjs` : formats, limite de 5 Mo, fichiers déguisés, noms, métadonnées et liens.
- `tests/profile-document-api.test.mjs` : sauvegarde/chargement, conservation de l’identité, limites de requête, suppression, réponses binaires et accès refusés.
- `supabase/tests/profile-cv-roundtrip.sql` : tests sur un profil synthétique dans une transaction annulée. Aucun profil de test n’est conservé.
- `supabase/tests/profile-media-roundtrip.sql` : compatibilité de la couverture, du portfolio et des anciens clients.
- Test visuel local avec un profil fictif, en utilisant les vrais composants et API ; les écritures de ce test sont simulées en mémoire.

La migration doit être appliquée avant de déployer l’interface. Le format et l’URL publique du document permettent de faire évoluer le stockage plus tard sans changer les cartes NFC ou QR.

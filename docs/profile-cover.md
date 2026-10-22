# Couverture des profils

- `cover_fit` dans Supabase accepte `cover` (bandeau recadré) ou `contain` (photo entière). Les profils existants conservent `cover` par défaut ; les nouvelles photos utilisent `contain`.
- Le mode photo entière ignore le zoom et les positions, tout en conservant ces valeurs pour retrouver le cadrage précédent. Le fond est uni et ni le logo ni l’avatar ne masquent la photo.
- Le choix est commun à l’éditeur, l’aperçu et la page publique. Il est enregistré par la fonction existante `update_card_profile`, après vérification du code privé. Les versions antérieures qui omettent `coverFit` conservent le choix déjà enregistré.
- La migration additive est `supabase/20261022-profile-cover-fit.sql`. Le test `supabase/tests/profile-cover-fit-roundtrip.sql` crée une carte fictive dans une transaction annulée.

## Images de téléphone

La photo source peut atteindre 25 Mio. Les photos décodables par le navigateur sont redimensionnées et compressées avant envoi, avec un maximum inchangé de 360 000 caractères pour la couverture et 220 000 pour une image du portfolio. Les fichiers HEIC/HEIF peuvent être sélectionnés ; si le navigateur ne peut pas les décoder, le client est invité à choisir une version JPG.

L’encodeur détecte le type réellement produit par `canvas.toDataURL`. Si WebP est remplacé par PNG, il utilise JPEG, puis réduit progressivement les dimensions et la qualité. Cette détection est nécessaire car un type non pris en charge peut produire du PNG, qui ignore la qualité : [documentation de l’API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL).

Les tests couvrent le repli PNG vers JPEG, une source de plus de 8 Mio, la limite finale, les proportions et la libération des ressources. Un test navigateur local a aussi compressé une image de 12 Mio avec l’encodage WebP volontairement indisponible. Ce test simule le cas de compatibilité ; il ne constitue pas un essai sur un iPhone physique.

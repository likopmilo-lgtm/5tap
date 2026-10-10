export const whatsapp = 'https://wa.me/212672606072';

export const products = [
  {id:'carte-visite',name:'Carte de visite digitale standard',price:179,category:'visite',label:'Logo 5Tap',desc:'Une carte NFC noire et or avec le logo 5Tap qui ouvre vos coordonnées, votre profil ou le lien de votre choix.',items:['1 carte NFC avec logo 5Tap','Destination configurée selon votre choix','QR code en alternative'],custom:false},
  {id:'carte-visite-personnalisee',name:'Carte de visite digitale personnalisée',price:249,category:'visite',label:'Votre logo',desc:'Votre carte NFC aux couleurs de votre activité, personnalisée avec votre logo et configurée vers la destination choisie.',items:['1 carte NFC avec votre logo','Visuel validé avant préparation','Destination configurée selon votre choix'],custom:true},
  {id:'carte-google',name:'Carte Google Review simple',price:149,category:'google',label:'Le geste essentiel',desc:'Ouvrez directement votre fiche Google pour permettre à vos clients de partager leur expérience en quelques secondes.',items:['1 carte NFC Google Review','Lien Google configuré','QR code en alternative'],custom:false},
  {id:'essentiel',name:'Pack Essentiel',price:249,category:'packs',label:'Pour bien démarrer',desc:'Le duo idéal pour votre comptoir : un stand visible et une carte Google Review toujours à portée de main.',items:['1 stand standard','1 carte NFC Google Review','Configuration incluse'],custom:false},
  {id:'pro',name:'Pack Pro',price:299,category:'packs',label:'Notre recommandation',desc:'Un stand à l’accueil et deux cartes en salle pour multiplier les occasions de recueillir un avis Google.',items:['1 stand standard','2 cartes NFC Google Review','Configuration incluse'],custom:false},
  {id:'prestige',name:'Pack Prestige',price:399,category:'packs',label:'À votre image',desc:'Un stand en plexiglas personnalisé avec votre logo pour présenter votre marque avec élégance.',items:['1 stand plexiglas personnalisé','1 carte NFC Google Review','Visuel validé avant préparation'],custom:true},
] as const;

export type Product = (typeof products)[number];
export type CartItem = {id:string;quantity:number};

export const faqs:[string,string][]= [
  ['Quelle différence entre une carte de visite et une carte Google Review ?','La carte de visite digitale partage vos coordonnées ou ouvre la destination de votre choix. La carte Google Review ouvre directement la fiche Google d’un commerce pour permettre au client de laisser un avis.'],
  ['Quelle différence entre la carte standard et la carte personnalisée ?','La carte standard porte le logo 5Tap sur son support physique et ouvre vos coordonnées ou votre lien. La carte personnalisée porte votre propre logo ; son visuel doit être validé avec vous avant sa préparation.'],
  ['Comment fonctionne le NFC et à quoi sert le QR code ?','Approchez un téléphone compatible pour ouvrir le lien enregistré dans la puce NFC. Le support ne nécessite ni batterie ni recharge. Le QR code permet d’ouvrir la même destination avec l’appareil photo lorsque le NFC n’est pas disponible.'],
  ['Avec quels téléphones les produits sont-ils compatibles ?','Ils fonctionnent avec les iPhone et smartphones Android récents compatibles NFC. La zone de lecture varie selon le modèle. Le QR code reste disponible comme alternative.'],
  ['Faut-il installer une application ?','Non. Aucune application 5Tap n’est nécessaire pour ouvrir une carte ou un stand. Une connexion Internet est nécessaire pour afficher la destination.'],
  ['Quels sont les prix et les conditions de paiement ?','Les cartes de visite digitales commencent à 179 DH et la gamme Google Review à 149 DH. Les produits standard sont payés à la livraison. Une avance est demandée avant la préparation des produits personnalisés ; son montant et son moyen de paiement sont confirmés avec vous.'],
  ['Quels sont les délais de préparation et de livraison ?','La livraison est incluse partout au Maroc. Un produit standard est livré sous 2 jours maximum. Pour un produit personnalisé, comptez 1 à 2 jours de préparation après validation du visuel et réception de l’avance, puis 2 jours maximum pour la livraison.'],
  ['Comment transmettre mon logo pour un produit personnalisé ?','Après votre commande, notre équipe vous contacte sur WhatsApp pour recevoir votre logo et vos informations. Nous vous envoyons un visuel à valider avant de commencer la préparation.'],
  ['Puis-je choisir la destination de ma carte de visite ?','Oui. La carte peut ouvrir un profil regroupant vos coordonnées et vos liens, WhatsApp directement, Instagram directement ou un autre lien de votre choix.'],
  ['Puis-je modifier moi-même mes coordonnées plus tard ?','L’espace client permettant de modifier soi-même ses coordonnées est prévu pour une deuxième phase et n’est pas encore disponible. Contactez 5Tap pour connaître les possibilités de mise à jour actuellement proposées.'],
  ['Le dashboard à 79 DH/mois est-il obligatoire ?','Non. L’abonnement n’est pas obligatoire pour utiliser votre support. Le dashboard est une option séparée à 79 DH/mois pour les stands. Ses fonctionnalités seront publiées une fois leur périmètre final défini.'],
];

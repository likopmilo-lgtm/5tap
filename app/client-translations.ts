export type LanguageCode = 'fr' | 'en' | 'ar' | 'es';
export const languages: {code: LanguageCode; label: string; short: string; dir: 'ltr' | 'rtl'}[] = [
  {code: 'fr', label: 'Français', short: 'FR', dir: 'ltr'},
  {code: 'en', label: 'English', short: 'EN', dir: 'ltr'},
  {code: 'ar', label: 'العربية · الدارجة', short: 'AR', dir: 'rtl'},
  {code: 'es', label: 'Español', short: 'ES', dir: 'ltr'},
];
const en: Record<string, string> = {
'Livraison partout au Maroc':'Delivery across Morocco','Paiement à la livraison':'Cash on delivery','Accueil':'Home','La boutique':'Shop','Carte de visite NFC':'NFC business card','FAQ':'FAQ','Contact':'Contact','Trouver mon pack':'Find my pack','Un petit geste. Un grand impact.':'One small gesture. A big impact.','Faites bonne':'Make a strong','impression.':'impression.','En un seul tap.':'With one tap.','Partagez vos coordonnées avec une carte de visite digitale NFC, ou invitez vos clients à laisser un avis Google.':'Share your contact details with a digital NFC business card, or invite customers to leave a Google review.','Deux solutions, un même geste.':'Two solutions, one simple gesture.','À partir de':'Starting from','Ma carte de visite NFC':'My NFC business card','Mes supports avis Google':'My Google review supports','Sans application':'No app needed','Sans abonnement obligatoire':'No mandatory subscription','Votre univers, en un geste.':'Your world, in one gesture.','Coordonnées professionnelles ou avis Google.':'Professional details or Google reviews.','Installé avec vous, à Tanger':'Installed with you in Tangier','Configuration et prise en main incluses':'Setup and onboarding included','Payez à la réception':'Pay on delivery','Sans compte, sans complication':'No account, no hassle','Deux façons de créer le lien':'Two ways to connect','Votre réseau.':'Your network.','Votre réputation.':'Your reputation.','Carte de visite digitale':'Digital business card','Une rencontre.':'One meeting.','Toutes vos coordonnées.':'All your contact details.','Créer ma carte de visite':'Create my business card','Avis Google':'Google reviews','Un client satisfait.':'A satisfied customer.','Une expérience à partager.':'An experience to share.','Choisir mon support Google':'Choose my Google support','Simple, vraiment.':'Truly simple.','Un même geste.':'One gesture.','Deux possibilités.':'Two possibilities.','Carte Google Review':'Google Review Card','Pack Essentiel':'Essential Pack','Pack Pro':'Pro Pack','Pack Prestige':'Prestige Pack','Carte de visite digitale NFC':'Digital NFC business card','Voir le détail':'View details','Commander':'Order','Acheter maintenant':'Buy now','Quantité':'Quantity','Paiement à la livraison. Confirmez vos coordonnées à l’étape suivante.':'Cash on delivery. Confirm your details on the next step.','Checkout':'Checkout','Confirmez votre commande et vos coordonnées de livraison.':'Confirm your order and delivery details.','Votre commande':'Your order','Vos coordonnées':'Your details','Sans compte. Paiement en espèces à la livraison.':'No account. Cash payment on delivery.','Nom complet':'Full name','Téléphone':'Phone','Ville':'City','Adresse complète':'Full address','Personnalisation':'Customisation','Non personnalisé':'Not customised','Oui, je veux personnaliser':'Yes, I want customisation','Précisions (facultatif)':'Notes (optional)','Livraison':'Delivery','Gratuite':'Free','Adresse de livraison':'Delivery address','Précisions ou personnalisation (facultatif)':'Notes or customisation (optional)','Paiement à la livraison — espèces':'Cash on delivery','Enregistrer et préparer WhatsApp':'Save and prepare WhatsApp','Enregistrement…':'Saving…','Votre récapitulatif':'Order summary','Sous-total':'Subtotal','Total à payer':'Total to pay','Livraison à Tanger':'Delivery in Tangier','Livraison au Maroc':'Delivery in Morocco','Finalisez sur WhatsApp.':'Finish on WhatsApp.','Envoyer ma commande sur WhatsApp':'Send my order on WhatsApp','On en parle ?':'Let’s talk?','Envoyez-nous un message':'Send us a message','Préparer mon message':'Prepare my message','Ouvrir WhatsApp':'Open WhatsApp','Parlons sur WhatsApp':'Chat on WhatsApp'};
const ar: Record<string, string> = {
'Livraison partout au Maroc':'التوصيل فالمغرب كامل','Paiement à la livraison':'الخلاص حتى توصلك الطلبية','Accueil':'الرئيسية','La boutique':'المتجر','Carte de visite NFC':'كارت ڤيزيت NFC','FAQ':'أسئلة','Contact':'تواصل','Trouver mon pack':'نلقى الباك ديالي','Un petit geste. Un grand impact.':'حركة صغيرة، تأثير كبير.','Faites bonne':'خلي انطباع','impression.':'احترافي.','En un seul tap.':'غير بتاب وحدة.','Partagez vos coordonnées avec une carte de visite digitale NFC, ou invitez vos clients à laisser un avis Google.':'شارك معلوماتك بكارت ڤيزيت NFC، ولا خلي الكليان يديرو رأي فGoogle بسهولة.','Deux solutions, un même geste.':'جوج حلول بنفس الحركة.','À partir de':'ابتداء من','Ma carte de visite NFC':'كارت ڤيزيت NFC ديالي','Mes supports avis Google':'حاملات آراء Google','Sans application':'بلا تطبيق','Sans abonnement obligatoire':'بلا اشتراك إجباري','Votre univers, en un geste.':'العالم ديالك فحركة وحدة.','Coordonnées professionnelles ou avis Google.':'معلومات مهنية ولا آراء Google.','Installé avec vous, à Tanger':'نركبوه معاك فطنجة','Configuration et prise en main incluses':'الإعداد والشرح داخلين','Payez à la réception':'خلص ملي توصلك','Sans compte, sans complication':'بلا حساب، بلا تعقيد','Deux façons de créer le lien':'جوج طرق باش تربط التواصل','Votre réseau.':'العلاقات ديالك.','Votre réputation.':'السمعة ديالك.','Carte de visite digitale':'كارت ڤيزيت ديجيتال','Une rencontre.':'لقاء واحد.','Toutes vos coordonnées.':'كل المعلومات ديالك.','Créer ma carte de visite':'نوجد كارت ڤيزيت ديالي','Avis Google':'آراء Google','Un client satisfait.':'كليان فرحان.','Une expérience à partager.':'تجربة تستاهل تتشارك.','Choisir mon support Google':'نختار حامل Google','Simple, vraiment.':'ساهل بصح.','Un même geste.':'نفس الحركة.','Deux possibilités.':'جوج إمكانيات.','Carte Google Review':'كارت آراء Google','Pack Essentiel':'باك Essentiel','Pack Pro':'باك Pro','Pack Prestige':'باك Prestige','Carte de visite digitale NFC':'كارت ڤيزيت ديجيتال NFC','Voir le détail':'شوف التفاصيل','Commander':'طلب','Acheter maintenant':'شري دابا','Quantité':'الكمية','Paiement à la livraison. Confirmez vos coordonnées à l’étape suivante.':'الخلاص عند التوصيل. أكد المعلومات ديالك فالمرحلة الجاية.','Checkout':'تأكيد الطلبية','Confirmez votre commande et vos coordonnées de livraison.':'أكد الطلبية ومعلومات التوصيل.','Votre commande':'الطلبية ديالك','Vos coordonnées':'المعلومات ديالك','Sans compte. Paiement en espèces à la livraison.':'بلا حساب. الخلاص كاش عند التوصيل.','Nom complet':'الاسم الكامل','Téléphone':'التليفون','Ville':'المدينة','Adresse complète':'العنوان كامل','Personnalisation':'التخصيص','Non personnalisé':'بلا تخصيص','Oui, je veux personnaliser':'إيه، بغيت نخصص','Précisions (facultatif)':'ملاحظات (اختياري)','Livraison':'التوصيل','Gratuite':'فابور','Adresse de livraison':'عنوان التوصيل','Précisions ou personnalisation (facultatif)':'ملاحظات ولا تخصيص (اختياري)','Paiement à la livraison — espèces':'الخلاص كاش عند التوصيل','Enregistrer et préparer WhatsApp':'سجل وحضر WhatsApp','Enregistrement…':'كيتسجل…','Votre récapitulatif':'ملخص الطلبية','Sous-total':'المجموع الفرعي','Total à payer':'المجموع للخلاص','Livraison à Tanger':'التوصيل فطنجة','Livraison au Maroc':'التوصيل فالمغرب','Finalisez sur WhatsApp.':'كمل فالواتساب.','Envoyer ma commande sur WhatsApp':'صيفط الطلبية فالواتساب','On en parle ?':'نهضرو؟','Envoyez-nous un message':'صيفط لينا رسالة','Préparer mon message':'وجد الرسالة','Ouvrir WhatsApp':'حل WhatsApp','Parlons sur WhatsApp':'نهضرو فالواتساب'};
const es: Record<string, string> = {
'Livraison partout au Maroc':'Entrega en todo Marruecos','Paiement à la livraison':'Pago contra entrega','Accueil':'Inicio','La boutique':'Tienda','Carte de visite NFC':'Tarjeta de visita NFC','FAQ':'FAQ','Contact':'Contacto','Trouver mon pack':'Encontrar mi pack','Un petit geste. Un grand impact.':'Un pequeño gesto. Un gran impacto.','Faites bonne':'Causa una buena','impression.':'impresión.','En un seul tap.':'Con un solo tap.','Partagez vos coordonnées avec une carte de visite digitale NFC, ou invitez vos clients à laisser un avis Google.':'Comparte tus datos con una tarjeta digital NFC o invita a tus clientes a dejar una reseña en Google.','Deux solutions, un même geste.':'Dos soluciones, un mismo gesto.','À partir de':'Desde','Ma carte de visite NFC':'Mi tarjeta NFC','Mes supports avis Google':'Mis soportes de reseñas Google','Sans application':'Sin aplicación','Sans abonnement obligatoire':'Sin suscripción obligatoria','Votre univers, en un geste.':'Tu mundo, en un gesto.','Coordonnées professionnelles ou avis Google.':'Datos profesionales o reseñas Google.','Installé avec vous, à Tanger':'Instalado contigo en Tánger','Configuration et prise en main incluses':'Configuración y explicación incluidas','Payez à la réception':'Paga al recibir','Sans compte, sans complication':'Sin cuenta, sin complicaciones','Deux façons de créer le lien':'Dos formas de conectar','Votre réseau.':'Tu red.','Votre réputation.':'Tu reputación.','Carte de visite digitale':'Tarjeta digital','Une rencontre.':'Un encuentro.','Toutes vos coordonnées.':'Todos tus datos.','Créer ma carte de visite':'Crear mi tarjeta','Avis Google':'Reseñas Google','Un client satisfait.':'Un cliente satisfecho.','Une expérience à partager.':'Una experiencia para compartir.','Choisir mon support Google':'Elegir mi soporte Google','Simple, vraiment.':'Simple, de verdad.','Un même geste.':'Un mismo gesto.','Deux possibilités.':'Dos posibilidades.','Carte Google Review':'Tarjeta Google Review','Pack Essentiel':'Pack Esencial','Pack Pro':'Pack Pro','Pack Prestige':'Pack Prestige','Carte de visite digitale NFC':'Tarjeta de visita digital NFC','Voir le détail':'Ver detalle','Commander':'Pedir','Acheter maintenant':'Comprar ahora','Quantité':'Cantidad','Paiement à la livraison. Confirmez vos coordonnées à l’étape suivante.':'Pago contra entrega. Confirma tus datos en el siguiente paso.','Checkout':'Checkout','Confirmez votre commande et vos coordonnées de livraison.':'Confirma tu pedido y tus datos de entrega.','Votre commande':'Tu pedido','Vos coordonnées':'Tus datos','Sans compte. Paiement en espèces à la livraison.':'Sin cuenta. Pago en efectivo contra entrega.','Nom complet':'Nombre completo','Téléphone':'Teléfono','Ville':'Ciudad','Adresse complète':'Dirección completa','Personnalisation':'Personalización','Non personnalisé':'Sin personalizar','Oui, je veux personnaliser':'Sí, quiero personalizar','Précisions (facultatif)':'Notas (opcional)','Livraison':'Entrega','Gratuite':'Gratis','Adresse de livraison':'Dirección de entrega','Précisions ou personnalisation (facultatif)':'Notas o personalización (opcional)','Paiement à la livraison — espèces':'Pago en efectivo contra entrega','Enregistrer et préparer WhatsApp':'Guardar y preparar WhatsApp','Enregistrement…':'Guardando…','Votre récapitulatif':'Resumen del pedido','Sous-total':'Subtotal','Total à payer':'Total a pagar','Livraison à Tanger':'Entrega en Tánger','Livraison au Maroc':'Entrega en Marruecos','Finalisez sur WhatsApp.':'Finaliza en WhatsApp.','Envoyer ma commande sur WhatsApp':'Enviar mi pedido por WhatsApp','On en parle ?':'¿Hablamos?','Envoyez-nous un message':'Envíanos un mensaje','Préparer mon message':'Preparar mi mensaje','Ouvrir WhatsApp':'Abrir WhatsApp','Parlons sur WhatsApp':'Hablemos por WhatsApp'};

Object.assign(en, {
  'Offerte partout au Maroc': 'Free across Morocco',
  'Pour les particuliers et professionnels qui se présentent, et les commerces qui souhaitent recueillir des avis.': 'For people and professionals who want to share their details, and businesses that want more reviews.',
  'Présentez votre carte NFC et partagez votre profil de contact en un tap : téléphone, email, site et réseaux sociaux. Une carte personnalisée avec votre logo, pour particuliers, indépendants et professionnels.': 'Tap your NFC card to share your contact profile: phone, email, website and social links. A custom card with your logo for individuals, freelancers and professionals.',
  'Une carte ou un stand NFC pour ouvrir directement votre fiche Google. Invitez vos clients à partager leur expérience, au restaurant, au riad, au café ou en boutique.': 'A NFC card or stand that opens your Google profile directly. Invite customers to share their experience in your restaurant, riad, café or shop.',
  'Aucune application 5Tap à installer. Choisissez l’usage qui vous correspond.': 'No 5Tap app to install. Choose the use that fits your goal.',
  'Approchez votre carte': 'Tap your card',
  'Votre interlocuteur approche son téléphone de votre carte de visite NFC, ou utilise le QR code.': 'The person taps their phone on your NFC business card, or scans the QR code.',
  'Votre profil s’ouvre': 'Your profile opens',
  'Il découvre votre profil digital et les coordonnées et liens que vous avez choisis de partager.': 'They see your digital profile and the contact details and links you chose to share.',
  'Gardez le contact': 'Stay connected',
  'Il consulte vos coordonnées, vous contacte ou explore votre site et vos réseaux.': 'They save your details, contact you, or open your website and social links.',
  'Un tap ou un scan': 'Tap or scan',
  'Votre client approche son téléphone du support NFC ou scanne le QR code.': 'Your customer taps the NFC support or scans the QR code.',
  'Votre fiche Google s’ouvre': 'Your Google profile opens',
  'Il accède directement à votre fiche Google, sans chercher votre établissement.': 'They open your Google profile directly without searching for your business.',
  'Son expérience se partage': 'Their experience is shared',
  'Il rédige librement son avis et le publie depuis son compte Google.': 'They write their review freely and publish it from their Google account.',
  'Petit investissement. Nouvelles possibilités.': 'Small investment. New opportunities.',
  'Vos avis Google.': 'Your Google reviews.',
  'Votre pack.': 'Your pack.',
  'Toute la boutique': 'Full shop',
  'Illustrations de présentation de la gamme 5Tap. Livraison gratuite partout au Maroc.': '5Tap range preview images. Free delivery across Morocco.',
  'D’ici. Et à vos côtés.': 'Local, and by your side.',
  'À Tanger, on ne fait': 'In Tangier, we do more',
  'pas que livrer.': 'than delivery.',
  'On vient installer votre support, configurer votre lien et vous montrer le geste. Vous pouvez vous concentrer sur ce que vous faites le mieux : accueillir vos clients.': 'We install your support, configure your link and show you how it works. You focus on welcoming your customers.',
  'Rencontrer l’équipe 5Tap': 'Meet the 5Tap team',
  'Un service de proximité.': 'A local service.',
  '24 h standard · 48 h personnalisé': '24h standard · 48h custom',
  'Partout au Maroc': 'Across Morocco',
  'Environ 4 jours': 'About 4 days',
  'Installation à Tanger': 'Installation in Tangier',
  'Incluse': 'Included',
  'Au plus près de votre quotidien': 'Made for your daily work',
  'À chaque accueil,': 'At every welcome,',
  'une occasion de partager.': 'a chance to share.',
  'Au restaurant, au riad ou au café, placez 5Tap là où l’échange avec votre client se termine.': 'In a restaurant, riad or café, place 5Tap where the customer experience ends.',
  'Restaurants': 'Restaurants',
  'Au moment de l’addition, présentez la carte et invitez votre client à partager son expérience.': 'At the bill, present the card and invite your customer to share their experience.',
  'Riads & hôtels': 'Riads & hotels',
  'Un stand à la réception pour garder une trace de chaque beau séjour.': 'A stand at reception to capture every great stay.',
  'Cafés & commerces': 'Cafés & shops',
  'Au comptoir, le stand rend votre fiche Google accessible en un geste.': 'At the counter, the stand makes your Google profile one tap away.',
  'L’option qui vous suit': 'The option that follows you',
  'Votre lien évolue. Votre support reste.': 'Your link changes. Your support stays.',
  'Avec l’option dashboard, modifiez votre lien quand votre activité change. Un service facultatif, à activer avec notre équipe.': 'With the dashboard option, update your link whenever your business changes. Optional service, activated with our team.',
  'Parlons du dashboard': 'Ask about the dashboard',
  'Avant votre premier tap': 'Before your first tap',
  'Des questions ?': 'Questions?',
  'C’est tout naturel.': 'That is normal.',
  'Toutes les réponses': 'All answers',
  'Boutique': 'Shop',
  'La collection 5Tap': 'The 5Tap collection',
  'Le bon support.': 'The right support.',
  'Le bon geste.': 'The right gesture.',
  'Cartes de visite digitales pour vos contacts, cartes et stands Google pour vos avis. Dès 149 DH, livraison gratuite, personnalisation et configuration selon le produit choisi.': 'Digital business cards for contacts, Google cards and stands for reviews. From 149 DH, with customisation and setup depending on the product.',
  'Tout voir': 'View all',
  'Cartes de visite digitales': 'Digital business cards',
  'Stands & packs': 'Stands & packs',
  'Illustrations de la gamme, non contractuelles. Pour les produits personnalisés, le visuel est validé avec vous avant préparation.': 'Preview images only. For custom products, the design is confirmed with you before preparation.',
  'On vous explique tout': 'Everything explained',
  'Simple jusque': 'Simple even',
  'dans les réponses.': 'in the answers.',
  'Une question plus précise ?': 'Need a precise answer?',
  'Parlons de votre commerce et de votre projet.': 'Tell us about your business and your project.',
  'Écrivez-nous sur WhatsApp': 'Message us on WhatsApp',
  'Tout commence par un échange': 'It starts with a conversation',
  'Une question, une démonstration ou une idée de personnalisation ? Notre équipe à Tanger vous accompagne.': 'A question, demo or custom idea? Our team in Tangier can help.',
  'Appelez-nous': 'Call us',
  'Installation sur rendez-vous à Tanger.': 'Installation by appointment in Tangier.',
  'Livraison dans tout le Maroc.': 'Delivery across Morocco.',
  'Votre nom': 'Your name',
  'Sujet': 'Subject',
  'Votre message': 'Your message',
  'Votre message est prêt. Appuyez sur « Envoyer » dans WhatsApp pour nous le transmettre.': 'Your message is ready. Press Send in WhatsApp to send it to us.',
  'Dernière étape': 'Last step',
  'Chargement de votre commande…': 'Loading your order…',
  'Choisissez votre produit.': 'Choose your product.',
  'Retour à la boutique': 'Back to shop',
  'Commande reçue': 'Order received',
  'Merci, votre commande est enregistrée.': 'Thank you, your order is saved.',
  'Référence courte :': 'Short reference:',
  'Notre équipe vous contactera sur téléphone ou WhatsApp pour confirmer la préparation et la livraison.': 'Our team will contact you by phone or WhatsApp to confirm preparation and delivery.',
  'Confirmer ma commande': 'Confirm my order',
  'Votre commande sera enregistrée directement. Notre équipe vous contactera pour confirmer les détails.': 'Your order will be saved directly. Our team will contact you to confirm the details.',
  'Votre prochain tap commence ici.': 'Your next tap starts here.',
  'Votre panier est encore vide. Découvrez le support qui vous correspond.': 'Your cart is empty. Discover the support that fits you.',
  'Découvrir la boutique': 'Discover the shop',
  'Retirer': 'Remove',
  'Installation incluse à Tanger, sur rendez-vous.': 'Installation included in Tangier, by appointment.',
  'Téléphones compatibles NFC, QR code en alternative': 'NFC-compatible phones, QR code as backup',
  'Envoyez votre logo sur WhatsApp après la commande. Votre visuel est validé avec vous avant préparation.': 'Send your logo on WhatsApp after ordering. Your design is confirmed with you before preparation.',
  'Illustration de présentation de la gamme.': 'Product range preview image.',
  'Carte Google Review': 'Google Review Card',
  'Le geste essentiel': 'The essential gesture',
  'Votre fiche Google à portée de main. Une carte à présenter à vos clients, où que vous soyez.': 'Your Google profile at hand. A card to show customers anywhere.',
  '1 carte NFC Google Review': '1 NFC Google Review card',
  'Lien Google configuré': 'Google link configured',
  'QR code en alternative': 'QR code backup',
  'Pour bien démarrer': 'To get started',
  'Le duo idéal pour votre comptoir : un stand visible et une carte toujours à portée de main.': 'The ideal counter duo: a visible stand and a card always within reach.',
  '1 stand standard': '1 standard stand',
  'Configuration incluse': 'Setup included',
  'Notre recommandation': 'Our recommendation',
  'Un stand à l’accueil, deux cartes en salle. Multipliez les occasions de recueillir un avis.': 'One stand at reception, two cards in the room. More chances to collect reviews.',
  '2 cartes NFC Google Review': '2 NFC Google Review cards',
  'À votre image': 'Made for your brand',
  'Un stand premium personnalisé pour faire de chaque détail une signature de votre marque.': 'A custom premium stand that makes every detail feel like your brand.',
  '1 stand premium personnalisé': '1 custom premium stand',
  'Personnalisation du stand avec votre logo': 'Stand customisation with your logo',
  'Une rencontre. Une connexion.': 'One meeting. One connection.',
  'Pour particuliers et professionnels : partagez votre profil digital, vos coordonnées et vos liens avec une carte NFC personnalisée à votre logo.': 'For individuals and professionals: share your digital profile, contact details and links with a custom NFC card.',
  '1 carte NFC personnalisée': '1 custom NFC card',
  'Votre logo et vos coordonnées': 'Your logo and contact details',
  'Profil de contact et liens configurés': 'Contact profile and links configured'
});

Object.assign(ar, {
  'Offerte partout au Maroc': 'فابور فالمغرب كامل',
  'Pour les particuliers et professionnels qui se présentent, et les commerces qui souhaitent recueillir des avis.': 'للناس والمهنيين اللي بغاو يشاركو الكونتاكت ديالهم، وللمحلات اللي بغاو يزيدو الآراء.',
  'Présentez votre carte NFC et partagez votre profil de contact en un tap : téléphone, email, site et réseaux sociaux. Une carte personnalisée avec votre logo, pour particuliers, indépendants et professionnels.': 'قدم الكارت NFC ديالك وشارك البروفيل ديالك فتاب وحدة: تليفون، إيميل، موقع وروابط السوشيال. كارت مخصصة باللوغو ديالك.',
  'Une carte ou un stand NFC pour ouvrir directement votre fiche Google. Invitez vos clients à partager leur expérience, au restaurant, au riad, au café ou en boutique.': 'كارت ولا ستاند NFC كتحل فيشة Google مباشرة. خلي الكليان يشاركو التجربة ديالهم فريسطو، رياض، قهوة ولا محل.',
  'Aucune application 5Tap à installer. Choisissez l’usage qui vous correspond.': 'ما محتاج حتى تطبيق 5Tap. اختار الاستعمال اللي مناسب ليك.',
  'Approchez votre carte': 'قرب الكارت ديالك',
  'Votre interlocuteur approche son téléphone de votre carte de visite NFC, ou utilise le QR code.': 'الشخص كيقرب التليفون من كارت الزيارة NFC ولا كيسكاني QR code.',
  'Votre profil s’ouvre': 'البروفيل ديالك كيتحل',
  'Il découvre votre profil digital et les coordonnées et liens que vous avez choisis de partager.': 'كيبان ليه البروفيل ديجيتال والمعلومات والروابط اللي بغيتي تشارك.',
  'Gardez le contact': 'بقاو على تواصل',
  'Il consulte vos coordonnées, vous contacte ou explore votre site et vos réseaux.': 'كيشوف الكونتاكت ديالك، كيتاصل بيك ولا كيدخل للموقع والسوشيال ديالك.',
  'Un tap ou un scan': 'تاب ولا سكان',
  'Votre client approche son téléphone du support NFC ou scanne le QR code.': 'الكليان كيقرب التليفون من NFC ولا كيسكاني QR code.',
  'Votre fiche Google s’ouvre': 'فيشة Google ديالك كتحل',
  'Il accède directement à votre fiche Google, sans chercher votre établissement.': 'كيدخل مباشرة لفيشة Google بلا ما يقلب على المحل ديالك.',
  'Son expérience se partage': 'التجربة ديالو كتشارك',
  'Il rédige librement son avis et le publie depuis son compte Google.': 'كيكتب الرأي ديالو بحرية وكيpublihih من حساب Google ديالو.',
  'Petit investissement. Nouvelles possibilités.': 'استثمار صغير، فرص كبار.',
  'Vos avis Google.': 'آراء Google ديالك.',
  'Votre pack.': 'الباك ديالك.',
  'Toute la boutique': 'شوف المتجر كامل',
  'Illustrations de présentation de la gamme 5Tap. Livraison gratuite partout au Maroc.': 'الصور غير للتقديم. التوصيل فابور فالمغرب كامل.',
  'D’ici. Et à vos côtés.': 'من هنا، ومعاك.',
  'À Tanger, on ne fait': 'فطنجة، ما كنكتافيوش',
  'pas que livrer.': 'غير بالتوصيل.',
  'On vient installer votre support, configurer votre lien et vous montrer le geste. Vous pouvez vous concentrer sur ce que vous faites le mieux : accueillir vos clients.': 'كنجيو نركبو السوبور، نوجد الرابط ونوريك كيفاش يخدم. نتا ركز على استقبال الكليان ديالك.',
  'Rencontrer l’équipe 5Tap': 'تلاقى مع فريق 5Tap',
  'Un service de proximité.': 'خدمة قريبة منك.',
  '24 h standard · 48 h personnalisé': '24 ساعة للستاندار · 48 ساعة للمخصص',
  'Partout au Maroc': 'فالمغرب كامل',
  'Environ 4 jours': 'حوالي 4 أيام',
  'Installation à Tanger': 'التركيب فطنجة',
  'Incluse': 'داخل فالثمن',
  'Au plus près de votre quotidien': 'خدمة مناسبة ليومك',
  'À chaque accueil,': 'كل مرة كتستقبل فيها،',
  'une occasion de partager.': 'فرصة باش يتشارك الرأي.',
  'Au restaurant, au riad ou au café, placez 5Tap là où l’échange avec votre client se termine.': 'فريسطو، رياض ولا قهوة، حط 5Tap فين كيسالي التواصل مع الكليان.',
  'Restaurants': 'ريسطورات',
  'Au moment de l’addition, présentez la carte et invitez votre client à partager son expérience.': 'وقت الحساب، عطيو الكارت وخليه يشارك التجربة ديالو.',
  'Riads & hôtels': 'رياضات وأوطيلات',
  'Un stand à la réception pour garder une trace de chaque beau séjour.': 'ستاند فالريسيبسيون باش كل إقامة زوينة تخلي أثر.',
  'Cafés & commerces': 'قهاوي ومحلات',
  'Au comptoir, le stand rend votre fiche Google accessible en un geste.': 'فالكونطوار، الستاند كيخلي فيشة Google قريبة بتاب وحدة.',
  'L’option qui vous suit': 'أوبسيون كتبقى معاك',
  'Votre lien évolue. Votre support reste.': 'الرابط يتبدل، والسوبور يبقى.',
  'Avec l’option dashboard, modifiez votre lien quand votre activité change. Un service facultatif, à activer avec notre équipe.': 'مع dashboard تقدر تبدل الرابط ملي النشاط ديالك يتبدل. خدمة اختيارية كتفعلها مع الفريق.',
  'Parlons du dashboard': 'نهضرو على dashboard',
  'Avant votre premier tap': 'قبل أول تاب',
  'Des questions ?': 'عندك أسئلة؟',
  'C’est tout naturel.': 'عادي بزاف.',
  'Toutes les réponses': 'جميع الأجوبة',
  'Boutique': 'المتجر',
  'La collection 5Tap': 'كوليكسيون 5Tap',
  'Le bon support.': 'السوبور المناسب.',
  'Le bon geste.': 'الحركة المناسبة.',
  'Cartes de visite digitales pour vos contacts, cartes et stands Google pour vos avis. Dès 149 DH, livraison gratuite, personnalisation et configuration selon le produit choisi.': 'كروت زيارة ديجيتال للكونتاكت، وكروت وستاندات Google للآراء. ابتداء من 149 درهم، مع التخصيص والإعداد حسب المنتج.',
  'Tout voir': 'شوف الكل',
  'Cartes de visite digitales': 'كروت زيارة ديجيتال',
  'Stands & packs': 'ستاندات وباكات',
  'Illustrations de la gamme, non contractuelles. Pour les produits personnalisés, le visuel est validé avec vous avant préparation.': 'الصور غير للتقديم. فالمنتجات المخصصة، كنصادقة معاك على التصميم قبل التحضير.',
  'On vous explique tout': 'كنشرحو ليك كلشي',
  'Simple jusque': 'ساهل حتى',
  'dans les réponses.': 'فالأجوبة.',
  'Une question plus précise ?': 'عندك سؤال محدد؟',
  'Parlons de votre commerce et de votre projet.': 'نهضرو على المحل والمشروع ديالك.',
  'Écrivez-nous sur WhatsApp': 'كتب لينا فالواتساب',
  'Tout commence par un échange': 'كلشي كيبدا بهضرة',
  'Une question, une démonstration ou une idée de personnalisation ? Notre équipe à Tanger vous accompagne.': 'سؤال، ديمو ولا فكرة تخصيص؟ الفريق ديالنا فطنجة معاك.',
  'Appelez-nous': 'عيط لينا',
  'Installation sur rendez-vous à Tanger.': 'التركيب بموعد فطنجة.',
  'Livraison dans tout le Maroc.': 'التوصيل فالمغرب كامل.',
  'Votre nom': 'الاسم ديالك',
  'Sujet': 'الموضوع',
  'Votre message': 'الرسالة ديالك',
  'Votre message est prêt. Appuyez sur « Envoyer » dans WhatsApp pour nous le transmettre.': 'الرسالة واجدة. ضغط على إرسال فالواتساب باش توصلنا.',
  'Dernière étape': 'آخر خطوة',
  'Chargement de votre commande…': 'كنحضرو الطلبية ديالك…',
  'Choisissez votre produit.': 'اختار المنتج ديالك.',
  'Retour à la boutique': 'رجوع للمتجر',
  'Commande reçue': 'توصلنا بالطلبية',
  'Merci, votre commande est enregistrée.': 'شكرا، الطلبية ديالك تسجلات.',
  'Référence courte :': 'المرجع القصير:',
  'Notre équipe vous contactera sur téléphone ou WhatsApp pour confirmer la préparation et la livraison.': 'الفريق ديالنا غادي يتاصل بيك بالتليفون ولا واتساب باش يأكد التحضير والتوصيل.',
  'Confirmer ma commande': 'نأكد الطلبية',
  'Votre commande sera enregistrée directement. Notre équipe vous contactera pour confirmer les détails.': 'الطلبية غادي تسجل مباشرة. الفريق غادي يتاصل بيك باش يأكد التفاصيل.',
  'Votre prochain tap commence ici.': 'التاب الجاي ديالك كيبدا هنا.',
  'Votre panier est encore vide. Découvrez le support qui vous correspond.': 'البانيي باقي خاوي. شوف السوبور اللي مناسب ليك.',
  'Découvrir la boutique': 'شوف المتجر',
  'Retirer': 'حيد',
  'Installation incluse à Tanger, sur rendez-vous.': 'التركيب داخل فالثمن فطنجة، بموعد.',
  'Téléphones compatibles NFC, QR code en alternative': 'تليفونات كتخدم ب NFC، و QR code كبديل',
  'Envoyez votre logo sur WhatsApp après la commande. Votre visuel est validé avec vous avant préparation.': 'صيفط اللوغو فالواتساب من بعد الطلبية. كنصادقة معاك على التصميم قبل التحضير.',
  'Illustration de présentation de la gamme.': 'صورة للتقديم ديال المنتجات.',
  'Le geste essentiel': 'الحركة الأساسية',
  'Votre fiche Google à portée de main. Une carte à présenter à vos clients, où que vous soyez.': 'فيشة Google ديالك قريبة. كارت كتقدمها للكليان فين ما كنتي.',
  '1 carte NFC Google Review': '1 كارت NFC لآراء Google',
  'Lien Google configuré': 'رابط Google موجد',
  'QR code en alternative': 'QR code كبديل',
  'Pour bien démarrer': 'باش تبدا مزيان',
  'Le duo idéal pour votre comptoir : un stand visible et une carte toujours à portée de main.': 'الديو المثالي للكونطوار: ستاند باين وكارت ديما قريبة.',
  '1 stand standard': '1 ستاند عادي',
  'Configuration incluse': 'الإعداد داخل فالثمن',
  'Notre recommandation': 'اختيارنا المقترح',
  'Un stand à l’accueil, deux cartes en salle. Multipliez les occasions de recueillir un avis.': 'ستاند فالاستقبال وجوج كروت فالقاعة. زيد فرص جمع الآراء.',
  '2 cartes NFC Google Review': '2 كروت NFC لآراء Google',
  'À votre image': 'على الصورة ديال البراند ديالك',
  'Un stand premium personnalisé pour faire de chaque détail une signature de votre marque.': 'ستاند بريميوم مخصص باش كل تفصيل يبين البراند ديالك.',
  '1 stand premium personnalisé': '1 ستاند بريميوم مخصص',
  'Personnalisation du stand avec votre logo': 'تخصيص الستاند باللوغو ديالك',
  'Pour particuliers et professionnels : partagez votre profil digital, vos coordonnées et vos liens avec une carte NFC personnalisée à votre logo.': 'للأفراد والمهنيين: شارك البروفيل ديجيتال، الكونتاكت والروابط ديالك بكارت NFC مخصصة باللوغو.',
  '1 carte NFC personnalisée': '1 كارت NFC مخصصة',
  'Votre logo et vos coordonnées': 'اللوغو والكونتاكت ديالك',
  'Profil de contact et liens configurés': 'بروفيل الكونتاكت والروابط موجدين'
});

Object.assign(es, {
  'Offerte partout au Maroc': 'Gratis en todo Marruecos',
  'Pour les particuliers et professionnels qui se présentent, et les commerces qui souhaitent recueillir des avis.': 'Para personas y profesionales que quieren compartir sus datos, y negocios que quieren recibir más reseñas.',
  'Présentez votre carte NFC et partagez votre profil de contact en un tap : téléphone, email, site et réseaux sociaux. Une carte personnalisée avec votre logo, pour particuliers, indépendants et professionnels.': 'Presenta tu tarjeta NFC y comparte tu perfil de contacto con un tap: teléfono, email, web y redes sociales. Una tarjeta personalizada con tu logo.',
  'Une carte ou un stand NFC pour ouvrir directement votre fiche Google. Invitez vos clients à partager leur expérience, au restaurant, au riad, au café ou en boutique.': 'Una tarjeta o soporte NFC que abre directamente tu ficha de Google. Invita a tus clientes a compartir su experiencia.',
  'Aucune application 5Tap à installer. Choisissez l’usage qui vous correspond.': 'Sin instalar ninguna app de 5Tap. Elige el uso que necesitas.',
  'Approchez votre carte': 'Acerca tu tarjeta',
  'Votre profil s’ouvre': 'Se abre tu perfil',
  'Gardez le contact': 'Mantén el contacto',
  'Un tap ou un scan': 'Un tap o un escaneo',
  'Votre fiche Google s’ouvre': 'Se abre tu ficha Google',
  'Son expérience se partage': 'La experiencia se comparte',
  'Petit investissement. Nouvelles possibilités.': 'Pequeña inversión. Nuevas posibilidades.',
  'Toute la boutique': 'Toda la tienda',
  'D’ici. Et à vos côtés.': 'Local y a tu lado.',
  'À Tanger, on ne fait': 'En Tánger hacemos más',
  'pas que livrer.': 'que entregar.',
  'Rencontrer l’équipe 5Tap': 'Conocer al equipo 5Tap',
  'Un service de proximité.': 'Un servicio cercano.',
  '24 h standard · 48 h personnalisé': '24 h estándar · 48 h personalizado',
  'Partout au Maroc': 'En todo Marruecos',
  'Environ 4 jours': 'Unos 4 días',
  'Installation à Tanger': 'Instalación en Tánger',
  'Incluse': 'Incluida',
  'Boutique': 'Tienda',
  'La collection 5Tap': 'La colección 5Tap',
  'Le bon support.': 'El soporte correcto.',
  'Le bon geste.': 'El gesto correcto.',
  'Tout voir': 'Ver todo',
  'Cartes de visite digitales': 'Tarjetas digitales',
  'Stands & packs': 'Soportes y packs',
  'Dernière étape': 'Último paso',
  'Chargement de votre commande…': 'Cargando tu pedido…',
  'Choisissez votre produit.': 'Elige tu producto.',
  'Retour à la boutique': 'Volver a la tienda',
  'Commande reçue': 'Pedido recibido',
  'Merci, votre commande est enregistrée.': 'Gracias, tu pedido está registrado.',
  'Référence courte :': 'Referencia corta:',
  'Notre équipe vous contactera sur téléphone ou WhatsApp pour confirmer la préparation et la livraison.': 'Nuestro equipo te contactará por teléfono o WhatsApp para confirmar la preparación y entrega.',
  'Confirmer ma commande': 'Confirmar mi pedido',
  'Votre commande sera enregistrée directement. Notre équipe vous contactera pour confirmer les détails.': 'Tu pedido se registrará directamente. Nuestro equipo te contactará para confirmar los detalles.',
  'Retirer': 'Quitar',
  'Téléphones compatibles NFC, QR code en alternative': 'Teléfonos compatibles con NFC, QR como alternativa',
  'Envoyez votre logo sur WhatsApp après la commande. Votre visuel est validé avec vous avant préparation.': 'Envía tu logo por WhatsApp después del pedido. Validamos el diseño contigo antes de prepararlo.',
  'Illustration de présentation de la gamme.': 'Imagen de presentación de la gama.',
  'Le geste essentiel': 'El gesto esencial',
  'Votre fiche Google à portée de main. Une carte à présenter à vos clients, où que vous soyez.': 'Tu ficha Google siempre a mano. Una tarjeta para presentar a tus clientes donde estés.',
  'Lien Google configuré': 'Enlace Google configurado',
  'QR code en alternative': 'QR como alternativa',
  'Pour bien démarrer': 'Para empezar bien',
  'Configuration incluse': 'Configuración incluida',
  'Notre recommandation': 'Nuestra recomendación',
  'À votre image': 'A tu imagen',
  'Une rencontre. Une connexion.': 'Un encuentro. Una conexión.'
});


Object.assign(en, {
  'Ils nous font confiance':'They trust us','Des clients rassurés.':'Reassured customers.','Des avis plus simples.':'Simpler reviews.','Restaurants, cafés, riads et professionnels à Tanger utilisent 5Tap pour faciliter le contact avec leurs clients.':'Restaurants, cafés, riads and professionals in Tangier use 5Tap to make customer contact easier.','Riad à Tanger':'Riad in Tangier','Le stand est propre sur le comptoir et les clients comprennent tout de suite quoi faire. On a gagné en avis sans déranger personne.':'The stand looks clean on the counter and customers immediately understand what to do. We gained reviews without bothering anyone.','Installation faite sur place':'Installed on site','Café local':'Local café','La carte Google Review est simple à présenter après le service. Le paiement à la livraison et la configuration incluse nous ont rassurés.':'The Google Review card is easy to present after service. Cash on delivery and included setup reassured us.','Commande facile':'Easy order','Consultant indépendant':'Independent consultant','Ma carte de visite NFC fait plus professionnel qu’une carte classique. Je partage mes coordonnées et mes liens en quelques secondes.':'My NFC business card feels more professional than a classic card. I share my details and links in seconds.','Carte personnalisée':'Custom card','Prix accessibles dès 149 DH':'Accessible prices from 149 DH','Installation à Tanger':'Installation in Tangier'
});


Object.assign(ar, {
  'Ils nous font confiance':'كيتيقو فينا','Des clients rassurés.':'كليان مطمئنين.','Des avis plus simples.':'آراء أسهل.','Restaurants, cafés, riads et professionnels à Tanger utilisent 5Tap pour faciliter le contact avec leurs clients.':'ريسطورات، قهاوي، رياضات ومهنيين فطنجة كيستعملو 5Tap باش يسهل التواصل مع الكليان.','Riad à Tanger':'رياض فطنجة','Le stand est propre sur le comptoir et les clients comprennent tout de suite quoi faire. On a gagné en avis sans déranger personne.':'الستاند كيبان نقي فالكونطوار والكليان كيعرفو مباشرة آش يديرو. زدنا فالآراء بلا ما نزعجو حتى واحد.','Installation faite sur place':'التركيب تدار فبلاصتو','Café local':'قهوة محلية','La carte Google Review est simple à présenter après le service. Le paiement à la livraison et la configuration incluse nous ont rassurés.':'كارت Google Review سهلة باش تقدمها من بعد الخدمة. الخلاص عند التوصيل والإعداد داخل فالثمن طمأنونا.','Commande facile':'طلبية سهلة','Consultant indépendant':'مستشار مستقل','Ma carte de visite NFC fait plus professionnel qu’une carte classique. Je partage mes coordonnées et mes liens en quelques secondes.':'كارت الزيارة NFC ديالي كتبان بروفيشنال أكثر من الكارت العادية. كنشارك الكونتاكت والروابط فثواني.','Carte personnalisée':'كارت مخصصة','Prix accessibles dès 149 DH':'أثمنة مناسبة من 149 درهم','Installation à Tanger':'التركيب فطنجة'
});


Object.assign(es, {
  'Ils nous font confiance':'Confían en nosotros','Des clients rassurés.':'Clientes tranquilos.','Des avis plus simples.':'Reseñas más simples.','Restaurants, cafés, riads et professionnels à Tanger utilisent 5Tap pour faciliter le contact avec leurs clients.':'Restaurantes, cafés, riads y profesionales en Tánger usan 5Tap para facilitar el contacto con sus clientes.','Riad à Tanger':'Riad en Tánger','Le stand est propre sur le comptoir et les clients comprennent tout de suite quoi faire. On a gagné en avis sans déranger personne.':'El soporte se ve limpio en el mostrador y los clientes entienden rápido qué hacer. Ganamos reseñas sin molestar a nadie.','Installation faite sur place':'Instalado en el local','Café local':'Café local','La carte Google Review est simple à présenter après le service. Le paiement à la livraison et la configuration incluse nous ont rassurés.':'La tarjeta Google Review es fácil de presentar después del servicio. El pago contra entrega y la configuración incluida nos dieron confianza.','Commande facile':'Pedido fácil','Consultant indépendant':'Consultor independiente','Ma carte de visite NFC fait plus professionnel qu’une carte classique. Je partage mes coordonnées et mes liens en quelques secondes.':'Mi tarjeta NFC se ve más profesional que una tarjeta clásica. Comparto mis datos y enlaces en segundos.','Carte personnalisée':'Tarjeta personalizada','Prix accessibles dès 149 DH':'Precios accesibles desde 149 DH'
});

Object.assign(en, {
  'Numéro WhatsApp':'WhatsApp number',
  'Utilisé pour identifier et confirmer votre commande.':'Used to identify and confirm your order.',
  'Confirmer et ouvrir WhatsApp':'Confirm and open WhatsApp',
  'Après l’enregistrement, WhatsApp s’ouvrira avec votre commande. Appuyez sur « Envoyer » pour nous la transmettre.':'After your order is saved, WhatsApp will open with the order details. Tap “Send” to send it to us.',
  'WhatsApp s’est ouvert avec le récapitulatif. Appuyez sur « Envoyer » pour transmettre votre confirmation à 5Tap.':'WhatsApp opened with your order summary. Tap “Send” to confirm it with 5Tap.',
  'Ouvrir WhatsApp et envoyer':'Open WhatsApp and send',
  'Utilisé pour vous envoyer la confirmation de commande.':'Used to send your order confirmation.',
  'En confirmant, vous acceptez de recevoir sur WhatsApp les messages liés à cette commande. Vous pourrez répondre pour confirmer ou demander une modification.':'By confirming, you agree to receive WhatsApp messages about this order. You can reply to confirm or request a change.',
  'Un message de confirmation vient de vous être envoyé sur WhatsApp. Répondez pour confirmer ou demander une modification.':'A confirmation message has just been sent to you on WhatsApp. Reply to confirm or request a change.',
  'Votre commande est bien enregistrée. Notre équipe vous contactera rapidement pour la confirmer.':'Your order has been saved. Our team will contact you shortly to confirm it.'
});

Object.assign(ar, {
  'Numéro WhatsApp':'نمرة واتساب',
  'Utilisé pour identifier et confirmer votre commande.':'غادي نستعملو النمرة باش نعرفو ونأكدو الطلبية ديالك.',
  'Confirmer et ouvrir WhatsApp':'أكد وحل واتساب',
  'Après l’enregistrement, WhatsApp s’ouvrira avec votre commande. Appuyez sur « Envoyer » pour nous la transmettre.':'من بعد ما تتسجل الطلبية، غادي يتحل واتساب وفيه التفاصيل. كليك على «إرسال» باش توصلنا.',
  'WhatsApp s’est ouvert avec le récapitulatif. Appuyez sur « Envoyer » pour transmettre votre confirmation à 5Tap.':'تحل واتساب وفيه ملخص الطلبية. كليك على «إرسال» باش تأكدها مع 5Tap.',
  'Ouvrir WhatsApp et envoyer':'حل واتساب وصيفط',
  'Utilisé pour vous envoyer la confirmation de commande.':'غادي نستعملوها باش نصيفطو ليك تأكيد الطلبية.',
  'En confirmant, vous acceptez de recevoir sur WhatsApp les messages liés à cette commande. Vous pourrez répondre pour confirmer ou demander une modification.':'ملي كتأكد، كتوافق توصلك فواتساب الرسائل الخاصة بهاد الطلبية. تقدر تجاوب باش تأكد ولا تطلب تغيير.',
  'Un message de confirmation vient de vous être envoyé sur WhatsApp. Répondez pour confirmer ou demander une modification.':'صيفطنا ليك دابا رسالة التأكيد فواتساب. جاوب باش تأكد ولا تطلب تغيير.',
  'Votre commande est bien enregistrée. Notre équipe vous contactera rapidement pour la confirmer.':'الطلبية ديالك تسجلات. الفريق غادي يتاصل بيك قريب باش يأكدها.'
});

Object.assign(es, {
  'Numéro WhatsApp':'Número de WhatsApp',
  'Utilisé pour identifier et confirmer votre commande.':'Se utiliza para identificar y confirmar tu pedido.',
  'Confirmer et ouvrir WhatsApp':'Confirmar y abrir WhatsApp',
  'Après l’enregistrement, WhatsApp s’ouvrira avec votre commande. Appuyez sur « Envoyer » pour nous la transmettre.':'Después de guardar el pedido, se abrirá WhatsApp con los detalles. Pulsa «Enviar» para mandárnoslo.',
  'WhatsApp s’est ouvert avec le récapitulatif. Appuyez sur « Envoyer » pour transmettre votre confirmation à 5Tap.':'WhatsApp se abrió con el resumen del pedido. Pulsa «Enviar» para confirmarlo con 5Tap.',
  'Ouvrir WhatsApp et envoyer':'Abrir WhatsApp y enviar',
  'Utilisé pour vous envoyer la confirmation de commande.':'Se utiliza para enviarte la confirmación del pedido.',
  'En confirmant, vous acceptez de recevoir sur WhatsApp les messages liés à cette commande. Vous pourrez répondre pour confirmer ou demander une modification.':'Al confirmar, aceptas recibir por WhatsApp mensajes relacionados con este pedido. Podrás responder para confirmar o solicitar un cambio.',
  'Un message de confirmation vient de vous être envoyé sur WhatsApp. Répondez pour confirmer ou demander une modification.':'Te acabamos de enviar un mensaje de confirmación por WhatsApp. Responde para confirmar o solicitar un cambio.',
  'Votre commande est bien enregistrée. Notre équipe vous contactera rapidement pour la confirmer.':'Tu pedido está registrado. Nuestro equipo te contactará pronto para confirmarlo.'
});

export const dictionaries: Record<Exclude<LanguageCode, 'fr'>, Record<string, string>> = {en, ar, es};
export function getInitialLanguage(): LanguageCode {if(typeof window==='undefined')return 'fr';const query=new URLSearchParams(window.location.search).get('lang') as LanguageCode|null;let saved:LanguageCode|null=null;try{saved=localStorage.getItem('5tap-lang') as LanguageCode|null}catch{};const value=query||saved||'fr';return languages.some(l=>l.code===value)?value:'fr'}
function replaceExact(value:string,lang:LanguageCode){if(lang==='fr')return value;const translated=dictionaries[lang][value.trim()];return translated?value.replace(value.trim(),translated):value}
export function applyClientTranslations(lang:LanguageCode){if(typeof document==='undefined')return;const language=languages.find(item=>item.code===lang)||languages[0];document.documentElement.lang=lang==='ar'?'ar-MA':lang;document.documentElement.dir=language.dir;document.body.classList.toggle('rtl',language.dir==='rtl');if(lang==='fr')return;const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){const parent=node.parentElement;if(!parent||['SCRIPT','STYLE','TEXTAREA'].includes(parent.tagName)||parent.closest('.language-switcher, [data-no-translate]'))return NodeFilter.FILTER_REJECT;return node.textContent?.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});const nodes:Text[]=[];while(walker.nextNode())nodes.push(walker.currentNode as Text);nodes.forEach(node=>{node.textContent=replaceExact(node.textContent||'',lang)});document.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('[placeholder]').forEach(input=>{input.placeholder=replaceExact(input.placeholder,lang)})}


Object.assign(en, {
  'Livraison gratuite partout au Maroc.':'Free delivery across Morocco.',
  'Si vous choisissez oui, on vous contacte pour recevoir le logo ou les détails.':'If you choose yes, we will contact you to receive the logo or details.',
  'À Tanger : 24 h standard ou 48 h personnalisé. Maroc : environ 4 jours.':'Tangier: 24h standard or 48h custom. Morocco: around 4 days.',
  'Adresse :':'Address:',
  'Personnalisation :':'Customisation:',
  'Livraison : gratuite':'Delivery: free'
});
Object.assign(ar, {
  'Livraison gratuite partout au Maroc.':'التوصيل فابور فالمغرب كامل.',
  'Si vous choisissez oui, on vous contacte pour recevoir le logo ou les détails.':'إلى ختاريتي نعم، غادي نتاصلو بيك باش ناخدو اللوغو ولا التفاصيل.',
  'À Tanger : 24 h standard ou 48 h personnalisé. Maroc : environ 4 jours.':'فطنجة: 24 ساعة للستاندار ولا 48 ساعة للمخصص. المغرب: حوالي 4 أيام.',
  'Adresse :':'العنوان:',
  'Personnalisation :':'التخصيص:',
  'Livraison : gratuite':'التوصيل: فابور'
});
Object.assign(es, {
  'Livraison gratuite partout au Maroc.':'Entrega gratuita en todo Marruecos.',
  'Si vous choisissez oui, on vous contacte pour recevoir le logo ou les détails.':'Si eliges sí, te contactaremos para recibir el logo o los detalles.',
  'À Tanger : 24 h standard ou 48 h personnalisé. Maroc : environ 4 jours.':'Tánger: 24 h estándar o 48 h personalizado. Marruecos: unos 4 días.',
  'Adresse :':'Dirección:',
  'Personnalisation :':'Personalización:',
  'Livraison : gratuite':'Entrega: gratis'
});


Object.assign(en, {'Livraison gratuite':'Free delivery','Livraison gratuite partout au Maroc':'Free delivery across Morocco'});
Object.assign(ar, {'Livraison gratuite':'توصيل فابور','Livraison gratuite partout au Maroc':'توصيل فابور فالمغرب كامل'});
Object.assign(es, {'Livraison gratuite':'Entrega gratis','Livraison gratuite partout au Maroc':'Entrega gratis en todo Marruecos'});

Object.assign(en, {'Ville, quartier, rue, numéro et repère utile…':'City, area, street, building number and a useful landmark…','Gratuit':'Free','· Paiement à la livraison':'· Cash on delivery'});
Object.assign(ar, {'Ville, quartier, rue, numéro et repère utile…':'المدينة، الحومة، الزنقة، النمرة وشي بلاصة معروفة قريبة…','Gratuit':'فابور','· Paiement à la livraison':'· الخلاص عند التوصيل'});
Object.assign(es, {'Ville, quartier, rue, numéro et repère utile…':'Ciudad, barrio, calle, número y punto de referencia…','Gratuit':'Gratis','· Paiement à la livraison':'· Pago contra entrega'});

Object.assign(en, {'Approchez la carte':'Bring the card closer','Carte NFC détectée':'NFC card detected','Profil 5Tap':'5Tap profile','Appeler':'Call','Site web':'Website','Tap. Connexion. Action.':'Tap. Connect. Go.','Votre carte ouvre le bon lien au bon moment.':'Your card opens the right link at the right moment.'});
Object.assign(ar, {'Approchez la carte':'قرب الكارطة','Carte NFC détectée':'تقرات كارطة NFC','Profil 5Tap':'بروفايل 5Tap','Appeler':'عيط','Site web':'الموقع','Tap. Connexion. Action.':'قرب الكارطة وتواصل.','Votre carte ouvre le bon lien au bon moment.':'الكارطة ديالك كتحل الرابط فالحين.'});
Object.assign(es, {'Approchez la carte':'Acerca la tarjeta','Carte NFC détectée':'Tarjeta NFC detectada','Profil 5Tap':'Perfil 5Tap','Appeler':'Llamar','Site web':'Sitio web','Tap. Connexion. Action.':'Toca. Conecta. Listo.','Votre carte ouvre le bon lien au bon moment.':'Tu tarjeta abre el enlace adecuado en el momento preciso.'});

Object.assign(en,{'Réduction':'Discount'});Object.assign(ar,{'Réduction':'التخفيض'});Object.assign(es,{'Réduction':'Descuento'});
Object.assign(en,{'Nom et prénom':'First and last name','Ex. Tanger, Casablanca, Rabat…':'E.g. Tangier, Casablanca, Rabat…','La personnalisation, l’adresse complète et les précisions seront confirmées avec notre support sur WhatsApp.':'Customisation, the full address and other details will be confirmed with our support team on WhatsApp.'});
Object.assign(ar,{'Nom et prénom':'الاسم والنسب','Ex. Tanger, Casablanca, Rabat…':'مثال: طنجة، كازا، الرباط…','La personnalisation, l’adresse complète et les précisions seront confirmées avec notre support sur WhatsApp.':'التخصيص والعنوان كامل والتفاصيل غادي نأكدوهم معاك فواتساب.'});
Object.assign(es,{'Nom et prénom':'Nombre y apellidos','Ex. Tanger, Casablanca, Rabat…':'Ej. Tánger, Casablanca, Rabat…','La personnalisation, l’adresse complète et les précisions seront confirmées avec notre support sur WhatsApp.':'La personalización, la dirección completa y los detalles se confirmarán con nuestro equipo por WhatsApp.'});

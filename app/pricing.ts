type PricedProduct={price:number;compareAtPrice?:number;metadata?:Record<string,unknown>};

export function compareAtPrice(product:PricedProduct){
 const value=Number(product.compareAtPrice??product.metadata?.compareAtPrice);
 return Number.isFinite(value)&&value>product.price?value:undefined;
}

export function hasCurrentCatalog(products:readonly {id:string;slug?:string}[]){
 return ['carte-visite','carte-visite-personnalisee'].every(id=>products.some(p=>p.id===id||p.slug===id));
}

export function deliveryFee(settings:{tangierShipping:number;moroccoShipping:number},city=''){
 const normalized=city.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const value=Number(['tanger','tangier','طنجة'].includes(normalized)?settings.tangierShipping:settings.moroccoShipping);
 return Number.isFinite(value)&&value>=0?value:0;
}

export function orderTotals(subtotal:number,shipping:number,discount=0){
 if(![subtotal,shipping,discount].every(value=>Number.isFinite(value)&&value>=0))throw new Error('Montant invalide.');
 const appliedDiscount=Math.min(discount,subtotal);
 return {subtotal,shipping,discount:appliedDiscount,total:Math.round((subtotal-appliedDiscount+shipping)*100)/100};
}

type OrderMessage={reference:string;name:string;phone:string;city:string;items:{name:string;price:number;quantity:number}[];subtotal:number;shipping:number;total:number;personalization:string;paymentTerms:string;promoCode?:string;discount?:number};
export function orderWhatsAppText(order:OrderMessage,language:'fr'|'ar'|'en'|'es'='fr'){
 const copy={
  fr:{locale:'fr-MA',hello:'Bonjour 5Tap, je confirme ma commande',client:'Client',phone:'Téléphone',city:'Ville',products:'Produits',custom:'Personnalisation',subtotal:'Sous-total',promo:'Code promo',discount:'Remise',shipping:'Livraison',free:'Gratuite',total:'Total',payment:'Conditions de paiement',followup:'Merci de confirmer avec moi la destination de la carte, l’adresse complète et les précisions utiles.'},
  ar:{locale:'ar-MA',hello:'سلام 5Tap، كنأكد الطلب ديالي',client:'الزبون',phone:'النمرة',city:'المدينة',products:'المنتوجات',custom:'التخصيص',subtotal:'ثمن المنتوجات',promo:'كود التخفيض',discount:'التخفيض',shipping:'التوصيل',free:'داخل فالثمن',total:'المجموع',payment:'شروط الخلاص',followup:'عافاكم نأكدو وجهة الكارطة والعنوان كامل والتفاصيل المهمة.'},
  en:{locale:'en-GB',hello:'Hello 5Tap, I confirm my order',client:'Customer',phone:'Phone',city:'City',products:'Products',custom:'Customisation',subtotal:'Subtotal',promo:'Promo code',discount:'Discount',shipping:'Delivery',free:'Included',total:'Total',payment:'Payment terms',followup:'Please confirm the card destination, full address and useful details with me.'},
  es:{locale:'es-ES',hello:'Hola 5Tap, confirmo mi pedido',client:'Cliente',phone:'Teléfono',city:'Ciudad',products:'Productos',custom:'Personalización',subtotal:'Subtotal',promo:'Código promocional',discount:'Descuento',shipping:'Envío',free:'Incluido',total:'Total',payment:'Condiciones de pago',followup:'Por favor, confirma conmigo el destino de la tarjeta, la dirección completa y los detalles necesarios.'},
 }[language];
 const money=(value:number)=>value.toLocaleString(copy.locale)+' DH';
 return [`${copy.hello} ${order.reference}.`,'',`${copy.client} : ${order.name}`,`${copy.phone} : ${order.phone}`,`${copy.city} : ${order.city}`,'',`${copy.products} :`,...order.items.map(p=>`• ${p.name} × ${p.quantity} — ${money(p.price*p.quantity)}`),'',`${copy.custom} : ${order.personalization}`,'',`${copy.subtotal} : ${money(order.subtotal)}`,...(order.promoCode?[`${copy.promo} : ${order.promoCode}`,`${copy.discount} : -${money(order.discount||0)}`]:[]),`${copy.shipping} : ${order.shipping===0?copy.free:money(order.shipping)}`,`${copy.total} : ${money(order.total)}`,`${copy.payment} : ${order.paymentTerms}`,'',copy.followup].join('\n');
}

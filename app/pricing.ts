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
export function orderWhatsAppText(order:OrderMessage){
 const money=(value:number)=>value.toLocaleString('fr-MA')+' DH';
 return [`Bonjour 5Tap, je confirme ma commande ${order.reference}.`,'',`Client : ${order.name}`,`Téléphone : ${order.phone}`,`Ville : ${order.city}`,'','Produits :',...order.items.map(p=>`• ${p.name} × ${p.quantity} — ${money(p.price*p.quantity)}`),'',`Personnalisation : ${order.personalization}`,'',`Sous-total : ${money(order.subtotal)}`,...(order.promoCode?[`Code promo : ${order.promoCode}`,`Remise : -${money(order.discount||0)}`]:[]),`Livraison : ${order.shipping===0?'Gratuite':money(order.shipping)}`,`Total : ${money(order.total)}`,`Conditions de paiement : ${order.paymentTerms}`,'','Merci de confirmer avec moi la destination de la carte, l’adresse complète et les précisions utiles.'].join('\n');
}

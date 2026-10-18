import test from 'node:test';
import assert from 'node:assert/strict';
import {products} from '../app/catalog.ts';
import {compareAtPrice,deliveryFee,hasCurrentCatalog,orderTotals,orderWhatsAppText} from '../app/pricing.ts';

test('all six cards and packs have the approved price minus 40 DH',()=>{
 const expected={'carte-visite':[179,139],'carte-visite-personnalisee':[249,209],'carte-google':[149,109],essentiel:[249,209],pro:[299,259],prestige:[399,359]};
 for(const p of products){assert.deepEqual([compareAtPrice(p),p.price],expected[p.id]);assert.equal(compareAtPrice(p)-p.price,40)}
});

test('Supabase remains authoritative when the standard-card price changes',()=>{
 assert.equal(hasCurrentCatalog(products),true);
 assert.equal(hasCurrentCatalog(products.map(p=>({...p,price:99}))),true);
 assert.equal(hasCurrentCatalog(products.filter(p=>p.id!=='carte-visite-personnalisee')),false);
 assert.equal(compareAtPrice({price:139,metadata:{compareAtPrice:179}}),179);
 assert.equal(compareAtPrice({price:200,metadata:{compareAtPrice:179}}),undefined);
 assert.equal(compareAtPrice({price:139}),undefined);
});

test('delivery costs 35 DH once per order in every city and quantity',()=>{
 const settings={tangierShipping:35,moroccoShipping:35};
 for(const city of ['','Tanger','TANGIER','طنجة','Casablanca','Rabat']){
  for(const quantity of [1,2,50])assert.equal(orderTotals(139*quantity,deliveryFee(settings,city)).total,139*quantity+35);
 }
 const subtotal=products.reduce((sum,p)=>sum+p.price*2,0);
 assert.equal(orderTotals(subtotal,35).total,subtotal+35);
});

test('collaboration discounts affect products only and preserve whole-dirham totals',()=>{
 // Existing STATI rule rounds the discounted merchandise total down.
 const subtotal=209,discount=subtotal-Math.floor(subtotal*.85);
 assert.deepEqual(orderTotals(subtotal,35,discount),{subtotal:209,shipping:35,discount:32,total:212});
 assert.equal(orderTotals(139,35,999).total,35);
 assert.throws(()=>orderTotals(139,-35));assert.throws(()=>orderTotals(NaN,35));
});

test('WhatsApp uses the server-confirmed merchandise, shipping and final total',()=>{
 const text=orderWhatsAppText({reference:'5TAP-TEST',name:'Test',phone:'+212600000000',city:'Rabat',items:[{name:'Pack Essentiel',price:209,quantity:2}],subtotal:418,shipping:35,total:453,personalization:'Non',paymentTerms:'Paiement à la livraison.'});
 assert.ok(text.includes('Pack Essentiel × 2 — 418 DH'));
 assert.ok(text.includes('Sous-total : 418 DH\nLivraison : 35 DH\nTotal : 453 DH'));
 assert.ok(!/incluse|gratuite/i.test(text));
});

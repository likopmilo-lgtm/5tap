import test from 'node:test';
import assert from 'node:assert/strict';
import {products} from '../app/catalog.ts';
import {compareAtPrice,deliveryFee,hasCurrentCatalog,orderTotals,orderWhatsAppText} from '../app/pricing.ts';

test('all six cards and packs have the approved fixed price without sale anchors',()=>{
 const expected={'carte-visite':179,'carte-visite-personnalisee':249,'carte-google':149,essentiel:249,pro:299,prestige:399};
 for(const p of products){assert.equal(p.price,expected[p.id]);assert.equal(compareAtPrice(p),undefined)}
});

test('Supabase remains authoritative when the standard-card price changes',()=>{
 assert.equal(hasCurrentCatalog(products),true);
 assert.equal(hasCurrentCatalog(products.map(p=>({...p,price:99}))),true);
 assert.equal(hasCurrentCatalog(products.filter(p=>p.id!=='carte-visite-personnalisee')),false);
 assert.equal(compareAtPrice({price:139,metadata:{compareAtPrice:179}}),179);
 assert.equal(compareAtPrice({price:200,metadata:{compareAtPrice:179}}),undefined);
 assert.equal(compareAtPrice({price:139}),undefined);
});

test('delivery is free in every city and quantity without changing merchandise totals',()=>{
 const settings={tangierShipping:0,moroccoShipping:0};
 for(const city of ['','Tanger','TANGIER','طنجة','Casablanca','Rabat']){
  for(const quantity of [1,2,50])assert.equal(orderTotals(179*quantity,deliveryFee(settings,city)).total,179*quantity);
 }
 const subtotal=products.reduce((sum,p)=>sum+p.price*2,0);
 assert.equal(orderTotals(subtotal,0).total,subtotal);
 assert.equal(deliveryFee({tangierShipping:NaN,moroccoShipping:NaN}),0);
 assert.equal(deliveryFee({tangierShipping:10,moroccoShipping:20},'Tanger'),10);
});

test('collaboration discounts affect products only and preserve whole-dirham totals',()=>{
 // Existing STATI rule rounds the discounted merchandise total down.
 const subtotal=249,discount=subtotal-Math.floor(subtotal*.85);
 assert.deepEqual(orderTotals(subtotal,0,discount),{subtotal:249,shipping:0,discount:38,total:211});
 assert.equal(orderTotals(179,0,999).total,0);
 assert.throws(()=>orderTotals(139,-35));assert.throws(()=>orderTotals(NaN,35));
});

test('WhatsApp uses the server-confirmed merchandise, shipping and final total',()=>{
 const text=orderWhatsAppText({reference:'5TAP-TEST',name:'Test',phone:'+212600000000',city:'Rabat',items:[{name:'Pack Essentiel',price:249,quantity:2}],subtotal:498,shipping:0,total:498,personalization:'Non',paymentTerms:'Paiement à la livraison.'});
 assert.ok(text.includes('Pack Essentiel × 2 — 498 DH'));
 assert.ok(text.includes('Sous-total : 498 DH\nLivraison : Gratuite\nTotal : 498 DH'));
});

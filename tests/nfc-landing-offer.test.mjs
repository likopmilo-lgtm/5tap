import test from 'node:test';
import assert from 'node:assert/strict';
import {products} from '../app/catalog.ts';
import {landingProduct} from '../app/nfc-landing-offer.ts';
import {compareAtPrice} from '../app/pricing.ts';
test('the custom card keeps the real 249 DH selling price and owner-approved 329 DH reference',()=>{
 const p=landingProduct(products.find(p=>p.id==='carte-visite-personnalisee'),{});
 assert.equal(p.price,249);assert.equal(compareAtPrice(p),329);assert.equal(compareAtPrice(p)-p.price,80);assert.equal(p.custom,true);
 const standard=landingProduct(products.find(p=>p.id==='carte-visite'),{});
 assert.equal(standard.price,179);assert.equal(compareAtPrice(standard),229);
});
test('Supabase can change or hide old prices, including the metadata fallback',()=>{
 const product={...products[1],metadata:{compareAtPrice:450}};
 assert.equal(compareAtPrice(landingProduct(product,{nfcLandingReferencePrices:{'carte-visite-personnalisee':null}})),undefined);
 assert.equal(compareAtPrice(landingProduct(product,{nfcLandingReferencePrices:{'carte-visite-personnalisee':349}})),349);
 assert.equal(compareAtPrice(landingProduct(product,{nfcLandingReferencePrices:{'carte-visite-personnalisee':200}})),undefined);
});
